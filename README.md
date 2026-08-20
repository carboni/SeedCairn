# SeedCairn

*keep it together*

A mobile app for backing up and recovering a crypto wallet seed phrase (BIP-39)
using Shamir's Secret Sharing (SLIP-39), with shares written to NFC cards (or
printed / stamped into metal) for durable, offline storage.

The idea: instead of one seed phrase written on one piece of paper, split it
into five pieces and give one to each person you trust. No single piece
reveals anything on its own; any three together rebuild the phrase exactly.
Nothing ever leaves the device — no accounts, no server, no stored state.

## Design

The product direction lives in a Claude Design project, **"Bitcoin Seed
Backup App"** (`claude.ai/design/p/d2bed55a-d97c-44a1-91a6-3dfee98c1ded`) —
not a design-system project, so it won't show up via `/design-sync`; it has
to be read directly by project ID. Two files there matter most:

- `product-notes.md` — naming, palette, voice, and product-principle
  decisions (source of truth for anything not obvious from the mockups)
- `Seed Backup Home.dc.html` — the actual screens, most recent first. Turn 6
  is a **working prototype of the full create-backup flow** (enter phrase →
  verify → name 5 people → write to NFC/print/stamp → done) — well ahead of
  what's implemented in the app so far. Turn 5 (option 5a) is the 3-screen
  onboarding + home screen this first pass implements.

Brand: fixed palette (not OS light/dark adaptive) — near-black stone
`#1b1d1c` header, warm stone sheet `#eae7e1` content, slate blue `#2f5f72` as
the only action color, ochre `#d8a75a` reserved for the seed/mark. Archivo
throughout. Mark is stacked stones (a cairn), ochre top stone standing in for
the seed.

## Status

Onboarding + home screen implemented, matching the draft design closely
(exact copy, palette, typography, mark, illustrations). **No cryptography or
NFC functionality yet** — that's next, following turn 6's prototyped flow.

## App

The Expo app lives in [`app/`](app/). See [`app/README.md`](app/README.md)
for the generated Expo template README.

- **Framework**: Expo SDK 57, Expo Router, React Native 0.86 (New
  Architecture). Runs on iOS, Android, and web (`expo start --web`).
- **Navigation**: root `Stack` in `src/app/_layout.tsx` gates between an
  `onboarding` screen and the main app (`index`, plus `new-backup` /
  `restore` modals) using `Stack.Protected`, driven by
  `src/contexts/onboarding-context.tsx`. That context is in-memory only
  right now (resets on reload) — it'll move to persistent storage once
  secure storage is wired up for real secrets anyway.
- **Screens so far**:
  - `src/app/onboarding.tsx` — 3-slide swipeable intro matching the draft
    (who it's for, how SLIP-39 splitting works, writing shares to NFC/print/
    metal), with hand-drawn SVG illustrations ported from the mockup
  - `src/app/index.tsx` — Home screen: dark hero ("keep it together") over a
    light action sheet with "Create a backup" / "Recover" cards, a replay-
    intro link, and the trust-line footer
  - `src/app/new-backup.tsx`, `src/app/restore.tsx` — placeholder modal
    screens the action cards navigate to, pending real implementation
    (mirrors the draft's own "this flow isn't designed yet" placeholder)
- `src/components/cairn-mark.tsx` — the stacked-stones brand mark (SVG)
- `src/constants/theme.ts` — `Palette` (fixed brand colors) and
  `ArchivoFonts` (loaded via `@expo-google-fonts/archivo` in `_layout.tsx`)

### Web

The web build already works (static export, `output: "static"` in
`app.json`) and was used to verify this UI. Still an open decision on
whether/how to ship it long-term — see discussion below.

### Next steps

- Crypto: BIP-39 / SLIP-39 splitting and recovery, likely via
  [`@fintoda/react-native-crypto-lib`](https://github.com/fintoda/react-native-crypto-lib)
  (trezor-crypto C core) — this pulls in native code, so we'll need an
  [Expo development build](https://docs.expo.dev/develop/development-builds/introduction/)
  rather than Expo Go pretty much immediately
- NFC read/write for shares (native only — see Web NFC caveat above)
- Print / metal-stamp export for shares (works on web too)
- Build out the create-backup and recover flows per turn 6's prototype
- Persist onboarding/app state (secure storage)
- App icon / splash art still Expo defaults — swap for the cairn mark once
  we're ready to produce real app-store assets

## Development

```bash
cd app
npm install
npm start
```

Requires a development build (not Expo Go) once native modules (crypto, NFC)
land — see [`app/AGENTS.md`](app/AGENTS.md) for Expo SDK version notes.
