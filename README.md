# IdeaBank deposit value fetcher

A tool that fetches and shows the latest value of deposits in IdeaBank.

The data is fetched from <https://www.ideabank.pl/lokata-strukturyzowana-wartosc-biezaca> by
crawling it with either [Puppeteer](https://github.com/puppeteer/puppeteer) or
[Playwright](https://playwright.dev/) (TODO).

## Installation and configuration

Go to [src/index.ts](./src/index.ts) and configure the `depositsToRead` array to
your desire. You can enter any valid deposit name and subscription number.

Then, run the following to install the dependencies:

```sh
npm install
```

## Usage

To run the script, run:

```sh
npm start
```

The browser will be run in _headless_ mode (no UI will be visible).

The data should appear in the console after a short while.
