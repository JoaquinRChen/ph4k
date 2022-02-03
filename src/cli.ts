#!/usr/bin/env ts-node
import {APP_DATA_DIR} from "./utils/paths";
import {getConfig} from "./utils/config";
import {getOptions} from "./options";
import {login} from './scrapers/login';
import {rip} from './scrapers/rip';

console.log('data dir:', APP_DATA_DIR);


const url = process.argv[2];

const options = getOptions();

const {proxy, headless} = getConfig();
if (!options.proxy) {
    options.proxy = proxy;
    options.headless = headless;
}
if (proxy) {
    console.log('using proxy for download:', proxy);
}

console.log('options:', options);


(async () => {
    if (url === 'login') {
        await login();
    } else if (url === 'login-premium') {
        // login();
    } else {
        await rip({url, ...options});
    }
})()
