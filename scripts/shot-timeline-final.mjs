import { chromium } from '/workspace/.pw/node_modules/playwright-core/index.mjs';
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
for (const [w,h] of [[1440,900],[1280,720]]) { const p = await b.newPage({viewport:{width:w,height:h}});
  await p.goto('https://xiaochenqaq.github.io/posttraining-talk/figs/timeline/'); await p.waitForTimeout(3500);
  await p.screenshot({ path: `shots/timeline-final-${w}.png` }); console.log(w, await p.locator('.tl').count()); }
await b.close();
