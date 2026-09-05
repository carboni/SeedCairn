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

Files there that matter:

- `product-notes.md` — naming, palette, voice, and product-principle
  decisions (source of truth for anything not obvious from the mockups)
- `Seed Backup Home.dc.html` — the actual screens, most recent first. Turn 6
  is a working prototype of the full create-backup flow (enter phrase →
  verify → name 5 people → write to NFC/print/stamp → done) — now built out
  in the app below. Turn 5 (option 5a) is the 3-screen onboarding + home
  screen.
- `App Icon & Splash.dc.html` + `assets/brand/` — the real icon/splash art:
  three iOS appearances (light/dark/tinted), a two-layer version for Icon
  Composer, Android adaptive-icon layers, splash art, and vector sources in
  `assets/brand/svg/`. Pulled into the app below (see "App icons").

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
- `src/components/cairn-mark.tsx` — the stacked-stones brand mark (SVG),
  geometry ported exactly from the design project's `mark-transparent.svg`
- `src/constants/theme.ts` — `Palette` (fixed brand colors) and
  `ArchivoFonts` (loaded via `@expo-google-fonts/archivo` in `_layout.tsx`)

### App icons

Pulled from the design project's `assets/brand/` (see Design, above) and
regenerated through a small Playwright render script using the *exact*
vector coordinates from `assets/brand/svg/mark-transparent.svg` — same
shapes, same colors, not a hand-approximation:

- `app.json` → `icon` (generic fallback) and `ios.icon.{light,dark,tinted}`
  — the three iOS appearances, wired directly with flat PNGs. No Icon
  Composer needed for this.
- `android.adaptiveIcon` — foreground + monochrome layers, mark held inside
  the 264px safe zone on a 432px canvas per the design spec; background is
  the flat `#1b1d1c` via `backgroundColor` rather than an image.
- `expo-splash-screen` — mark alone, transparent, sized to the ~66.7% safe
  margin the design calls out for Android 12+'s 240dp circle splash trim
  (reused for both platforms rather than risking iOS-only art getting
  clipped on Android).
- `assets/icon-composer-source/` — `layer-stones-1024.png` +
  `layer-seed-1024.png`, two transparent layers on identical 1024
  registration, staged for anyone who wants to build the richer *layered*
  iOS icon (see below). Not wired into `app.json` yet.

**Upgrading to the layered iOS icon** (optional — the flat trio above
already gives full light/dark/tinted support without this):

1. Open **Icon Composer** (macOS 26 / Xcode 26+).
2. Import `layer-stones-1024.png` as the bottom layer, `layer-seed-1024.png`
   as a layer above it (both from `assets/icon-composer-source/`).
