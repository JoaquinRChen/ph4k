import {ScraperOptions} from '../options';
import {newBrowser} from '../utils/puppeteer';
import fs from 'fs-extra';
import {PORNHUB_COOKIES_PATH} from './login';
import qs from 'qs';
import path from 'path';
import {APP_DATA_DIR} from '../utils/paths';
import {download} from '../io/download';
import {exec} from 'child_process';
import slugify from 'slugify';

export type RipArgs = {
    url: string;
} & ScraperOptions

/**
 * Rip a pornhub video
 * @param args
 */
export const rip = async (args: RipArgs) => {

    // Resolve video segment url with puppeteer
    const result = await getVideoUrl(args);
    console.log(result);

    // Create a directory for the video
    const dir = path.join(APP_DATA_DIR, result.viewKey!);
    await fs.ensureDir(dir);

    // Download video segments
    const files = new Array<string>();

    for (let i = 1; i <= 1000; i++) {
        try {
            const file = await downloadSegment(result.segment, dir, i, args.proxy);
            files.push(`file '${file}'`);
        } catch (e) {
            break;
        }
    }

    // Merge video segments with ffmpeg
    const filesPath = path.join(dir, 'files.txt');
    await fs.outputFile(filesPath, files.join('\n'));
    const mergedPath = path.join(dir, slugify(`${result.title}.${result.viewKey}.mp4`, '.'));
    exec(`ffmpeg -f concat -safe 0 -i ${filesPath} -c copy ${mergedPath}`);
    console.log('file saved to', mergedPath);

    // Remove temporary files
    fs.readdirSync(dir).forEach(file => {
        if (file === 'files.txt' || path.extname(file) === '.ts') {
            fs.unlinkSync(path.join(dir, file));
        }
    });
}

/**
 * Get video segment url
 * @param args
 */
export const getVideoUrl = async (args: RipArgs): Promise<{ segment: VideoSegment, title: string, viewKey?: string }> => {
    return new Promise(async (resolve, reject) => {
        const {url, ...options} = args;
        const browser = await newBrowser({...options});
        const page = await browser.newPage();
        page.on('request', async (req) => {
            const segmentUrl = req.url();
            if (segmentUrl.includes('seg-1-')) {
                const title = await page.title();
                resolve({segment: getVideoSegmentComponents(segmentUrl), title, viewKey: getViewKey(url)});
                try {
                    await page.goBack()
                    await page.close();
                    await browser.close();
                } catch (e) {
                    console.error(e)
                }
            }
        });

        await page.setCookie(...(await fs.readJSON(PORNHUB_COOKIES_PATH)));
        await page.goto(url);

    })
}

type VideoSegment = {
    sampleUrl: string;
    query: string;
    urlPath: string;
}

const getVideoSegmentComponents = (segmentUrl: string): VideoSegment => {
    const [urlPath, query] = segmentUrl.split('?');
    const basename = path.basename(urlPath);
    return {sampleUrl: segmentUrl, query, urlPath: urlPath.replace(basename, '')};
}

const getViewKey = (url: string): string | undefined => {
    try {
        const query = url.split('?')[1];
        const {viewkey} = qs.parse(query);
        return viewkey as string;
    } catch (e) {
        return undefined;
    }
}

const downloadSegment = async (segment: VideoSegment, dir: string, index: number, proxy?: string): Promise<string> => {
    const filename = `seg-${index}-f1-v1-a1.ts`
    const url = `${segment.urlPath}${filename}?${segment.query}`;
    const dist = path.join(dir, filename);
    if (!(await fs.pathExists(dist))) {
        await download({url, dist: path.join(dir, filename), proxy});
    } else {
        console.log(`${dist} already exists`)
    }
    return dist;
}

