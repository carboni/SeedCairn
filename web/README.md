# SeedCairn website

The landing page for [seedcairn.com](https://seedcairn.com), following the
same static-site pattern as `../hairtracker/web` and `../education/web`:
plain HTML/CSS/JS in `public/`, no build step beyond minification, deployed
to S3 behind CloudFront by `.github/workflows/web.yml`.

## Brand

Kept in sync by hand with `../app/src/constants/theme.ts`:

- `#1b1d1c` near-black stone (header/hero), `#eae7e1` warm stone (content),
  `#2f5f72` slate blue (the only action colour), `#d8a75a` ochre (reserved
  for the seed/mark).
- Archivo throughout, loaded via Google Fonts.
- The mark is `public/img/mark.svg` — four stacked stones, ochre top stone
  standing in for the seed. Geometry is ported exactly from the same design
  source as `app/src/components/cairn-mark.tsx`, so if that changes, update
  both.

## Preview locally

```bash
./preview.sh
```

## Deploy

Pushes to `main` that touch `web/**` build and deploy automatically via
`.github/workflows/web.yml` — see that file and (once it exists) the
`.infrastructure` CDK stack for the S3 bucket / CloudFront distribution it
deploys to.

