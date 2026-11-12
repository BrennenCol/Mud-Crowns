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
No ads, no accounts, no tracking. Plays fully offline. Your saves stay on your device, and a backup code moves them to a new phone.
```

## What's new (for this version)

Also in `store/whats_new_1.14.1.txt`, ready to copy.

```
BETTER PEOPLE, BETTER PLACES
Every person in the pictures has been redrawn by hand:
- Faces with eyes, brows and rosy cheeks, hair and beards, ears, and hoods and veils that frame the face
- Arms and hands, shoes, belts and buckles, and the folds and shadow of their clothes
- Smiths swing their hammers, cooks chop, masons and miners strike with mallet and pick, grooms brush the horses, all with the tool in their own hand
- People sit properly at tables and on thrones, and the jury sits on its bench
- You stand close up in the outdoor scenes too, with a neighbour beside you

LIVELIER ROOMS
- Shadows under the tables and barrels, sunlight falling through the windows onto the floor, and shade under the ceilings
- Painted borders on the walls of the shops, the inn and the guildhall
- A cat asleep by the kitchen fire and on the shop counter, another watching from beside the inn's barrels, hens in the stables and the village, mice along the walls, lambs frisking on the pasture, and a jester juggling at court
- Antlers over the inn's hearth and the alewife's chalk tally, copper pans in the kitchen, a lucky horseshoe over the smithy door, and herbs strewn on the great hall floor
- Rooms grow darker at night, lit by their fires, lamps and candles
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
