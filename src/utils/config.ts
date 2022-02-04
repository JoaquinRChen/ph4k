import fs from 'fs-extra';
import path from "path";
import {APP_DATA_DIR} from "./paths";

export const CONFIG_FILEPATH = path.join(APP_DATA_DIR, 'config.json');

export const getConfig = (): any => {
    return fs.existsSync(CONFIG_FILEPATH) ? fs.readJSONSync(CONFIG_FILEPATH) : {};
}

export const setConfig = ({key, value}: { key: string, value?: any }) => {
    const config = getConfig();
    if (value) {
        switch (key) {
            case 'headless':
            case 'abortOnError':
                config[key] = value === 'true';
                break;
            case 'timeout':
            case 'clock':
                config[key] = Number(value);
                break;
            default:
                config[key] = value;
                break;
        }
    } else {
        delete config[key];
    }
    fs.outputJSONSync(CONFIG_FILEPATH, config);
    return config;
}

export interface ScraperOptions {
    headless?: boolean;
    downloadDir?: string;
    abortOnError?: boolean;
    proxy?: string;
    timeout?: number;
    clock?: number;
}

/**
 * Get options from command line argv
 */
export const getOptions = () => {
    const options: ScraperOptions = {}

    process.argv.forEach(a => {
        try {
            if (a === '--headless') {
                options.headless = true;
            } else if (a === '--abort-on-error') {
                options.abortOnError = true;
            } else if (a.indexOf('--timeout=') === 0) {
                const split = a.split('=');
                const n = split[1];
                const timeout = parseInt(n);
                if (!isNaN(timeout)) {
                    options.timeout = timeout;
                }
            } else if (a.indexOf('--clock=') === 0) {
                const split = a.split('=');
                const n = split[1];
                const clock = parseInt(n);
                if (!isNaN(clock)) {
                    options.clock = clock;
                }
            } else if (a.indexOf('--proxy=') === 0) {
                const split = a.split('=');
                options.proxy = split[1];
            } else if (a.indexOf('--download-dir=') === 0) {
                const split = a.split('=');
                options.downloadDir = split[1];
            }
        } catch (e) {
            console.error(e);
        }
    });

    const config = getConfig();

    Object.keys(config).forEach(key => {
        // @ts-ignore
        if (options[key] === undefined) {
            // @ts-ignore
            options[key] = config[key];
        }
    });

    return options;
}

