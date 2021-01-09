import { Browser, chromium, Page } from "playwright";
import { Deposit } from "./deposit";

async function withBrowser<R>(
  callback: (browser: Browser) => Promise<R>,
): Promise<R> {
  const browser = await chromium.launch();

  return callback(browser).finally(() => browser.close());
}

async function openIdeaBankPage(browser: Browser) {
  const page = await browser.newPage();
  await page.goto(
    "https://www.ideabank.pl/lokata-strukturyzowana-wartosc-biezaca",
  );
  await page.click(".cookie_yes");

  return page;
}

const readDepositValue = async (deposit: Deposit, page: Page) => {
  await page.click(".structure-name-label");

  const depositNameButton = await page.$(
    `xpath=//a/span[contains(., '${deposit.title}')]`,
  );
  if (!depositNameButton) {
    throw new Error(`Cannot find span with deposit title "${deposit.title}"`);
  }

  await depositNameButton.click();

  await page.click(".structure-number-label");

  const subscriptionNumberButton = await page.waitForSelector(
    `xpath=//a/span[starts-with(., '${deposit.subscription}')]`,
    {
      timeout: 2000,
    },
  );
  if (!subscriptionNumberButton) {
    throw new Error(
      `Cannot find span with subscription number ${deposit.subscription}`,
    );
  }

  await subscriptionNumberButton.click();

  const valueRow = await page.waitForSelector(
    ".current-value-result tbody tr",
    { timeout: 2000 },
  );
  if (!valueRow) {
    throw new Error("Cannot find the rows in the table with deposit values");
  }

  return valueRow.evaluate((element) => ({
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
