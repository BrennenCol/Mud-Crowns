// Builds the www/ folder that the iOS and Android apps load.
// The app version uses the bundled fonts in fonts/ so it works fully offline.
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';

rmSync('www', { recursive: true, force: true });
mkdirSync('www');
const html = readFileSync('index.html', 'utf8')
  .replace(/<link rel="preconnect"[^>]*>\n?/g, '')
  .replace(/<link href="https:\/\/fonts\.googleapis\.com[^>]*>/, '<link rel="stylesheet" href="fonts/fonts.css">');
writeFileSync('www/index.html', html);
for (const p of ['fonts', 'icons', 'manifest.webmanifest', 'sw.js']) cpSync(p, `www/${p}`, { recursive: true });
console.log('Built www/');
