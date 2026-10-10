# Putting Mud & Crowns on the App Store and Google Play

The game is a single web page (`index.html`). To ship it as a phone app, it is
wrapped in a native shell with **Capacitor**, a free tool that turns a web app
into a real iOS and Android app. Everything needed is already set up in this
repo: `package.json`, `capacitor.config.json`, the offline fonts in `fonts/`,
the app icons in `icons/`, and `scripts/build-www.mjs`, which builds the app's
files into `www/`.

**On Windows, or without a Mac?** Follow [APPLE_SETUP.md](APPLE_SETUP.md)
for the App Store. GitHub builds and uploads the iPhone app for you
(`.github/workflows/ios.yml`), and the iPhone project in `ios/` is already
set up: iPhone only, portrait, icon and launch screen.

## Step 0: the quick option (no app store)

Turn on **GitHub Pages** for this repo (Settings → Pages → deploy from your
main branch). Players open the link on their phone and choose **Add to Home
Screen**. The game then installs with its own icon and works offline. It's free
and needs no review, but it isn't listed in any store.

## What you need for the stores

| | Apple App Store | Google Play |
|---|---|---|
| Account | Apple Developer Program, $99 a year | Google Play Console, $25 one time |
| Computer | A Mac with Xcode (free from the Mac App Store) | Any computer with Android Studio (free) |
| Also | An iPhone for testing helps | An Android phone for testing helps |

You also need [Node.js](https://nodejs.org) (the LTS version).

## Step 1: one-time setup

```sh
npm install
# Pick a unique app ID you control, e.g. com.yourname.mudcrowns,
# and put it in capacitor.config.json ("appId") first. It can't change later.
npm run build
npx cap add android    # ios/ is already in the repo
```

This creates an `android/` folder holding a real Android Studio project.
Commit it. The `ios/` Xcode project is already here, with iPad turned off,
portrait only, and the encryption answer (`ITSAppUsesNonExemptEncryption`
= NO) set.

Then, once, in the Android project:

- **Android Studio**: in `android/app/src/main/AndroidManifest.xml`, add
  `android:screenOrientation="portrait"` to the `<activity>` line.

**No Mac?** Use [APPLE_SETUP.md](APPLE_SETUP.md): GitHub builds and uploads
the iPhone app on its own Macs. Android works on any computer.

## Step 2: icons and splash screen

The iPhone app already has its icon and launch screen. For Android:

```sh
npm install -D @capacitor/assets
mkdir -p assets && cp icons/icon-1024.png assets/icon.png
npx capacitor-assets generate --android
```

## Step 3: build and test

Every time you change `index.html`:

```sh
npm run ios       # builds, copies into the iOS project, opens Xcode
npm run android   # same for Android Studio
```

In Xcode, pick your phone or a simulator and press Run. In Android Studio,
press Run.

## Step 4: submit

**Apple**
1. In Xcode, set your Team under *Signing & Capabilities*, and set the version
   and build number.
2. *Product → Archive*, then *Distribute App → App Store Connect*.
3. In [App Store Connect](https://appstoreconnect.apple.com), create the app
   and add:
   - the screenshots in `store/iphone/` (1206×2622, for the "iPhone with
     Dynamic Island (medium display)" slot)
   - the name, subtitle, description, keywords and links from
     `STORE_LISTING.md`
4. **App Privacy**: choose *Data Not Collected*. The game stores saves only on
   the device.
5. **Age rating questionnaire**: answer honestly. `STORE_LISTING.md` has the
   answers for this game (text violence, alcohol references, simulated
   gambling with no real money, mild mature themes). Expect 13+.
6. Submit for review. It usually takes 1 to 3 days.

**Google**
1. In Android Studio, *Build → Generate Signed App Bundle* (.aab). Keep the
   keystore file safe forever: you need it for every update.
2. In the [Play Console](https://play.google.com/console), create the app,
   fill in the store listing from `STORE_LISTING.md` (screenshots in
   `store/android-phone/`, the feature graphic
   `store/android-feature-graphic.png`, the icon `icons/icon-512.png`), the
   content rating (IARC questionnaire), the data safety form ("no data
   collected"), and upload the .aab.
3. New personal developer accounts must run a closed test with at least 12
   testers for 14 days before going public.

## Tips for passing review

- Apple rejects apps that look like a website wrapper or like a copy of
  another app (guidelines 4.2 and 4.3). This game works offline, has no web
  links it depends on, and is original, which all helps. Your screenshots and
  description should show what makes it different: the medieval setting, over
  a hundred real historical jobs, the conquest map, and dynasties.
- Test on a real phone: notch, safe areas, dark mode, and that saves survive
  closing the app.
- To make money: a one-time price, or a free game with an optional purchase
  (that needs a plugin such as RevenueCat or `@capacitor-community/in-app-purchases`).
  Ads need a privacy and age-rating review of their own.

## Launch checklist

Already done in this repo:

- [x] Works fully offline (bundled fonts, service worker)
- [x] App icon in every size (`icons/`), source in `icons/icon.svg`
- [x] Store screenshots of version 1.5: `store/iphone/` (1206×2622, for the
      "iPhone with Dynamic Island (medium display)" slot) and
      `store/android-phone/` (1080×2160)
- [x] Google Play feature graphic: `store/android-feature-graphic.png`
- [x] Store text, age rating and privacy answers: `STORE_LISTING.md`
- [x] Privacy policy and support pages (`privacy.html`, `support.html`),
      served by GitHub Pages
- [x] First-time welcome tour, hint line, and help in the menu
- [x] Crash guard: if something breaks, the game saves and offers to carry on
- [x] Save backup: the previous year is kept and restored automatically if a
      save is damaged
- [x] Backup codes (Menu → Back up or move your game) so players can move to
      a new phone
- [x] Exploits closed: reloading the app can't dodge a trial, debt, invasion,
      capture or other event; farmable actions (tribute, truces, rousing the
      commons, squeezing tenants, pulling strings) are limited
- [x] Version number shown in the menu (`APP_VERSION` in `index.html`)

You still need to:

- [ ] Change `appId` in `capacitor.config.json` to your own (e.g.
      `com.yourname.mudcrowns`). It can never change after release.
- [ ] Put your name in place of "the Mud & Crowns authors" (menu About text and
      `LEGAL_NOTES.md`)
- [ ] Check that https://brennencol.github.io/Mud-Crowns/privacy.html and
      `support.html` load (GitHub Pages must be on: Settings → Pages)
- [ ] Search the name in the USPTO database and both stores
- [ ] Test on a real iPhone and Android phone: notch, dark mode, closing and
      reopening, and a backup code round trip
- [ ] For every update: raise `APP_VERSION`, the `version` in `package.json`,
      and the build number in Xcode / Android Studio, and change `CACHE` in
      `sw.js` so web players get the new version
