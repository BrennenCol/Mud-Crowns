// Sets up each store scene in the real game at iPhone size and saves a raw 1170x2532 screenshot.
const { chromium } = require('playwright');
const path = require('path');
const GAME = process.argv[2], OUT = process.argv[3], ONLY = process.argv[4];
const prelude = `
  window.__resolve = (n) => { for (let g = 0; g < (n || 40); g++) { if (!modalOpen && !Q.length) break; if (!modalOpen) { nextModal(); continue; } const bs = [...document.querySelectorAll('#card button')].filter(b => !b.disabled && b.getAttribute('aria-disabled') !== 'true'); if (!bs.length) { hideModal(); modalOpen = false; Q.length = 0; break; } bs[0].click(); } hideModal(); modalOpen = false; Q.length = 0; };
  toast = () => {}; { const t = document.getElementById('toast'); if (t) t.style.display = 'none'; }
  window.__die = die; die = function () {};
  window.__years = (n) => { for (let y = 0; y < n; y++) { S.stats.health = 100; S.alive = true; S.dead = null; ageUp(); __resolve(); S.alive = true; S.dead = null; hideScreen(); } };
  window.__fresh = (o) => { begin(newLife(Object.assign({ realism: 'hist' }, o))); hideModal(); modalOpen = false; Q.length = 0; S.realism = 'hist'; };
`;
const SCENES = {
  '1-life': `__fresh({ cls: 'craft', sex: 'f', first: 'Matilda', last: 'Wainwright' }); __years(27); S.stats.renown = Math.max(S.stats.renown, 30); try { hireInto(OCC_BY.apothecary || OCC_BY.wm_illuminator); } catch (e) {} closeSheet(); render(); document.getElementById('chron').scrollTop = 0;`,
  '2-prince': `__fresh({ cls: 'peasant', sex: 'f', first: 'Alys', last: 'Miller' }); __years(19); S.stats.looks = 86; S.coin = 14; render(); const e = EVENTS.find(x => x.id === 'pc_sees'); Q.push(() => showEvent(e)); nextModal();`,
  '3-careers': `__fresh({ cls: 'merchant', sex: 'm', first: 'Hugh', last: 'Fairfax' }); __years(30); Object.assign(S.stats, { wits: 64, renown: 46, looks: 52, health: 80 }); S.flags.letters = 1; S.skills = Object.assign(S.skills || {}, { trade: 6, court: 3, letters: 4, law: 2 }); S.coin = 600; S.jail = null; S.flags.outlaw = 0; render(); workPane = 'find'; workTab = 'mid'; workFilter = 'open'; openSheet('work'); setTimeout(() => { const sb = document.getElementById('sheetBody'); sb.querySelectorAll('details.fold').forEach(d => { d.open = true; }); const it = sb.querySelector('.item.job'); if (it) { const y = it.getBoundingClientRect().top - sb.getBoundingClientRect().top + sb.scrollTop; sb.scrollTop = Math.max(0, y - 265); } }, 400);`,
  '4-map': `__fresh({ cls: 'royal', sex: 'f', first: 'Eleanor' }); __years(26); try { crown(); courtInit(); addTroops('foot', 240); addTroops('horse', 40); } catch (e) {} __resolve(); render(); realmTab = 'map'; openSheet('realm');`,
  '5-battle': `__fresh({ cls: 'royal', sex: 'm', first: 'Edward' }); __years(28); try { crown(); courtInit(); addTroops('foot', 300); addTroops('horse', 60); } catch (e) {} __resolve(); render(); const mine = new Set(S.world.t.filter(t => t.realm === S.realm).map(t => t.id)); const x = S.world.t.find(t => t.realm !== S.realm && t.adj.some(a => mine.has(a))) || S.world.t.find(t => t.realm !== S.realm); Q.push(() => showEvent(battleEvent(x))); nextModal();`,
  '6-trial': `__fresh({ cls: 'peasant', sex: 'm', first: 'Wat', last: 'Tyler' }); __years(24); render(); Q.push(() => showEvent(trialEvent(2, 'theft'))); nextModal();`,
  '7-pirate': `__fresh({ cls: 'peasant', sex: 'f', first: 'Grace', last: 'Crouch' }); __years(24); Object.assign(S.stats, { health: 80, renown: 40, wits: 55 }); S.skills = Object.assign(S.skills || {}, { sea: 6 }); try { hireInto(OCC_BY.jb_piratecap); } catch (e) {} __resolve(); render(); workPane = 'job'; openSheet('work');`,
  '8-dynasty': `__fresh({ cls: 'noble', sex: 'm', first: 'Robert', last: 'Beaumont' }); __years(40); try { if (!spouse()) { const p = person('f', S.age - 3, 'noble', { sp: 1 }); p.sur = 'Neville'; marry(p); } [['Henry', 'm', 14], ['Joan', 'f', 11], ['Thomas', 'm', 8]].forEach(([n, s, a]) => { addChild(n, s); const c = S.kin[S.kin.length - 1]; c.age = a; }); } catch (e) {} __years(22); __resolve(); die = __die; die('peacefully in his sleep, with his grandchildren at his bed'); showDeath(); setTimeout(() => { const h = [...document.querySelectorAll('#screen h3')].find(x => /Continue your line/.test(x.textContent)); const sc = document.getElementById('screen'); if (h) sc.scrollTop = Math.max(0, h.getBoundingClientRect().top + sc.scrollTop - 470); }, 300);`,
};
(async () => {
  const b = await chromium.launch();
  for (const [name, code] of Object.entries(SCENES)) {
    if (ONLY && !name.startsWith(ONLY)) continue;
    const c = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
    const p = await c.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
    await p.addInitScript(() => { localStorage.setItem('mudcrowns.tour', 'done'); localStorage.setItem('mudcrowns.seen', '1.13.1'); localStorage.setItem('mudcrowns.sound', JSON.stringify({ music: 0, sfx: 0 })); });
    await p.goto('file://' + path.resolve(GAME)); await p.waitForTimeout(800);
    await p.evaluate(prelude + code);
    await p.waitForTimeout(1500);
    await p.screenshot({ path: path.join(OUT, name + '.png') });
    console.log(name, errs.length ? 'ERR ' + errs.slice(0, 2).join(' | ') : 'ok');
    await c.close();
  }
  await b.close();
})();
