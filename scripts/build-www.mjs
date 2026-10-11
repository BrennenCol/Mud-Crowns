// Builds the www/ folder that the iOS and Android apps load.
// The app version uses the bundled fonts in fonts/ so it works fully offline.
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';

rmSync('www', { recursive: true, force: true });
mkdirSync('www');
// In the app the game should feel like an app, not a web page: no pinch zoom, and a long
// press doesn't select text or pop up Copy / Look Up (text boxes still can).
const APP_FEEL = '<style>body{-webkit-user-select:none;user-select:none;-webkit-touch-callout:none}input,textarea{-webkit-user-select:text;user-select:text;-webkit-touch-callout:default}</style>';
const src = readFileSync('index.html', 'utf8');
const html = src
  .replace(/<link rel="preconnect"[^>]*>\n?/g, '')
  .replace(/<link href="https:\/\/fonts\.googleapis\.com[^>]*>/, '<link rel="stylesheet" href="fonts/fonts.css">')
  .replace('content="width=device-width, initial-scale=1, viewport-fit=cover"', 'content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover"')
  .replace('</head>', APP_FEEL + '</head>');
for (const [what, ok] of [['fonts', html.includes('fonts/fonts.css')], ['viewport', html.includes('user-scalable=no')], ['app style', html.includes(APP_FEEL)]])
  if (!ok) throw new Error(`build-www: could not set up the ${what} in index.html`);
writeFileSync('www/index.html', html);
for (const p of ['fonts', 'icons', 'manifest.webmanifest', 'sw.js']) cpSync(p, `www/${p}`, { recursive: true });
console.log('Built www/');
