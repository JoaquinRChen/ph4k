# PH4K

> Rip video from p***hub at highest quality

## Install

- Install nodejs.
- Install ts-node globally: `npm i -g ts-node`.
- Install Chrome to [default path](/src/utils/puppeteer.ts#L10).
- Clone this repository.
- Run script below to install this cli:

```bash
npm link
```

## Usage

```bash
ph4k [url] [...options]
ph4k "<VIDEO_URL>" --proxy=<PROXY_URL> --headless
```

## Cookies

Pornhub requires login to stream video with quality higher than 1080p.

There are two ways to use cookies:

1. Use `phk4 login` command to log in pornhub.
2. Save cookies in json to file manually at `~/.ph4k/pornhub-cookies.json`. Cookies can be exported with extension like [EditThisCookie](https://www.editthiscookie.com/) from browser.

## Download path

```bash
~/.ph4k/
```

