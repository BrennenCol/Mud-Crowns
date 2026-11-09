# Making the store screenshots

1. `node capture.js ../../index.html raw` sets up each scene in the game at iPhone size and saves raw screens to `raw/`.
2. `node compose.js` (run from the same folder) frames each one with its headline at 1206×2622 and saves them to `final/`.
3. Copy `final/*.png` to `store/iphone/`.

Both need Playwright (`npm i -g playwright`) and an internet connection for the fonts. Headlines and colours are at the top of `compose.js`.
