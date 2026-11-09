# Making the store screenshots

1. `node capture.js ../../index.html raw` sets up each scene in the game at iPhone size and saves raw screens to `raw/`.
2. `node compose.js` (run from the same folder) frames each one with its headline at 1206×2622 and saves them to `final/`.
3. Copy `final/*.png` to `store/iphone/`.

Both need Playwright (`npm i -g playwright`) and an internet connection for the fonts. Headlines and colours are at the top of `compose.js`.

## Uploading them to App Store Connect

Run **Actions → Store screenshots → Run workflow** on GitHub. It uses the same Apple key as the iPhone build and
replaces the iPhone screenshots on the version you can still edit (not one waiting for or in review) with the PNGs in
`store/iphone/`, in file-name order.
