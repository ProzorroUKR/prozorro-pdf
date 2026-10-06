# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

`@prozorro/prozorro-pdf` is a framework-agnostic TypeScript library that locates signed `.p7s` documents in Prozorro central-database objects, has them decoded by the decryption service via `@prozorro/prozorro-eds` (peer dependency, `>=1.1.2`), and renders human-readable PDFs via `pdfmake`. By default (`SIGN_DECODE_MODE.URL`) the `.p7s` file is never downloaded into the browser — only its `documents[].url` is handed to the service; `SIGN_DECODE_MODE.FILE` restores the browser-download flow for dev/local data. The published package is a library; `index.html` + `vite.config.app.ts` produce a small demo app used for local development against real CBD data.

User-facing API and document-type catalog live in `README.md` (Ukrainian) — the table around line 135 is the authoritative list of supported `PROZORRO_PDF_TYPES` with their data sources and validation rules.

## Commands

- `npm run dev` — Vite dev server for the demo app (`index.html`).
- `npm test` — vitest (`tsconfig.json` excludes `*.test.ts` from typecheck).
- `npm run test:coverage` — vitest with v8 coverage.
- `npm run lint:scripts` — ESLint over `.ts` files. Note: `@typescript-eslint/no-explicit-any` is **off** project-wide; `any` is used throughout the codebase intentionally for `pdfmake` doc-definition shapes.
- `npm run format` — Prettier write.
- `npm run build` — full pipeline: `clean` → `build:lib` (tsc check + Vite lib build → `dist/prozorro-pdf.{es,cjs,iife,umd}.js` + rollup-merged `.d.ts`) → `build:app` (demo app into `dist/app`).
- `npm run types` — emit declarations only via `tsconfig.types.json`.

Run a single vitest file when tests exist: `npx vitest run path/to/file.test.ts`.

## Environment

`src/config/ENV.config.ts` reads `import.meta.env.VITE_{SB,ST,PROD}_*` at build time — see `.env.example` for the full list. `ProzorroPdfService.init(ENVIRONMENT_MODE, { signDecodeMode? })` picks the env bucket and forwards an equivalent mode to `ProzorroEds.init` via `src/config/edsModeMap.ts`. Changing env vars requires a Vite rebuild.

## Architecture: the two parallel strategy pipelines

The core flow in `src/services/PDF/PDF.ts#create` is **two sequential strategy lookups**, both keyed by document type:

1. **`LoaderManager`** (`src/services/PDF/P7SLoader/`) — given a fetched CBD object + `PdfDocumentConfigType`, locates the right `.p7s` document inside it (per the rules in the README table), passes its `url` to `SignVerifier` (`src/services/Sign/SignVerifier.ts`) as `{ signUrl, dataUrl? }` for decoding, and returns `{ file, type, signers, url, additionalData, title }`. Implementations live in `loaders/` and are registered in `LoaderStrategyMap.ts`, keyed by `PROZORRO_PDF_TYPES`. `SignVerifier` has two modes (`SIGN_DECODE_MODE`, chosen via `init` options and plumbed `PdfDocument` → `LoaderManager` → `LoaderFactory` → loader ctor): `URL` (default) forwards the links for the decryption service to fetch; `FILE` downloads the files in the browser and sends base64 — needed for local `/test-data/` fixtures in the demo app (toggle in `index.html`).
2. **`DocumentManager`** (`src/services/PDF/document/`) — given the decoded `file` + signers + dictionaries, produces a pdfmake document definition (`content`, `header`, `footer`, `styles`, `pageMargins`). Implementations live in `documentData/` (or under `src/widgets/*` for larger ones — `AnnouncementDataMaker`, `ComplaintPostDataMaker`) and are registered in `DocumentStrategyMap.ts`, keyed by `PdfTemplateTypes`.

The two enums (`PROZORRO_PDF_TYPES` in `PdfTypes.ts`, `PdfTemplateTypes` in `PdfTemplateTypes.ts`) are deliberately distinct — one loader can yield different template types (e.g. `TICKET` yields `XML` or `KVT` depending on the file extension found). Each loader sets `type` in its return to drive the second lookup.

**Adding a new document type means touching at minimum:** the `PROZORRO_PDF_TYPES` enum, a new `XxxLoader` registered in `LoaderStrategyMap`, the `PdfTemplateTypes` enum (if a new template), a new `XxxDataMaker` extending `AbstractDocumentStrategy` registered in `DocumentStrategyMap`, an entry in the README table, and re-exports from `src/main.ts` if any new public types are introduced.

`AbstractDocumentStrategy` (`src/services/PDF/document/AbstractDocumentStrategy.ts`) provides shared helpers (`createFooter` with QR + signer info, `showIfAvailable`, `getField`, date formatters). Subclasses must implement `create()` and `getPageMargins()`; `createHeader()` and `pageBreakBefore()` are optional overrides. `DocumentManager` swaps in `complaintPostCustomFooter` for the `COMPLAINT_POST` template — that's the only footer override in the system.

## Public surface

`src/main.ts` instantiates a singleton `ProzorroPdfService` and (in browser contexts) attaches it to `window.signToDoc`. Consumer lifecycle is three ordered steps: `init(ENVIRONMENT_MODE)` once → `setConfig({ url, type })` to register the source URL + `PROZORRO_PDF_TYPES` → then any of the four document-producing methods with a `PdfDocumentConfigType`. The four methods all funnel through the private `create()` and differ only in what they do with the resulting pdfmake doc:

- `open()` → new tab via `pdfmake.createPdf(...).open()`
- `save(_, fileName?)` → triggers download
- `getIframe(_, parentFrameId?)` → renders into `<iframe>` inside the given DOM id (default `signToDocFrameID`), via `DomHandler.passIframe`
- `getDataUrl()` → returns a data-URL string (used for `blob`-style consumption)

`PROZORRO_TEMPLATE_CODES` (in `src/widgets/pq/types/TemplateCodes.enum.ts`) is the closed set of contract-template codes accepted by `PQ`; it is exported publicly and used both as an enum value and a string-key into PQ template configs.

## Errors

All thrown errors must be `ErrorExceptionCore` instances (see `src/widgets/ErrorExceptionCore/`). The pattern is: validate with `Assert.isDefined(value, ERROR_MESSAGES.<bucket>.<key>, PROZORRO_PDF_ERROR_CODES.<code>)`, and wrap any caught error by re-throwing `new ErrorExceptionCore(error as Error)`. The constructor auto-logs via `logWithTrace()` unless the input is already an `ErrorExceptionCore` (prevents double logging when re-thrown). Message catalog: `src/widgets/ErrorExceptionCore/configs/messages.ts`. Error codes: `src/widgets/ErrorExceptionCore/constants/ERROR_CODES.enum.ts`. The README error tables (around line 168) document every code/message pair for users — keep both in sync when adding new errors.

## Conventions

- Path alias `@/*` → `src/*` (configured in both `tsconfig.json` and `vite.config.ts`). Always import via `@/...`, not relative paths across feature boundaries.
- `tsconfig.json` is strict (`noUnusedLocals`, `noUnusedParameters`, `noImplicitReturns`) and uses `verbatimModuleSyntax` — type-only imports must use `import type`.
- Two visible top-level folders for new code: `services/PDF/document/documentData/` for simple data-makers, `widgets/<Name>/` when a document needs its own constants/sub-services/templates (PQ, TenderAnnouncement, ComplaintPost, DeviationReport, ErrorExceptionCore are existing examples).
- `decimal.js` is used for money math in PQ/Announcement; do not use raw JS arithmetic on `value.amount`.
