import puppeteer from 'puppeteer-core';
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const BASE = 'http://localhost:3000';
const dir = 'C:/Users/qhuip/AppData/Local/Temp/claude/C--Users-qhuip-OneDrive-Documents-Notes-Term-3-Data-Driven-World/522eff23-42c5-4459-aa93-f00c228872d4/scratchpad';
const errors = [];
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox'] });
const page = await browser.newPage();
page.on('dialog', async (d) => { await d.accept().catch(() => {}); });
page.on('pageerror', (e) => errors.push(e.message));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

await page.setViewport({ width: 1100, height: 950 });
await page.goto(BASE, { waitUntil: 'networkidle2' });
await sleep(700);
// login as Stef (existing → popup → continue)
await page.type('#name-input', 'Stef');
await page.click('#screen-home .hud-btn[data-action="leaderboard"]'); // opens board directly (no player needed)
await page.waitForSelector('#board-overlay.open');
await page.waitForFunction(() => document.querySelectorAll('#board-body .board-row').length > 0, { timeout: 5000 }).catch(() => {});
await sleep(600); // let the badge shine animate to a nice frame
await page.screenshot({ path: dir + '/v5-board.png' });
await page.click('#board-close');

// open shop (needs player) — click chip → login popup → continue
await page.click('#home-chip');
if (await page.$('#login-popup.open')) { await page.click('#popup-continue'); }
await page.waitForSelector('#shop-overlay.open', { timeout: 5000 });
await page.waitForFunction(() => document.querySelectorAll('#shop-grid .shop-item').length > 0, { timeout: 5000 });
await sleep(400);
await page.screenshot({ path: dir + '/v5-shop.png' });

console.log('page errors:', errors.length ? errors.join(' | ') : '(none)');
await browser.close();
console.log('DONE');
