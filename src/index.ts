import { Deposit } from "./deposit";
import { run } from "./puppeteer";

const depositsToRead: Deposit[] = [
  { title: "Elite Funds Go!", subscription: 1 },
  { title: "Elite Funds Go!", subscription: 2 },
];

run(depositsToRead);
