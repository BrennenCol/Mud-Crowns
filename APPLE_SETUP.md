# Putting Mud & Crowns on the App Store from Windows

You never need a Mac. GitHub builds the iPhone app on its own Macs and sends
it to Apple. Everything you do happens in a web browser.

It costs $99 a year for the Apple Developer Program. The GitHub build is free
because the repo is public.

## 1. Join the Apple Developer Program

1. You need an Apple Account (the one for an iPhone or iCloud works) with
   two-factor authentication turned on.
2. Go to <https://developer.apple.com/programs/enroll/> and choose **Start
   your enrollment**.
3. Enroll as an **Individual**. Your legal name is shown as the seller on the
   App Store. (A company needs a D-U-N-S number and takes longer.)
4. Pay the $99. Approval usually takes a day or two. Apple emails you.

## 2. Find your Team ID

Go to <https://developer.apple.com/account>, scroll to **Membership details**
and copy the **Team ID**: ten letters and numbers, like `A1B2C3D4E5`.

## 3. Register the app ID

The app ID is the game's permanent name inside Apple, such as
`com.brennencol.mudcrowns`. It must match `appId` in `capacitor.config.json`, which is already set to `com.brennencol.mudcrowns`.

1. Go to <https://developer.apple.com/account/resources/identifiers/list>
   and press **+**.
2. Choose **App IDs**, then **App**.
3. Description: `Mud and Crowns`. Bundle ID: **Explicit**, then type the app ID.
4. Leave every capability unticked. Press **Continue**, then **Register**.

## 4. Create the app in App Store Connect

1. Go to <https://appstoreconnect.apple.com>, open **Apps** and press **+**,
   then **New App**.
2. Platform **iOS**. Name `Mud & Crowns` (if it's taken, try
   `Mud & Crowns: Medieval Life`). Primary language **English (U.S.)**.
   Bundle ID: the one from step 3. SKU: `mudcrowns`. User access: **Full**.
3. Press **Create**.

## 5. Make a key so GitHub can upload for you

1. In App Store Connect open **Users and Access**, then **Integrations**, then
   **App Store Connect API**. The first time, press **Request Access** and
   accept.
2. Under **Team Keys** press **+** (Generate API Key). Name: `GitHub`.
   Access: **Admin**. Admin is needed so Apple can sign the app for you.
3. Press **Generate**. Copy the **Issuer ID** (shown above the list) and the
   **Key ID** (in the row).
4. Press **Download** to save the `.p8` file. **You can only download it
   once.** Keep it private, like a password.

## 6. Give GitHub the four secrets

Go to <https://github.com/BrennenCol/Mud-Crowns/settings/secrets/actions>
and press **New repository secret** four times:

| Name | Value |
|---|---|
| `APPLE_TEAM_ID` | the Team ID from step 2 |
| `APPSTORE_ISSUER_ID` | the Issuer ID from step 5 |
| `APPSTORE_KEY_ID` | the Key ID from step 5 |
| `APPSTORE_KEY_P8` | open the `.p8` file in Notepad and paste all of it, including the `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----` lines |

Secrets stay hidden even though the repo is public: nobody can see them, and
they never show in the build logs.

## 7. Build and send it to Apple

1. Go to <https://github.com/BrennenCol/Mud-Crowns/actions/workflows/ios.yml>.
2. Press **Run workflow**, leave the box ticked, and press the green
   **Run workflow** button.
3. It takes about 10 to 15 minutes. A green tick means the build reached
   Apple. Apple then processes it for 10 to 30 minutes and emails you.

A red cross means something went wrong: open it to see the error, or ask
Claude to read the logs.

## 8. Try it on your iPhone (TestFlight)

1. In App Store Connect open your app, then **TestFlight**. The build appears
   there once Apple has processed it.
2. Under **Internal Testing** press **+**, make a group, and add yourself.
3. On your iPhone, install **TestFlight** from the App Store and open the
   invite. The game installs like any other app.

## 9. Fill in the store page and submit

Open your app in App Store Connect, then the **1.5.1** version on the left.
Everything to paste is in `STORE_LISTING.md`.

1. **Screenshots**: upload the six pictures from `store/ios-6.7in/` to the
   **iPhone 6.9" Display** slot.
2. **Promotional text, description, keywords, support URL**: paste them from
   `STORE_LISTING.md`.
3. **Build**: press **+** and choose the build you uploaded.
4. **App Review Information**: your name, email and phone. Sign-in required:
   **No**. Notes: `No account or login. The game plays fully offline.`
5. On the left, also fill in:
   - **App Privacy**: privacy policy URL from `STORE_LISTING.md`, then
     **Get Started** → *No, we do not collect data*
   - **Age Rating**: answers are in `STORE_LISTING.md`
   - **Pricing and Availability**: price **Free** (or choose one), and the
     countries
   - **App Information**: category **Games**, subcategories **Simulation** and
     **Role Playing**. Content rights: the game has no third-party content.
6. For the EU, Apple asks whether you are a **trader** (Business → Digital
   Services Act). If you are a hobbyist not earning from the game, you can say
   you are not a trader. If you skip this, the game is not offered in the EU.
7. Press **Add for Review**, then **Submit**. Review usually takes 1 to 3
   days. If Apple asks for changes, they tell you why, and you can reply and
   resubmit.

## Later updates

Every new version needs a higher version number. Claude raises it with each
release. Then run step 7 again, choose the new build on a new version page,
and submit.

## If the build fails

| Message | Fix |
|---|---|
| `Cloud signing permission error` | The key in step 5 must have **Admin** access. Make a new one and replace the secrets. |
| `No suitable application records were found` | Step 4 isn't done, or its bundle ID doesn't match `appId` in `capacitor.config.json`. |
| `Set your own appId` | `capacitor.config.json` still says `com.example.mudcrowns`. |
| `The Apple secrets are not all set` | One of the four secrets in step 6 is missing or misspelled. |
