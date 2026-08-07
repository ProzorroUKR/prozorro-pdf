# Changelog

Усі помітні зміни в `@prozorro/prozorro-pdf`. Нові записи — зверху.

## 06.08.2026

- Fixed empty page in `ANNUAL_PROCUREMENT_PLAN`.

## 03.08.2026

- Fixed `EDUCATION_PRICE` rounding before spelling the calculated 10% contract amount in PQ.

## 31.07.2026

- Fixed translates to `budget.project` by `scheme` fields in ANNUAL_PROCUREMENT_PLAN document type.


## 30.07.2026

- Added `UKTZED` additional classification to ANNUAL_PROCUREMENT_PLAN document type. Rendered as
  `УКТ ЗЕД: <id> — <description>`; the description is taken from the API only (no dictionary lookup) and is printed
  as received, including the trailing `----`.
- Fixed a crash in ANNUAL_PROCUREMENT_PLAN when an additional classification had a label but no resolve rule.

## 29.07.2026

- Added translates to `budget.project` by `scheme` fields in ANNUAL_PROCUREMENT_PLAN document type.

## 01.07.2026

### Fixed

- **Native Node ESM / Vitest resolution.** The published bundle emitted
  extensionless bare subpath imports (`pdfmake/build/pdfmake`, `lodash/get`,
  `lodash/isObject`, `lodash/isNumber`, `lodash/isBoolean`). `pdfmake@0.2.x` and
  `lodash@4` ship no `exports` map, so Node's ESM resolver does not append `.js`
  to such subpaths and threw `ERR_MODULE_NOT_FOUND` under Vitest / plain Node
  (Vite's browser resolver forgave it, so production builds worked). All source
  subpath imports now carry the `.js` extension, so `dist/prozorro-pdf.es.js`
  and `dist/prozorro-pdf.cjs` reference `pdfmake/build/pdfmake.js` and
  `lodash/<fn>.js`. Consumers can drop the `pdfmake` alias + `test.server.deps.inline`
  workaround from their Vite config.

### Added

- `npm run test:smoke` (`scripts/smoke-esm.mjs`) — imports the built package
  under the native Node ESM resolver to guard against this regression. Run it in
  CI after `npm run build:lib`.

## 25.05.2026

- Removed local dictionaries for `ANNOUNCEMENT` type;

## 04.05.2026

- Added `getDataUrl` method to `ProzorroPdfService`. Method return PDF in `blob` format;

## 28.04.2026

- Fix address preview;

## 10.04.2026

- Fix `PQ` DPA type generation;

## 08.04.2026

- Fix `PQ` first generation;

## 01.04.2026

- Added new `EDR_2` document type;
- Updated validation error documentation in `README.md`;

## 24.03.2026

- Update `TENDER_OFFER` for ARMA;

## 19.03.2026

- Fix calculation prices in PQ;
- Fix `value.amount` and `minimalStep.amount` in ANNOUNCEMENT;
- Added `value.amountPercentage` and `minimalStep.amountPercentage` to ANNOUNCEMENT;

## 12.03.2026

- Updated `PURCHASE_CANCELLATION_PROTOCOL` validation rules:
  - Before: Field `document.title` must be `"sign.p7s"`
  - After: Field `document.documentType` must be `"cancellationReport"`.

## 26.02.2026

- Fixed `CONSLUSION` pdf with unvalid sign

## 23.02.2026

- Refactored `ANNOUNCEMENT` subtitles

## 30.01.2026

- Added error handling documentation

## 23.01.2026

- Fixed Announcement Items table

## 22.01.2026

- Fixed `ANNOUNCEMENT` visualization plan's ids

## 10.12.2025

- Fix table width in `DEVIATION_REPORT`

## 08.12.2025

- Updated ANNOUNCEMENT texts

## 05.12.2025

- Updated ANNOUNCEMENT texts

## 20.11.2025

- Fixed Announcement Items table

## 14.11.2025

- Optimized library speed;
- Updated documentation;
- Added `parentFrameId` to `getIframe` method;

## 12.11.2025

- Added DEVIATION_REPORT PDF
- Fix PQ Item Attributes

## 10.11.2025

- Fixed ANNOUNCEMENT securement amount

## 06.11.2025

- Added new Contract template name `NUSH.0001.01` for PQ

## 28.10.2025

- Added `filename` optional field to `open` method;
- Changed the environment mode to `enum` type and values to: `SANDBOX`, `STAGING`, `PRODUCTION`;
- Fix PQ for `SANDBOX` environment;

## 27.10.2025

- Remove ProzorroEds manual dependency from documentation
- Fix bugs in the `Announcement` type

## 24.10.2025

- Removed environment dependency from `-beta` library tag;
- Changed the arguments of `init` method;
