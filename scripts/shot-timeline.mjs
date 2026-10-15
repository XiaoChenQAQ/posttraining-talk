import { chromium } from '/workspace/.pw/node_modules/playwright-core/index.mjs';
const base = (process.argv[2] || 'http://localhost:4399/posttraining-talk/') + 'figs/timeline/';
const out = new URL('../shots/', import.meta.url).pathname;
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' }); const errs = [];
for (const [w, h, tag] of [[1440, 900, '1440'], [1280, 720, '1280']]) {
  const pg = await b.newPage({ viewport: { width: w, height: h } });
  pg.on('pageerror', e => errs.push(String(e)));
  await pg.goto(base); await pg.waitForTimeout(300);
  const A = pg.locator('.tl').nth(0), B = pg.locator('.tl').nth(1);
  await A.scrollIntoViewIfNeeded(); await pg.waitForTimeout(2600);
  await A.screenshot({ path: out + `timeline-A-${tag}.png` });
  if (tag === '1440') {
    await pg.screenshot({ path: out + 'timeline-page-1440.png' });
    await A.locator('.tl-model').nth(3).hover(); await pg.waitForTimeout(500);
    await A.screenshot({ path: out + 'timeline-A-hover-node.png' });
    await A.locator('.tl-sig').nth(1).hover(); await pg.waitForTimeout(500);
    await A.screenshot({ path: out + 'timeline-A-hover-signal.png' });
  }
  await pg.mouse.move(2,2); await B.scrollIntoViewIfNeeded(); await pg.waitForTimeout(2800);
  await B.screenshot({ path: out + `timeline-B-${tag}.png` });
  if (tag === '1440') { await B.locator('.tl-sig').nth(2).hover(); await pg.waitForTimeout(500); await B.screenshot({ path: out + 'timeline-B-hover-signal.png' }); }
  if (tag === '1280') { await pg.evaluate(() => scrollTo(0, 0)); await pg.screenshot({ path: out + 'timeline-page-1280x720.png' }); }
}
console.log('errs', errs); await b.close();
