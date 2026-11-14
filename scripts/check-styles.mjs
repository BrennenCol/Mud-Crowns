// Style-name clash check. Run before every build: `npm run build` runs it first and stops if it fails.
//
// Why: everything lives in one index.html, so two parts of the game can pick the same short class
// name without knowing. That has happened twice: the sermon game's stage was class "sm", which also
// marks the small folding headings in the Realm list (they turned sky blue), and a bare ".tl" rule for
// the assize witnesses hid the start screen's top-left gold corner.
//
// What it checks. A "bare" rule is one whose selector is a single class on its own, like `.sm{...}` or
// `.tl:hover{...}`: it styles every element anywhere with that class.
//   A. A bare rule written in the mini-game styles, for a class the rest of the game also uses.
//   B. A bare rule in the main styles, for a class the mini-games also use, unless the name is listed
//      in SHARED below as deliberately shared.
// Either one fails the check, with the name and line numbers so it can be renamed.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const file = process.argv[2] || join(root, 'index.html');
const src = readFileSync(file, 'utf8');
const lines = src.split('\n');

// Classes that the main styles define on purpose for use everywhere, mini-games included.
const SHARED = new Set([
  'btn', 'ghost', 'go', 'story', 'plain', 'hint', 'sec', 'empty', 'card', 'gold', 'bad', 'good', 'on', 'off', 'up', 'dn', 'done', 'sel',
  'no', 'ok', 'low', 'hidden', 'small', 'big', 'red', 'green', 'blue', 'item', 'lineitem', 'static', 'sumbox', 'meter', 'tx', 'ic', 'pic',
  'climb-h',
]);

const lineOf = idx => src.slice(0, idx).split('\n').length;
const find = (re, from = 0) => { re.lastIndex = from; const m = re.exec(src); return m ? m.index : -1; };

// where the mini-game styles and the mini-game code begin and end
const styleOpen = src.indexOf('<style>'), styleClose = src.indexOf('</style>');
const mgCssStart = src.indexOf('.card.mgc{');
const mgJsStart = src.indexOf('Mastery of office: a game you play for every high post');
const mgJsEnd = src.indexOf('window.mgDebug =');
for (const [n, v] of Object.entries({ '<style>': styleOpen, '</style>': styleClose, '.card.mgc{': mgCssStart, 'mini-game code start': mgJsStart, 'window.mgDebug': mgJsEnd }))
  if (v < 0) { console.error(`check-styles: cannot find the marker ${n}. Update scripts/check-styles.mjs.`); process.exit(2); }

// 1. every bare rule, and whether it sits in the mini-game styles
const bare = new Map(); // class -> [{ line, mg }]
// comments are blanked out (keeping line numbers), so `/* the sermon */ .sm{…}` still reads as a bare `.sm` rule
const css = src.slice(styleOpen, styleClose).replace(/\/\*[\s\S]*?\*\//g, c => c.replace(/[^\n]/g, ' '));
const ruleRe = /([^{}@]+)\{[^{}]*\}/g;
let m;
while ((m = ruleRe.exec(css))) {
  const at = styleOpen + m.index + (m[1].length - m[1].trimStart().length), mg = at >= mgCssStart;
  for (let sel of m[1].split(',')) {
    sel = sel.trim().replace(/::?[a-z-]+(\([^)]*\))?/g, '');
    const mm = /^\.([a-zA-Z][\w-]*)$/.exec(sel);
    if (!mm) continue;
    if (!bare.has(mm[1])) bare.set(mm[1], []);
    bare.get(mm[1]).push({ line: lineOf(at), mg });
  }
}

const known = new Set(); { const re = /\.([a-zA-Z][\w-]*)/g; let q; while ((q = re.exec(css))) known.add(q[1]); }

// 2. every class name the code uses, inside the mini-games and outside them.
// "strict" counts only real class contexts: class="…", className = …, classList.add('…'), and string
// literals that look like a list of class names with a space or a dash in them ('go hr-ring', ' sm', 'ti-c').
// "loose" also counts any one-word string literal ('tl'), since the rest of the game builds some class
// names from lists like ['tl', 'tr', 'bl', 'br'].
const used = { strict: { mg: new Map(), rest: new Map() }, loose: { mg: new Map(), rest: new Map() } };
const note = (kind, tok, idx) => { const where = idx >= mgJsStart && idx < mgJsEnd ? 'mg' : 'rest'; for (const k of kind === 'strict' ? ['strict', 'loose'] : ['loose']) if (!used[k][where].has(tok)) used[k][where].set(tok, lineOf(idx)); };
const scanList = (kind, text, idx, allKnown) => { const toks = text.replace(/\$\{[^}]*\}/g, ' ').split(/\s+/).filter(t => /^[a-zA-Z][\w-]*$/.test(t)); if (allKnown && !toks.every(t => known.has(t))) return; for (const t of toks) note(kind, t, idx); };
const js = src.slice(styleClose), base = styleClose;
const strictPats = [
  /class(?:Name)?\s*=\s*"([^"]*)"/g, /class(?:Name)?\s*=\s*'([^']*)'/g, /className\s*=\s*`([^`]*)`/g,
  /classList\.(?:add|toggle|remove|contains)\(\s*'([^']+)'/g,
  /'(\s*[a-z][a-z0-9-]*(?:\s+[a-z][a-z0-9-]*)+\s*|\s+[a-z][a-z0-9-]*\s*|[a-z][a-z0-9]*-[a-z0-9-]+)'/g,
];
strictPats.forEach((re, i) => { re.lastIndex = 0; let k; while ((k = re.exec(js))) if (k[1].length <= 60) scanList('strict', k[1], base + k.index, i === strictPats.length - 1); });
{ const re = /'([a-z][a-z0-9-]*)'/g; let k; while ((k = re.exec(js))) note('loose', k[1], base + k.index); }

// 3. the clashes
const problems = [];
for (const [cls, defs] of bare) {
  const inMg = used.strict.mg.get(cls), inRest = used.loose.rest.get(cls);
  for (const d of defs) {
    if (d.mg && inMg && inRest) problems.push(`A  .${cls} (style on line ${d.line}) is a mini-game style, but the rest of the game also uses "${cls}" (line ${inRest}). Rename the mini-game's class.`);
    if (!d.mg && inMg && !SHARED.has(cls)) problems.push(`B  .${cls} (style on line ${d.line}) belongs to the main game, but a mini-game also uses "${cls}" (line ${inMg}). Rename the mini-game's class, or add it to SHARED if the sharing is meant.`);
  }
}
if (problems.length) {
  console.error(`check-styles: ${problems.length} style-name clash${problems.length > 1 ? 'es' : ''} found in ${file}:\n  ` + problems.join('\n  '));
  process.exit(1);
}
console.log(`check-styles: no style-name clashes (${bare.size} plain class rules checked).`);
