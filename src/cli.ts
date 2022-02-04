#!/usr/bin/env ts-node
import {APP_DATA_DIR} from "./utils/paths";
import {getConfig, getOptions, setConfig} from "./utils/config";
import {login, loginPremium} from './scrapers/login';
import {rip} from './scrapers/rip';

console.log('data dir:', APP_DATA_DIR);


const url = process.argv[2];

const options = getOptions();



(async () => {
    if (url === 'login') {
        await login();
    } else if (url === 'login-premium') {
        await loginPremium();
    } else if (url === 'set') {
        const [key, value] = process.argv[3].split('=');
        const result = setConfig({key, value});
        console.log('config:', result);
    } else {
        console.log('options:', options);
        await rip({url, ...options});
    }
})()
