// Frames each raw game screen with a headline, at the App Store's 1206x2622 size.
const { chromium } = require('playwright');
const path = require('path'), fs = require('fs');
const RED = ['#a32416', '#3a0b06'], BLUE = ['#2a4f91', '#0b1631'];
const SHOTS = [
  ['01-whole-life', '1-life', 'Live a Whole Medieval Life', 'One life, from the mud to the crown', RED],
  ['02-prince', '2-prince', 'A Prince Has Noticed You', 'Love, scandal and rare chances', BLUE],
  ['03-kingdoms', '4-map', 'Nine Kingdoms to Conquer', 'Raise armies and rule as king or queen', RED],
  ['04-careers', '3-careers', 'Over 300 Ways to Rise', 'Weaver, nun, pirate, chancellor and more', BLUE],
  ['05-battle', '5-battle', 'Lead Your Army Into Battle', 'Choose the plan, then every clash', RED],
  ['06-trial', '6-trial', 'Crime Has a Price', 'Face a jury of your neighbours, or run', BLUE],
  ['07-pirate', '7-pirate', 'Sail as a Pirate Queen', 'Ships, crews, raids and plunder', RED],
  ['08-dynasty', '8-dynasty', 'Your Dynasty Lives On', 'When you die, carry on as your heir', BLUE],
];
const page = (img, h1, sub, [c1, c2]) => `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700;900&family=EB+Garamond:ital,wght@0,500;1,500&display=block" rel="stylesheet">
<style>
html,body{margin:0;width:1206px;height:2622px;overflow:hidden;background:${c2}}
.bg{position:absolute;inset:0;background:radial-gradient(1100px 1000px at 50% 16%, ${c1}, ${c2} 78%)}
.pat{position:absolute;inset:0;opacity:.07;background-image:repeating-linear-gradient(45deg,#f6d77e 0 2px,transparent 2px 46px),repeating-linear-gradient(-45deg,#f6d77e 0 2px,transparent 2px 46px)}
.frame{position:absolute;inset:30px;border:3px solid rgba(246,215,126,.6);border-radius:34px}
.frame:after{content:'';position:absolute;inset:12px;border:1.5px solid rgba(246,215,126,.35);border-radius:24px}
.cap{position:absolute;top:118px;left:70px;right:70px;text-align:center}
h1{font-family:'Cinzel',serif;font-weight:900;font-size:112px;line-height:1.08;letter-spacing:.01em;color:#fff4d8;margin:0;text-shadow:0 4px 0 rgba(0,0,0,.4),0 0 36px rgba(0,0,0,.3)}
p{font-family:'EB Garamond',serif;font-style:italic;font-size:62px;line-height:1.18;color:#f6d77e;margin:30px 0 0}
.rule{width:340px;height:4px;margin:34px auto 0;background:linear-gradient(90deg,transparent,#f6d77e,transparent)}
.phone{position:absolute;left:50%;bottom:96px;height:1800px;aspect-ratio:1170/2532;transform:translateX(-50%);border-radius:70px;border:14px solid #19100a;box-shadow:0 0 0 7px #d9a83a,0 0 0 10px rgba(0,0,0,.35),0 50px 90px rgba(0,0,0,.6);overflow:hidden;background:#f2e7c9}
.phone img{width:100%;height:100%;display:block}
</style></head><body><div class="bg"></div><div class="pat"></div><div class="frame"></div>
<div class="cap"><h1>${h1}</h1><div class="rule"></div><p>${sub}</p></div>
<div class="phone"><img src="file://${img}"></div></body></html>`;
(async () => {
  const b = await chromium.launch();
  const c = await b.newContext({ viewport: { width: 1206, height: 2622 }, deviceScaleFactor: 1 });
  const p = await c.newPage();
  for (const [out, raw, h1, sub, col] of SHOTS) {
    const html = path.resolve('final', out + '.html');
    fs.writeFileSync(html, page(path.resolve('raw', raw + '.png'), h1, sub, col));
    await p.goto('file://' + html); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(500);
    const ok = await p.evaluate(() => document.fonts.check('900 112px Cinzel'));
    await p.screenshot({ path: path.resolve('final', out + '.png') });
    console.log(out, ok ? 'fonts ok' : 'FONT MISSING');
  }
  await b.close();
})();
