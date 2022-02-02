import {newBrowser} from '../utils/puppeteer';
import fs from 'fs-extra';
import {APP_DATA_DIR} from '../utils/paths';
import path from 'path';

export const PORNHUB_COOKIES_PATH = path.join(APP_DATA_DIR, './pornhub-cookies.json');

export const PORNHUB_LOGIN_URL = 'https://www.pornhub.com/login';

/**
 * launch a new browser for user to login manually.
 */
export const login = async () => {
    const browser = await newBrowser();
    const page = await browser.newPage();
    page.on('load', async () => {
        console.log(`Page loaded, please login. cookies will be saved to ${PORNHUB_COOKIES_PATH} once login is complete.`);
        const cookies = await page.cookies();
        await fs.ensureDir(path.resolve(APP_DATA_DIR));
        await fs.outputJSON(PORNHUB_COOKIES_PATH, cookies);
    });
    await page.setCookie(...(await fs.readJSON(PORNHUB_COOKIES_PATH)));
    await page.goto(PORNHUB_LOGIN_URL);
};
