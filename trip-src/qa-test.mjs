import puppeteer from 'puppeteer';

const URL = 'http://localhost:5173/CHUCKCHARGING/trip/';
const results = [];
let page, browser;

function log(test, pass, detail = '') {
  const icon = pass ? 'PASS' : 'FAIL';
  results.push({ test, pass, detail });
  console.log(`[${icon}] ${test}${detail ? ' — ' + detail : ''}`);
}

async function setup() {
  browser = await puppeteer.launch({ headless: true });
  page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  page.on('console', msg => {
    if (msg.type() === 'error') console.log('  [CONSOLE ERROR]', msg.text());
  });
  page.on('pageerror', err => console.log('  [PAGE ERROR]', err.message));
}

async function testHeader() {
  await page.goto(URL, { waitUntil: 'networkidle0', timeout: 15000 });
  await page.waitForSelector('header', { timeout: 5000 });

  // Logo
  const logo = await page.$('header img');
  log('Header: logo visible', !!logo);

  // Title
  const title = await page.$eval('header span', el => el.textContent);
  log('Header: title text', title.includes('Fun鬆二日遊'), title);

  // Countdown rings
  const rings = await page.$$('header svg');
  log('Header: countdown rings', rings.length >= 4, `${rings.length} rings`);
}

async function testDay1() {
  // Should be on Day 1 by default
  const hero = await page.$eval('h2', el => el.textContent);
  log('Day1: hero title', hero === 'Day 1', hero);

  // Cards exist
  const cards = await page.$$('.cal-card');
  log('Day1: has cards', cards.length >= 5, `${cards.length} cards`);

  // First card (office/logo)
  const firstImg = await page.$('.cal-card img');
  const firstSrc = await firstImg?.evaluate(el => el.src);
  log('Day1: first card has logo', firstSrc?.includes('ragic.com'), firstSrc?.substring(0, 50));

  // Navigation button exists
  const navBtns = await page.$$('a[href*="maps.app.goo.gl"]');
  log('Day1: nav buttons exist', navBtns.length > 0, `${navBtns.length} nav links`);

  // 石港春帆 card — meal picker CTA
  const mealCTA = await page.evaluate(() => {
    const btns = [...document.querySelectorAll('button')];
    return btns.some(b => b.textContent.includes('點我選擇你要吃的餐點'));
  });
  log('Day1: meal picker CTA visible', mealCTA);

  // Tag colors — check different tags have different colors
  const tags = await page.evaluate(() => {
    const spans = [...document.querySelectorAll('.cal-card span')];
    const tagSpans = spans.filter(s => {
      const cl = s.className;
      return cl.includes('bg-') && cl.includes('text-white') && cl.includes('rounded-lg');
    });
    const classes = tagSpans.map(s => s.className);
    const unique = new Set(classes);
    return { total: tagSpans.length, unique: unique.size };
  });
  log('Day1: tags have different colors', tags.unique > 1, `${tags.total} tags, ${tags.unique} unique styles`);

  // Tips (night market recommendations) — scroll to find
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await new Promise(r => setTimeout(r, 500));
  const tipsVisible = await page.evaluate(() => {
    return document.body.textContent.includes('推薦必吃');
  });
  log('Day1: tips section visible (no fold)', tipsVisible);
}