3. Set the canvas background fill to flat `#1b1d1c` (no gradient — matches
   the design's "all art is flat vector" direction).
4. Optionally give the seed layer a subtle specular pass so it reads as
   floating above the stones, per the design notes.
5. Preview across light/dark/tinted/clear in Icon Composer's preview pane.
6. Export as a `.icon` bundle, copy it into `app/assets/expo.icon/`.
7. In `app.json`, replace `ios.icon`'s `{light, dark, tinted}` object with
   `ios.icon: "./assets/expo.icon"` (a bundle path supersedes the flat trio
   — Expo's schema takes one or the other, not both).
8. Re-run `npx expo prebuild --clean` (or rebuild the dev client) to pick it
   up.

`play-store-512.png` (design project only, not pulled into the repo) is a
manual Play Console upload, not something `app.json` references.

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

### Crypto & NFC libraries

Researched rather than guessed at — `@fintoda/react-native-crypto-lib` (the
original ChatGPT suggestion) turned out to be real and functionally
complete (wraps trezor-crypto, exposes both BIP-39 and SLIP-39), but has
essentially no adoption (36 weekly npm downloads, 2 GitHub stars, unaudited)
— not something to trust with real seed phrases. Decisions made instead:

- **BIP-39**: [`@scure/bip39`](https://www.npmjs.com/package/@scure/bip39)
  — installed. Audited (cure53, 2022), part of the noble/scure ecosystem,
  7M weekly downloads, pure JS/TS (works without a dev client, unlike a
  native crypto module).
- **NFC**: [`react-native-nfc-manager`](https://github.com/revtel/react-native-nfc-manager)
  — installed on the **`4.0.0-beta.7`** line, not the `3.17.2` "latest"
  stable. This isn't just a version-pinning preference: the library's own
  README states plainly that **v3 only supports the legacy architecture and
  v4 (beta) is the New Architecture line**. RN 0.86 has no legacy-architecture
  option at all (removed in RN 0.82) — so 3.x would very likely not work in
  this app, not merely be "untested." The beta hasn't shipped a new release
  in ~8 months and has at least one known open New-Architecture bug
  ([#833](https://github.com/revtel/react-native-nfc-manager/issues/833),
  iOS `getTag()` double-callback), so it's a real beta, not just a version
  number — worth watching on-device. `expo-doctor`'s "untested on New
  Architecture" warning is suppressed in `package.json`
  (`expo.doctor.reactNativeDirectoryCheck.exclude`) since React Native
  Directory's registry doesn't track compatibility per-version and can't
  yet know beta.7 is the New-Architecture-targeted release — the warning
  was about the package as a whole, not a signal against this specific
  version. Config plugin API (`nfcPermission`, etc.) is unchanged between
  3.x and 4.0-beta, so the existing `app.json` config needed no changes.
  iOS NDEF write is real but foreground-only regardless of version (a Core
  NFC constraint, not a library limitation).
- **SLIP-39**: implemented from spec — `src/lib/slip39/` (see below). Given
  the lack of a maintained audited library, and that this is the one place a
  bug directly threatens someone's wallet, you chose to build to spec rather
  than vendor `slip39-js`.

### SLIP-39 implementation (`app/src/lib/slip39/`)

Built directly against SatoshiLabs' [SLIP-0039](https://github.com/satoshilabs/slips/blob/master/slip-0039.md)
spec and cross-checked line-by-line against the reference Python
implementation ([`trezor/python-shamir-mnemonic`](https://github.com/trezor/python-shamir-mnemonic))
— not just the spec prose, which turned out to have at least one
paraphrase-level ambiguity (the PBKDF2 iteration-count formula) that only
the actual reference source resolved unambiguously. Built on `@noble/hashes`
(sha256/hmac/pbkdf2) and `expo-crypto` for CSPRNG — no unaudited crypto
dependency.

- `wordlist.ts` — the official 1024-word list, downloaded verbatim (an
  LLM-summarized fetch of the same file misidentified it as BIP-39 and
  refused to reproduce it — pulled directly via `curl` instead, since it's
  published open-standard data, not sensitive content)
- `rs1024.ts` — the checksum (customization string `"shamir"` /
  `"shamir_extendable"`)
- `gf256.ts` — GF(256) field arithmetic (Rijndael polynomial) and Lagrange
  interpolation, used by Shamir splitting
- `shamir.ts` — raw-byte Shamir split/recover, including the digest-share
  (HMAC-based tamper/mismatch detection) at index 254
- `feistel.ts` — the 4-round Feistel cipher that encrypts the master secret
  with an optional passphrase
- `mnemonic.ts` — bit-packing shares to/from the actual word sequences
- `slip39.ts` — the two-level (group-of-groups, then members) orchestration:
  `generateMnemonics` / `combineMnemonics` / `decodeMnemonics`
- `__tests__/` — validated against **all 45 official test vectors** (both
  the valid-recovery cases and the deliberately-invalid ones: bad checksums,
  mismatched groups/thresholds, tampered digests, wrong padding, the
  extendable-backup variant) plus its own round-trip tests (generate →
  combine, multi-group, passphrase, threshold-not-met). All 53 pass
  (`npm test`).
  - One real gotcha hit along the way: the official vectors are combined
    with passphrase `"TREZOR"` by convention (per the reference repo's own
    `test_shamir.py`), not empty — an early run against empty passphrase
    produced consistently wrong secrets and looked like a crypto bug, until
    cross-checking against a locally-installed copy of the actual Python
    package (which produced the identical "wrong" result with empty
    passphrase) isolated it to the test harness, not the implementation.

Not yet wired into the UI — `enter-step`/`check-step` in the create-backup
flow still use placeholder validation and a hardcoded sample wordlist. That
wiring, plus the BIP-39 side via `@scure/bip39`, is the next step.

### Development build

**Installed**: `expo-dev-client`, `react-native-nfc-manager` (config plugin
wired in `app.json`), `@scure/bip39`. Expo Go can no longer run this app
now that a native module (NFC) is configured.

**Not done yet** (needs a real device/Xcode/Android Studio, which this
environment doesn't have): actually building the dev client. Once ready:

```bash
npx expo prebuild        # generates ios/ and android/ native projects
npx expo run:ios         # or run:android — builds and installs the dev client
npx expo start --dev-client
```

`../hairtracker/app` and `../education/app` (sibling repos) have a
consistent `eas.json` + `package.json` convention worth reusing rather than
reinventing for the actual build pipeline:

- `eas.json` build profiles: `development` (developmentClient, internal
  distribution, iOS simulator build), `development-iphone` (physical device,
  needs `EXPO_APPLE_TEAM_ID`), `preview`, `production` (remote
  `appVersionSource`, `autoIncrement`)
- `package.json` scripts: a `prep` pipeline (`lint && compile && test &&
  bundle && expo-doctor`) that every build script runs first, `eas build
  --local` for dev builds (skips the EAS cloud queue), `maestro` for UI
  e2e tests, `inspect` for build-archive introspection

### Next steps

- Wire the now-implemented BIP-39/SLIP-39 logic into the create-backup flow
  (replacing the placeholder word-entry validation and example phrase in
  `enter-step`/`check-step`)
- Build the dev client (`expo prebuild` + `expo run:ios`/`run:android`) and
  wire real NFC read/write into the write step
- Recover flow (no draft prototype to follow yet — will need its own design
  pass, or can mirror the create flow's steps in reverse)
- Web-specific behavior described above (print-only write step, trust
  notice, maybe PWA offline support)
- Layered iOS Icon Composer upgrade (optional, see App icons above)



### Cryptographic review by Claude Fable 5.1 (high)

5 Sep 2026, commit c6ec64bdd96a5c57a498b87e37f7c711a832b004

### Prompt

Can you review the implementation of the slip-39 spec and check any other cryptographic operations in this repo please? I'm planning to use the app to split my real seed phrase into parts and I would like to be as sure as possible that I'm not putting my keys at risk by using this code, either when generating the parts, or if I need to recover my phrase i future. Is that something you're able to do for me please?

### Response

Yes, and it's done. Here is the review.

#### Verdict

The SLIP-39 implementation is correct and interoperable with Trezor's reference library. I found no defect in the cryptography that would put your keys at risk, either at split time or at recovery time. The findings below are about the surrounding app flow and operational practice, not the maths.

#### What I verified

 * **Line by line against the spec.** GF(256) tables and Lagrange interpolation, the RS1024 generator constants and checksum, the four-round Feistel with PBKDF2-HMAC-SHA256 and the salt rules for extendable and non-extendable sets, the HMAC digest share (key is the random part, message is the secret), the share-parameter bit layout, and the padding check all match SLIP-39 and python-shamir-mnemonic.
 * **Wordlist and vectors.** The bundled wordlist is byte-identical to upstream, sorted, with unique four-letter prefixes. The bundled vectors are identical to upstream and all 45 pass.
 * **Cross-implementation test.** Shares generated by the app were recovered by python-shamir-mnemonic 0.3.0 for every one of the ten 3-of-5 combinations, at both 128 and 256 bits, plus non-extendable, passphrase with a higher iteration exponent, and multi-group sets. Shares generated by the Python library in six configurations were recovered by the app. The recovered entropy converted to the same BIP-39 phrase in an independent library.
 * **Randomness.** Shares and identifiers come from expo-crypto, which is SecureRandom on Android and SecRandomCopyBytes on iOS. BIP-39 generation uses noble, which reads the random source at call time and throws if it is missing, so a broken polyfill fails closed rather than silently weak.
 * **Data handling.** Nothing except the onboarding flag is persisted. No network, logging, or clipboard use. Word inputs disable autocorrect.
The temporary test file I added has been deleted, and git status is back to your four pre-existing modified files. The scripts are in the scratchpad if you want to rerun the interop check.

#### Findings

 - **Re-split after editing can produce a mixed set** in `new-backup.tsx:64-77` and `generate-backup.tsx:88-102`. The shares live in a useMemo keyed on the words, so if you write pieces one and two, go back, change a word and change it back, pieces three to five come from a fresh split with a new identifier. React also documents useMemo as a performance hint, not a guarantee. The app would catch this at recovery with "belongs to a different backup", but by then the set is useless. Freeze the shares in state when entering the write step, reset the write index on any regeneration, and consider a mandatory recovery drill before "Done".
 - **No screenshot or screen-recording protection** on the phrase and piece screens. The expo-screen-capture package can block capture and blank the app-switcher thumbnail.
 - **Printing goes through the OS print spooler.** The PDF, including the QR code, may be cached by the print service or the printer. One piece reveals nothing, so this is acceptable, but do not print several pieces on a network printer.
 - **Share value lengths are not checked before interpolation** in `slip39.ts:101-135`. The reference rejects mismatched lengths explicitly. Here the digest check catches it with a one in four billion false pass, and it is only reachable if two unrelated sets share a random identifier. Cheap to add.
 - **A hostile share with iteration exponent 15** would make recovery run for hours. Not a key risk, just a hang.
 - **The README still says the crypto is a placeholder**. Worth updating so a future reviewer is not misled.

#### Recovery without the app

The master secret is your BIP-39 entropy, not the phrase or the seed. To recover without the app, run shamir recover from python-shamir-mnemonic offline, then convert the hex to a phrase with any offline BIP-39 tool. I verified that path. A Trezor cannot import these shares directly as a wallet, since it treats the SLIP-39 secret as the seed rather than as BIP-39 entropy.

The app defaults to the extendable flag. That is supported by python-shamir-mnemonic 0.3.0 and Trezor firmware 2.7.1 onwards, but not by older tools. If you want the widest possible compatibility for a recovery years from now, consider generating with extendable set to false. Either way, store a note with the pieces saying "SLIP-39, 3 of 5, master secret is BIP-39 entropy".

Two things this review cannot tell you: the build on your phone must actually come from this source, and your wallet's BIP-39 passphrase, if you use one, is not backed up by these pieces. Before trusting a real set, do a recovery drill with two different three-piece combinations read back from the actual cards.

Sources: [Trezor firmware changelog](https://github.com/trezor/trezor-firmware/blob/main/core/CHANGELOG.md), [Trezor SLIP-39 docs](https://docs.trezor.io/trezor-firmware/core/misc/slip0039.html)

## Development

```bash
cd app
npm install
npm start
```

A development build (not Expo Go) is required now that a native module
(NFC) is configured — see "Development build" above and
[`app/AGENTS.md`](app/AGENTS.md) for Expo SDK version notes.

## License

Source is published for verification — you can read it, clone it, and build
and run your own copy. It is not open source: no redistribution, and no
reuse in other products. See [`LICENSE`](LICENSE).
