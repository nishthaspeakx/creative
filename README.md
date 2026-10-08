# SpeakX Creative Studio — public source edition

A creative repository and marketing dashboard built with React, TypeScript, Vinext and Cloudflare D1/R2.

**This public repository contains synthetic sample personas only.** Internal persona definitions, value-persona names and commercial figures, private workbook links, planning documents, credentials, uploaded media and runtime databases are excluded. It has fresh Git history with no private-source ancestor. The separately hosted private workspace is not changed by this repository.

## Features
- Ten-brand competitor watchlist, search/filter/sort, five dated public Meta Ad Library references and manual persona mapping.
- Persistent creative repository: production details, scripts, language, audience tags, video versions, status and usage tracking.
- Private video upload, preview/streaming and downloads (MP4/WebM/MOV, up to 25 MB).
- Daily performance CSV import with validation, weighted metrics, attribution/date filtering and CSV exports.
- Creative pipeline and persona-coverage comparison.
- Authentication, per-user database/media access, optimistic edit protection and atomic audit snapshots.

Live Meta, daily competitor collection, AI analysis, billing/attribution models and shared team roles are not connected. Competitor references are research snapshots, not measured performance rankings.

## Local setup

Requires Node.js 22.13 or later and npm.

```sh
npm ci
npm test
npx tsc --noEmit
npm run build
```

Apply the database migrations to local storage after the first build:

```sh
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_quiet_earthquake.sql
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0001_romantic_gravity.sql
npm run dev
```

Open the printed loopback URL. The starter provides a development-only sign-in identity. D1 records and R2 files stay in ignored `.wrangler/` storage. Hosted authentication is supplied by Sites; this repository alone does not provision a production host.

The public `.openai/hosting.json` intentionally contains no private Site ID. Create your own private Site and configure D1 `DB` and R2 `BUCKET` before deploying. Never expose the development server as a production service. Add explicit memberships and roles before enabling team sharing.

## Private data integration

`lib/catalog.json` contains two clearly labelled synthetic personas with the schema expected by the UI. `lib/seeds.ts` contains public competitor references and an empty value-persona catalog. For production, replace sample catalogs through an authenticated private data service or in a separate private deployment checkout. Do not commit confidential definitions or commercial figures to this public repository, even temporarily; Git retains history.

Private source documents, commercial datasets and existing deployment credentials must remain outside this checkout. Connector tokens belong in server-side secret storage, never in client code or committed configuration.

## Performance CSV contract

Headers: `date,ad_id,ad_name,spend,impressions,clicks,installs,trials,revenue`.
Required: date, ad_id, spend, impressions and clicks. One row per ad per day; no demographic or placement breakdowns. Up to 1,000 rows per import. Preserve long ad IDs as strings. Amounts must be INR; enter the account and attribution/timezone basis explicitly. Blank optional metrics mean unavailable, not zero. Reimports replace matching account + basis + ad + day records. Ratios are calculated from totals. Reported revenue/spend is not payment-reconciled net ROAS.

## Tests

`npm test` covers calculations, parsing, validation, formula-safe exports and ID precision. `npx tsc --noEmit` checks types.

For local integration tests, run the dev server and create a synthetic video fixture (requires ffmpeg):

```sh
mkdir -p .sites-runtime/qa
ffmpeg -f lavfi -i color=c=0x087e80:s=320x568:d=2 -c:v libx264 -pix_fmt yuv420p -movflags +faststart .sites-runtime/qa/test-video.mp4
node tests/api.integration.mjs
node tests/atomic-save.integration.mjs
```

These tests write synthetic data only to the local development database. They cover authentication, CRUD, edit conflicts, duplicate ad mappings, file ownership, video downloads/byte ranges, imports, exports and rollback on audit failure. Never point them at production.