async function testMealPicker() {
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise(r => setTimeout(r, 300));

  // Find and click meal picker CTA
  const clicked = await page.evaluate(() => {
    const btn = [...document.querySelectorAll('button')].find(b => b.textContent.includes('點我選擇你要吃的餐點'));
    if (btn) { btn.click(); return true; }
    return false;
  });
  log('MealPicker: CTA clickable', clicked);
  await new Promise(r => setTimeout(r, 500));

  // Check name selector has warning style
  const nameWarning = await page.evaluate(() => {
    const select = document.querySelector('select');
    return select?.textContent.includes('請先選擇你是誰');
  });
  log('MealPicker: name warning visible', nameWarning);

  // Check hint text shows
  const hint = await page.evaluate(() => {
    return document.body.textContent.includes('請先選擇你是誰');
  });
  log('MealPicker: missing field hint', hint);

  // Select a name
  await page.select('select', 'Chuck');
  await new Promise(r => setTimeout(r, 300));

  // Select main course (first option) — or verify auto-fill already selected one
  const mainState = await page.evaluate(() => {
    // Match the exact OptionGrid label (uppercase tracking-wider)
    const labels = [...document.querySelectorAll('p')].filter(p => p.textContent.includes('主菜（'));
    if (labels.length === 0) return 'no-label';
    const grid = labels[0].parentElement;
    const buttons = grid?.querySelectorAll('button');
    if (!buttons || buttons.length === 0) return 'no-buttons';
    // Check if any button is already selected (has brand bg class)
    const selected = [...buttons].some(b => b.className.includes('bg-brand'));
    if (!selected) { buttons[0].click(); return 'clicked'; }
    return 'auto-filled';
  });
  log('MealPicker: main course available', mainState !== 'no-label' && mainState !== 'no-buttons', mainState);
  await new Promise(r => setTimeout(r, 200));

  // Select dessert (first option)
  await page.evaluate(() => {
    const grids = [...document.querySelectorAll('p')].filter(p => p.textContent.includes('甜點'));
    const grid = grids[0]?.parentElement;
    grid?.querySelector('button')?.click();
  });
  await new Promise(r => setTimeout(r, 200));

  // Select drink (first option)
  await page.evaluate(() => {
    const grids = [...document.querySelectorAll('p')].filter(p => p.textContent.includes('飲品'));
    const grid = grids[0]?.parentElement;
    grid?.querySelector('button')?.click();
  });
  await new Promise(r => setTimeout(r, 200));

  // Check hint text
  const noteHint = await page.evaluate(() => {
    return document.body.textContent.includes('只有這餐需要先選，其他餐不用');
  });
  log('MealPicker: hint text visible', noteHint);

  // Submit button should be enabled
  const submitEnabled = await page.evaluate(() => {
    const btn = [...document.querySelectorAll('button')].find(b => b.textContent.includes('送出'));
    return btn && !btn.disabled;
  });
  log('MealPicker: submit button enabled', submitEnabled);

  // Take screenshot before submit
  await page.screenshot({ path: 'qa-meal-before-submit.png' });

  // Click submit
  await page.evaluate(() => {
    const btn = [...document.querySelectorAll('button')].find(b => b.textContent === '送出');
    btn?.click();
  });
  await new Promise(r => setTimeout(r, 1000));

  // Check success state
  const done = await page.evaluate(() => document.body.textContent.includes('Done'));
  log('MealPicker: shows Done after submit', done);

  const reselect = await page.evaluate(() => document.body.textContent.includes('重新選擇'));
  log('MealPicker: reselect button visible', reselect);

  await page.screenshot({ path: 'qa-meal-after-submit.png' });
}

async function testDay2() {
  // Click Day 2 tab
  const tabs = await page.$$('nav button');
  await tabs[1].click();
  await new Promise(r => setTimeout(r, 800));

  const hero = await page.$eval('h2', el => el.textContent);
  log('Day2: hero title', hero === 'Day 2', hero);

  const cards = await page.$$('.cal-card');
  log('Day2: has cards', cards.length >= 5, `${cards.length} cards`);

  // Check 橙心手作 menu is visible (not folded)
  const menuVisible = await page.evaluate(() => {
    return document.body.textContent.includes('美饌迎賓五巧拼');
  });
  log('Day2: 橙心手作 menu visible (no fold)', menuVisible);

  // Check Herbelle tips visible
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await new Promise(r => setTimeout(r, 500));
  const herbelleTips = await page.evaluate(() => {
    return document.body.textContent.includes('漂浮冰紅茶');
  });
  log('Day2: Herbelle tips visible (no fold)', herbelleTips);

  // Check real photos (not unsplash for key locations)
  const images = await page.evaluate(() => {
    const imgs = [...document.querySelectorAll('.cal-card img')];
    return imgs.map(i => i.src);
  });
  const hasRealPhotos = images.some(s => s.includes('bobowin.blog') || s.includes('tony60533') || s.includes('mimigo'));
  log('Day2: using real local photos', hasRealPhotos);

  await page.screenshot({ path: 'qa-day2.png' });
}

