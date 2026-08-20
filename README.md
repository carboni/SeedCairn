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
to be read directly by project ID, and (as far as I can tell) can only be
*read* that way, not written back to — `/design-sync`'s write path is for
design-system projects specifically. So design iteration stays in Claude
Design; I read from there, I don't push to it.

Two files there matter most:

- `product-notes.md` — naming, palette, voice, and product-principle
  decisions (source of truth for anything not obvious from the mockups)
- `Seed Backup Home.dc.html` — the actual screens, most recent first. Turn 6
  is a working prototype of the full create-backup flow (enter phrase →
  verify → name 5 people → write to NFC/print/stamp → done) — now built out
  in the app below. Turn 5 (option 5a) is the 3-screen onboarding + home
  screen.

Brand: fixed palette (not OS light/dark adaptive) — near-black stone
`#1b1d1c` header, warm stone sheet `#eae7e1` content, slate blue `#2f5f72` as
the only action color, ochre `#d8a75a` reserved for the seed/mark. Archivo
throughout. Mark is stacked stones (a cairn), ochre top stone standing in for
the seed.

## Status

Onboarding, home screen, and the full create-backup flow (enter → check →
choose people → write pieces → done) are built and match the draft closely.
**Cryptography and NFC are placeholders** — word entry/validation, the "write
to NFC" step, and print/metal export don't do anything real yet; this was
built to walk the UX end to end before wiring up the real crypto/NFC library.
The recover flow isn't built yet (the draft doesn't prototype it either).

## App

The Expo app lives in [`app/`](app/). See [`app/README.md`](app/README.md)
for the generated Expo template README.

- **Framework**: Expo SDK 57, Expo Router, React Native 0.86 (New
  Architecture). Runs on iOS, Android, and web (`expo start --web`).
- **Navigation**: root `Stack` in `src/app/_layout.tsx` gates between an
  `onboarding` screen and the main app (`index`, plus `new-backup` /
  `restore` modals) using `Stack.Protected`, driven by
  `src/contexts/onboarding-context.tsx`.
  - The "has completed onboarding" flag is persisted locally via
    `@react-native-async-storage/async-storage`. This is deliberately *not*
    treated as violating the "this app remembers nothing" promise — that
    promise is scoped (in the draft's own copy) to the seed phrase and
    shares, not to ordinary UX state. Nothing about the flag is sensitive
    and it never leaves the device.
- **Screens**:
  - `src/app/onboarding.tsx` — 3-slide swipeable intro matching the draft,
    with hand-drawn SVG illustrations ported from the mockup. "Skip" jumps
    straight to Home (matching the draft's intent), not to the last slide.
  - `src/app/index.tsx` — Home screen: dark hero ("keep it together") over a
    light action sheet with "Create a backup" / "Recover" cards, a replay-
    intro link, and the trust-line footer
  - `src/app/new-backup.tsx` — the full create-backup flow, a small state
    machine over five step components in `src/components/create-backup/`
    (`enter-step`, `check-step`, `people-step`, `write-step`, `done-step`),
    plus a shared `progress-header` (back chevron + 4-segment progress bar)
    ported from turn 6. Word entry has a tiny hardcoded sample wordlist for
    autocomplete flavor (not the real BIP-39 list) and an "abandon…" test
    vector for "Use an example phrase" — both placeholders.
  - `src/app/restore.tsx` — still the placeholder screen; the draft doesn't
    prototype a recover flow yet either
- `src/components/cairn-mark.tsx` — the stacked-stones brand mark (SVG)
- `src/constants/theme.ts` — `Palette` (fixed brand colors) and
  `ArchivoFonts` (loaded via `@expo-google-fonts/archivo` in `_layout.tsx`)

### Web

Works today (static export, `output: "static"` in `app.json`) and is how
this UI has been verified throughout (Playwright against `expo start --web`).
Decided direction: **keep web, but scope it differently from native**,
because of two real constraints, not just preference:

- **Web NFC only exists in Chrome on Android** — not Safari, not desktop,
  not iOS. So NFC writing can only ever be a native feature. On web, the
  write-step should default to (or only offer) print / download-as-PDF —
  which the draft already treats as an equal option to NFC, so this isn't
  new scope.
- **Trust model**: the whole pitch is "nothing leaves your device, verify
  the code yourself." A website doesn't carry the same guarantee a native
  app does — every visit trusts whatever JS the host served that day, and
  browsers add attack surface (malicious extensions scraping wallet-looking
  input fields is a known, real thing) that a native app sandbox avoids.
  Not a reason to skip web, but it should be visible in-product: a notice on
  the web build steering real backups toward the native app run offline,
  ideally with a link to the app once it's built. Worth considering making
  the web export a PWA that works fully offline after first load, so a
  cautious user could go into airplane mode before entering a real phrase.

Neither of these is implemented yet — this is the plan, to build when the
web build is actually being shipped.

### Next steps

- Crypto: BIP-39 / SLIP-39 splitting and recovery, likely via
  [`@fintoda/react-native-crypto-lib`](https://github.com/fintoda/react-native-crypto-lib)
  (trezor-crypto C core) — native code, so a development build is needed
  pretty much immediately (see below)
- NFC read/write for shares (native only)
- Recover flow (no draft prototype to follow yet — will need its own design
  pass, or can mirror the create flow's steps in reverse)
- Web-specific behavior described above (print-only write step, trust
  notice, maybe PWA offline support)
- App icons: a flat first-pass (cairn mark on stone-dark) is in place for
  the app icon, favicon, splash, and Android adaptive icon (incl.
  monochrome variant), generated from the same SVG as `cairn-mark.tsx` via
  a Playwright render script. iOS's layered "Icon Composer" format
  (previously `assets/expo.icon/`, now removed) is dropped in favor of this
  flat icon for now — a polished layered version is a Claude Design task
  for closer to shipping, not something worth hand-authoring blind.

#### Development build

Not set up yet, but `../hairtracker/app` and `../education/app` (sibling
repos) have a consistent `eas.json` + `package.json` convention worth
reusing rather than reinventing:

- `eas.json` build profiles: `development` (developmentClient, internal
  distribution, iOS simulator build), `development-iphone` (physical device,
  needs `EXPO_APPLE_TEAM_ID`), `preview`, `production` (remote
  `appVersionSource`, `autoIncrement`)
- `package.json` scripts: a `prep` pipeline (`lint && compile && test &&
  bundle && expo-doctor`) that every build script runs first, `eas build
  --local` for dev builds (skips the EAS cloud queue), `maestro` for UI
  e2e tests, `inspect` for build-archive introspection

## Development

```bash
cd app
npm install
npm start
```

Requires a development build (not Expo Go) once native modules (crypto, NFC)
land — see [`app/AGENTS.md`](app/AGENTS.md) for Expo SDK version notes.
