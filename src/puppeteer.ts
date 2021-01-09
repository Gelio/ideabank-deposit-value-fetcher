import puppeteer from "puppeteer";
import { Deposit } from "./deposit";

async function withBrowser<R>(
  callback: (browser: puppeteer.Browser) => Promise<R>,
): Promise<R> {
  const browser = await puppeteer.launch();

  return callback(browser).finally(() => browser.close());
}

async function openIdeaBankPage(browser: puppeteer.Browser) {
  const page = await browser.newPage();
  await page.goto(
    "https://www.ideabank.pl/lokata-strukturyzowana-wartosc-biezaca",
  );
  await page.click(".cookie_yes");

  return page;
}

const readDepositValue = async (deposit: Deposit, page: puppeteer.Page) => {
  await page.click(".structure-name-label");

  const [depositNameButton] = await page.$x(
    `//a/span[contains(., '${deposit.title}')]`,
  );
  if (!depositNameButton) {
    throw new Error(`Cannot find span with deposit title "${deposit.title}"`);
  }

  await depositNameButton.click();

  await page.click(".structure-number-label");

  const subscriptionNumberButton = await page
    .waitForXPath(`//a/span[starts-with(., '${deposit.subscription}')]`, {
      timeout: 2000,
    })
    .catch(() =>
      Promise.reject(
        new Error(
          `Cannot find span with subscription number ${deposit.subscription}`,
        ),
      ),
    );

  await subscriptionNumberButton.click();

  const valueRow = await page.waitForSelector(".current-value-result tbody tr");

  return valueRow?.evaluate((element) => ({
    date: element.childNodes[0].textContent,
    value: element.children[1].textContent,
  }));
};

export const run = (deposits: Deposit[]) =>
  withBrowser(async (browser) => {
    const page = await openIdeaBankPage(browser);

    for (const deposit of deposits) {
      const depositValue = await readDepositValue(deposit, page);
      console.log(deposit, depositValue);
    }
  }).catch(console.error);
