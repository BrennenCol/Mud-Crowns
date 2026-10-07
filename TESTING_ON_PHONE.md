# Testing Mud & Crowns on your phone

There are three ways, from quickest to most like the real app.

## Way 1: open the Claude link (1 minute)

1. On your phone, open the Claude app (or claude.ai in your phone's browser) and
   make sure you're signed in to the same account.
2. Open this link: https://claude.ai/artifact/RoRADaC6rYe3pHt3epC4LC
3. Play. Your progress is saved on that phone.

Good for a quick look. It runs inside Claude's page, so it doesn't feel like an
app yet.

## Way 2: put it on the web with GitHub Pages and add it to your home screen (10 minutes, free)

This makes it feel like a real app: its own icon, full screen, and it works
offline. Your repo is public, so GitHub Pages is free.

1. On a computer, go to https://github.com/BrennenCol/Mud-Crowns
2. Click **Settings** (top of the repo page), then **Pages** in the left menu.
3. Under **Build and deployment → Source**, choose **Deploy from a branch**.
4. Under **Branch**, choose `claude/medieval-occupations-class-kv5wkk` (or
   `main`, once you've merged the work into it), folder **/ (root)**, and click
   **Save**.
5. Wait 1–2 minutes and refresh the page. GitHub shows your site address. It
   will be:
   **https://brennencol.github.io/Mud-Crowns/**
6. **iPhone:** open that address in **Safari** (it must be Safari), tap the
   **Share** button (square with an arrow), scroll down, tap **Add to Home
   Screen**, then **Add**.
   **Android:** open it in **Chrome**, tap the **⋮** menu, then **Add to Home
   screen** (or **Install app**).
7. Open it from the new crown icon on your home screen. It opens full screen,
   and after the first visit it works without internet.

Every time new work is pushed, the site updates by itself within a couple of
minutes. Close and reopen the app (or pull to refresh in the browser) to get
the new version.

## Way 3: build the real app and install it on your own phone

This is the same app you would submit to the stores.

### Android (any computer)

1. Install **Node.js** (LTS) from https://nodejs.org and **Android Studio** from
   https://developer.android.com/studio
2. Download the code: on the GitHub page click **Code → Download ZIP**, unzip it,
   and open a terminal in that folder.
3. Run:
   ```
   npm install
   npm run build
   npx cap add android
   npm run android
   ```
4. Android Studio opens the project. On your phone, turn on **Developer
   options** (Settings → About phone → tap **Build number** 7 times), then turn
   on **USB debugging**.
5. Plug the phone in with a USB cable, pick it at the top of Android Studio,
   and press the green **Run ▶** button. The game installs on your phone.

### iPhone (needs a Mac)

1. Install **Xcode** from the Mac App Store and **Node.js** (LTS).
2. Download the code and open a terminal in that folder, then run:
   ```
   npm install
   npm run build
   npx cap add ios
   npm run ios
   ```
3. Xcode opens. Click the project at the top left, then **Signing &
   Capabilities**, and choose your Apple ID as the **Team** (a free Apple ID
   works for testing on your own phone).
4. Plug in your iPhone, choose it at the top of Xcode, and press **Run ▶**.
5. The first time, on the iPhone go to **Settings → General → VPN & Device
   Management**, tap your Apple ID and choose **Trust**.

A free Apple ID lets the test app run for 7 days before you must press Run
again. The $99/year Apple Developer Program removes that limit and is needed
for TestFlight and the App Store.

## What to check while testing

- Text is readable and nothing is cut off by the notch or rounded corners.
- Light and dark mode both look right (change it in the phone's settings).
- Close the app completely in the middle of a life, reopen it, and check that
  you carry on where you left off.
- Menu → **Back up or move your game**: copy the code, then restore it.
- Play a few whole lives: try different jobs, marriage, war, and death and
  continuing as an heir.
