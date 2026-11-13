# Store listing: text to paste

Everything the App Store and Google Play ask for, ready to copy. The
pictures are in `store/`.

## Links

| Field | Link |
|---|---|
| Privacy policy URL | https://brennencol.github.io/Mud-Crowns/privacy.html |
| Support URL | https://brennencol.github.io/Mud-Crowns/support.html |
| Marketing / website (optional) | https://brennencol.github.io/Mud-Crowns/ |

These come from GitHub Pages (repo Settings → Pages). Open each link once in a
browser to check that it loads before you paste it.

## Names and short lines

| Field | Limit | Text |
|---|---|---|
| App Store name | 30 | `Mud & Crowns` |
| App Store subtitle | 30 | `From serf to sovereign` |
| Google Play name | 30 | `Mud & Crowns: Medieval Life` |
| Google Play short description | 80 | `Live a whole medieval life, from serf to sovereign. Every choice is yours.` |
| App Store keywords | 100 | `medieval,life simulator,kingdom,knight,dynasty,peasant,king,queen,pirate,history,choices,text,rpg` |

Keywords: no spaces after commas, and don't repeat words that are already in
the name. Never use another game's name.

**Promotional text** (App Store, 170 characters, can be changed any time
without a review):

> A whole life in a living medieval world. Farm, trade, sail, fight and scheme
> your way from the mud to the crown, then carry on as your heir.

## Description (both stores)

```
Live a whole life in a medieval kingdom, one year at a time.

Be born a serf in a muddy village, a smith's child, a merchant's heir or a royal prince. Each year you have three deeds: work your trade, court a sweetheart, pray, train, scheme, feast or march to war. Then turn the page and see what the year brings.

A WORLD THAT LIVES WITHOUT YOU
Kings age, marry and die. Heirs fight over empty thrones. Plague and famine sweep the counties, outlaws and knights make their names, and your neighbours have lives of their own. The chronicle tells you all of it.

NEARLY 300 POSTS TO RISE THROUGH
Farm labourer, apprentice, blacksmith, apothecary, monk, minstrel, thief, sailor, knight, merchant, royal guard, chancellor, pirate queen. Careers have real steps: learn the work in one post to earn the next, or find a way around it through noble birth, the king's favour or a powerful patron.

SHIPS, TRADE AND HIGH OFFICE
Captain a pirate ship and raid the coasts. Send trade runs across six markets. Serve the crown with duties of your own.

WAR AND CONQUEST
Raise an army, choose your tactics and take counties on a living map of nine kingdoms. Rule as a lord, then as a monarch with a council, taxes and decrees.

LOVE, FAMILY AND DYNASTY
Court, marry and raise children. When you die, carry on as your heir. Your graveyard remembers every life.

FAIR AND PRIVATE
No ads, no accounts, no tracking. Plays fully offline. Your saves stay on your device.
```

## What's new (for this version)

Also in `store/whats_new_1.22.0.txt`, ready to copy (it covers 1.22 and ends with short notes on 1.21 and 1.20).

```
THE PORTRAIT GALLERY
When your council or your family finds you a match, the candidates now hang on easels in a long gallery, under velvet cloths that fall away one by one. Tap a portrait to see who they are and, in plain words, what they would bring: an alliance, the great lords' support, a dowry, or a scandal. Choose one, and their portrait is carried to the middle of the gallery as the bells ring and petals fall.

A LADY OF THE HOUSEHOLD
Kings and queens now find one of their own court among the candidates: one of the queen mother's ladies-in-waiting, or a gentleman of the chamber. Someone who already knows you, with a small dowry and no alliance. The council will grumble.

THE KING'S EYE
A woman serving at court as a lady-in-waiting may catch the eye of the king, or a prince. As history shows, there is not much she can do about it: curtsey and say little, let him see she is pleased, or beg the queen to send her home, and hope she is allowed to go. From there it can end in a crown, a manor and a knight for a husband, or being sent home in disgrace.

COURTING AS IT WAS (1.21)
Men mostly married women younger than themselves. A man is sought for his land, trade and silver; a woman for her youth, family and dowry. Most marry within their own rank, and nobody under eighteen courts.

EVERY OFFICE, PLAYED (1.20)
All the work of high office is a real game in its own painted scene.
```

## Category

- App Store: **Games**, subcategories **Simulation** and **Role Playing**
- Google Play: **Games → Simulation**. Tags: Simulation, Role playing, Single
  player, Offline, Stylized

## Age rating answers

Answer the questionnaires honestly. For this game:

| Question | Answer |
|---|---|
| Violence | Yes: realistic, described in text, not graphic (battles, executions, hanging) |
| Blood or gore | No |
| Sexual content or nudity | No (courtship, marriage and royal favourites in a line of text, nothing described or shown) |
| Mature or suggestive themes | From 1.9: Frequent (affairs, mistresses, seduction, scandal, crime, executions; described in a line of text, never shown) |
| Alcohol, tobacco or drugs | References only (taverns, ale, drunkenness) |
| Simulated gambling | **None** (removed in 1.11.1: Apple does not allow simulated gambling from individual developers) |
| Real-money gambling | No |
| Profanity or crude humour | Infrequent and mild |
| Horror or fear themes | Infrequent and mild |
| Users can talk to each other | No |
| Shares location | No |
| Web access or unrestricted browsing | No |

Versions 1.5.1 to 1.8 rate about **13+** on the App Store. From 1.9, with
Mature or suggestive themes answered Frequent, expect about **16+** on the App
Store and about **PEGI 16** on Google Play. On Google Play's target audience
question, choose **16 and over** from 1.9, so the "Designed for Families" rules
don't apply.

## Privacy answers

- App Store, App Privacy: **Data Not Collected**
- Google Play, Data safety: **No data collected, no data shared**. The app has
  no ads, no accounts, no analytics and makes no network requests.
- Google Play, "Contains ads": **No**
- App Store, export compliance (encryption): **No**, the app uses no
  encryption beyond what iOS itself provides

## Pictures

| What | File | Where it goes |
|---|---|---|
| iPhone screenshots | `store/iphone/01-whole-life.png` to `08-dynasty.png`, in that order (1206×2622) | App Store Connect → iPhone with Dynamic Island (medium display) |
| Android screenshots | `store/android-phone/*.png` (1080×2160) | Play Console → Phone screenshots |
| Feature graphic | `store/android-feature-graphic.png` (1024×500) | Play Console → Feature graphic (required) |
| App icon, Google Play | `icons/icon-512.png` | Play Console → App icon |
| App icon, App Store | `icons/icon-1024.png` | Set inside Xcode by `npx capacitor-assets generate` |

Screenshot order: 1 the chronicle and village, 2 finding work, 3 news of the
world, 4 the map of nine kingdoms, 5 a battle, 6 a pirate queen's fleet.
