// usage: node scripts/shot.mjs [baseUrl]   (run `npm run preview` first for local)
import { chromium } from 'playwright';
const base = process.argv[2] || 'http://localhost:4321/posttraining-talk/';
const out = new URL('../shots/', import.meta.url).pathname;
const b = await chromium.launch();
const errs = [];
const pg = await b.newPage({ viewport: { width: 1440, height: 900 } });
pg.on('pageerror', e => errs.push(String(e)));
await pg.goto(base); await pg.waitForTimeout(800);
await pg.screenshot({ path: out + 'article-top.png' });
for (const [n, name] of [[2, 'pipeline'], [5, 'ppo'], [6, 'kl'], [7, 'grpo'], [3, 'sft'], [8, 'overopt']]) {
  await pg.evaluate(n => { const el = document.getElementById('figure-' + n); window.scrollTo(0, el.getBoundingClientRect().top + scrollY - 60); }, n);
  await pg.waitForTimeout(4200);
  await pg.screenshot({ path: out + `article-${name}.png` });
}
await pg.evaluate(() => document.getElementById('footnote-label').scrollIntoView()); await pg.waitForTimeout(500);
await pg.screenshot({ path: out + 'article-refs.png' });
const m = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
await m.goto(base); await m.waitForTimeout(800);
await m.screenshot({ path: out + 'article-mobile-top.png' });
for (const [n, name] of [[5, 'ppo'], [6, 'kl']]) {
  await m.evaluate(n => document.getElementById('figure-' + n).scrollIntoView(), n); await m.waitForTimeout(4200);
  await m.screenshot({ path: out + `article-mobile-${name}.png` });
}
console.log('overflowX', await m.evaluate(() => document.documentElement.scrollWidth), errs);
await b.close();
