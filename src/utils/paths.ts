import os from 'os';
import path from 'path';

export const APP_NAME = 'ph4k';

/**
 * app data dir
 */
export const APP_DATA_DIR = path.join(os.homedir(), `.config/${APP_NAME}`);

export const TEMP_DIR = path.join(os.tmpdir(), APP_NAME);

export const DEFAULT_DOWNLOAD_DIR = path.join(os.homedir(), `Downloads/${APP_NAME}`);