async function testRoomPage() {
  const tabs = await page.$$('nav button');
  await tabs[2].click();
  await new Promise(r => setTimeout(r, 800));

  const hero = await page.$eval('h2', el => el.textContent);
  log('Room: hero title', hero === '住宿', hero);

  const cards = await page.$$('.cal-card');
  log('Room: has room cards', cards.length >= 7, `${cards.length} cards`);

  // Check member names visible
  const hasChuck = await page.evaluate(() => document.body.textContent.includes('Chuck'));
  log('Room: member names visible', hasChuck);

  await page.screenshot({ path: 'qa-room.png' });
}

async function testOrderPage() {
  const tabs = await page.$$('nav button');
  await tabs[3].click();
  await new Promise(r => setTimeout(r, 3000)); // Wait for GAS

  const hero = await page.$eval('h2', el => el.textContent);
  log('Order: hero title', hero === '點餐', hero);

  // Check progress bar or data loaded
  const hasContent = await page.evaluate(() => {
    return document.body.textContent.includes('已選') || document.body.textContent.includes('載入中');
  });
  log('Order: page content loaded', hasContent);

  await page.screenshot({ path: 'qa-order.png' });
}

async function testBottomNav() {
  // Check 4 tabs exist
  const tabs = await page.$$('nav button');
  log('BottomNav: 4 tabs', tabs.length === 4, `${tabs.length} tabs`);

  // Check tab labels
  const labels = await page.evaluate(() => {
    return [...document.querySelectorAll('nav button span')].map(s => s.textContent);
  });
  log('BottomNav: correct labels',
    labels.includes('Day 1') && labels.includes('Day 2') && labels.includes('住宿') && labels.includes('點餐'),
    labels.join(', ')
  );
}

async function testImages() {
  // Go back to Day 1
  const tabs = await page.$$('nav button');
  await tabs[0].click();
  await new Promise(r => setTimeout(r, 800));

  // Check all images loaded
  const brokenImages = await page.evaluate(() => {
    const imgs = [...document.querySelectorAll('img')];
    return imgs.filter(img => !img.complete || img.naturalWidth === 0).map(img => img.src);
  });
  log('Images: all loaded on Day1', brokenImages.length === 0,
    brokenImages.length > 0 ? `Broken: ${brokenImages.join(', ')}` : 'All OK');

  // Check Day 2
  await tabs[1].click();
  await new Promise(r => setTimeout(r, 1500));
  const brokenDay2 = await page.evaluate(() => {
    const imgs = [...document.querySelectorAll('img')];
    return imgs.filter(img => !img.complete || img.naturalWidth === 0).map(img => img.src);
  });
  log('Images: all loaded on Day2', brokenDay2.length === 0,
    brokenDay2.length > 0 ? `Broken: ${brokenDay2.join(', ')}` : 'All OK');
}

async function testConsoleErrors() {
  // Navigate through all pages and check for JS errors
  const errors = [];
  page.on('pageerror', err => errors.push(err.message));

  const tabs = await page.$$('nav button');
  for (let i = 0; i < tabs.length; i++) {
    await tabs[i].click();
    await new Promise(r => setTimeout(r, 1000));
  }

  log('Console: no JS errors', errors.length === 0,
    errors.length > 0 ? errors.join('; ') : 'Clean');
}

// Run all tests
async function runAll() {
  console.log('\n=== QA Test Suite ===\n');
  await setup();

  try {
    await testHeader();
    await testDay1();
    await testMealPicker();
    await testDay2();
    await testRoomPage();
    await testOrderPage();
    await testBottomNav();
    await testImages();
    await testConsoleErrors();
  } catch (err) {
    console.log(`\n[FATAL] ${err.message}`);
  }

  await browser.close();

  const passed = results.filter(r => r.pass).length;
  const failed = results.filter(r => !r.pass).length;
  console.log(`\n=== Results: ${passed} passed, ${failed} failed ===\n`);

  if (failed > 0) {
    console.log('Failed tests:');
    results.filter(r => !r.pass).forEach(r => {
      console.log(`  - ${r.test}${r.detail ? ': ' + r.detail : ''}`);
    });
  }
}

runAll();
