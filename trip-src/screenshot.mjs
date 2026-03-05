import puppeteer from 'puppeteer';

const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();
await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });

await page.goto('http://localhost:5173/CHUCKCHARGING/trip/', { waitUntil: 'networkidle0', timeout: 15000 });
await page.waitForSelector('.cal-card', { timeout: 10000 });
await new Promise(r => setTimeout(r, 1500));

// Screenshot 1: top of Day 1
await page.screenshot({ path: 'shot-day1-top.png' });

// Scroll down to see more cards
await page.evaluate(() => window.scrollBy(0, 900));
await new Promise(r => setTimeout(r, 800));
await page.screenshot({ path: 'shot-day1-mid.png' });

// Scroll more
await page.evaluate(() => window.scrollBy(0, 900));
await new Promise(r => setTimeout(r, 800));
await page.screenshot({ path: 'shot-day1-bottom.png' });

// Click Day 2 tab
const tabs = await page.$$('nav button');
if (tabs[1]) {
  await tabs[1].click();
  await new Promise(r => setTimeout(r, 800));
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: 'shot-day2-top.png' });

  await page.evaluate(() => window.scrollBy(0, 900));
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: 'shot-day2-mid.png' });
}

// Click room tab
if (tabs[2]) {
  await tabs[2].click();
  await new Promise(r => setTimeout(r, 800));
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: 'shot-room.png' });
}

await browser.close();
console.log('Done! Screenshots saved.');
