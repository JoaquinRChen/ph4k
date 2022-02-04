# PH4K

> Rip video from p***hub at highest quality

## Install

- Install nodejs.
- Install ts-node globally: `npm i -g ts-node`.
- Install Chrome to [default path](/src/utils/puppeteer.ts#L10) for puppeteer-core to resolve video url.
- Install FFmpeg to merge video segments.
- Clone this repository.
- Run script below to install this cli:

```bash
npm link
```

## Usage

### Command

```bash
ph4k [url] [...options]
```

### Example

```bash
ph4k "<VIDEO_URL>"
ph4k "<VIDEO_URL>" --proxy=<PROXY_URL> --headless --download-dir=<DOWNLOAD_DIR>
```

`ph4k` will download video at the highest quality only, if you do not log in, downloading may fail.

## Options and Config

| Option           | Key         | Data type | Description           |
|------------------|-------------|-----------|-----------------------|
| --proxy          | proxy       | string    | Proxy url.            |
| --headless       | headless    | boolean   | Run in headless mode. |
| --download-dir   | downloadDir | string    | Download directory.   |

There are 3 ways to set config:
- Pass from command line argv.
- Use `ph4k set <key>=<value>` command to set config.
- Edit configs in file `~/.ph4k/config.json`.

## Cookies

Pornhub requires login to stream video with quality higher than 1080p.

There are two ways to use cookies:

1. Use `phk4 login` command to log in pornhub.
2. Save cookies in json to file manually at `~/.ph4k/pornhub-cookies.json`. Cookies can be exported with extension like [EditThisCookie](https://www.editthiscookie.com/) from browser.

## Download path

The default download path is `~/.ph4k/`.

