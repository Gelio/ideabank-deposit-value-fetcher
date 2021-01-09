import { Deposit } from "./deposit";
import { run as puppeteerRun } from "./puppeteer";
import { run as playwrightRun } from "./playwright";

const engine: "puppeteer" | "playwright" = "playwright";

const depositsToRead: Deposit[] = [
  { title: "Elite Funds Go!", subscription: 1 },
  { title: "Elite Funds Go!", subscription: 2 },
];

(async (engine: string) => {
  switch (engine) {
    case "playwright":
      playwrightRun(depositsToRead);
      break;
    case "puppeteer":
      puppeteerRun(depositsToRead);
      break;
    default:
      console.error("Unknown engine", engine);
      break;
  }
})(engine);
