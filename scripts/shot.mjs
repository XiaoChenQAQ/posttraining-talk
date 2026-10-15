import { chromium } from 'playwright';
const [,, from='1', to='12', step='99'] = process.argv;
const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1280, height: 720 } });
const errs = []; pg.on('pageerror', e => errs.push(String(e))); pg.on('console', m => m.type()==='error' && errs.push(m.text()));
for (let i = +from; i <= +to; i++) { await pg.goto(`http://localhost:4321/posttraining-talk/#/${i}/${step}`); await pg.reload(); await pg.waitForTimeout(1300);
  await pg.screenshot({ path: `/workspace/posttraining-talk/shots/s${String(i).padStart(2,'0')}.png` }); }
console.log(errs); await b.close();
