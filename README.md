# @prozorro/prozorro-pdf

Бібліотека для формування, перегляду та завантаження PDF-документів у Prozorro.  
Працює у зв’язці з бібліотекою електронного підпису [@prozorro/prozorro-eds](https://www.npmjs.com/package/@prozorro/prozorro-eds).

Основні можливості:
- відкриття документа у новій вкладці;
- завантаження документа;
- вставка документа у сторінку у вигляді `iframe`;

---

## Встановлення

```bash
npm i @prozorro/prozorro-pdf
```

### або

```bash
yarn add @prozorro/prozorro-pdf
```

---

## Швидкий старт

Бібліотека незалежна від конкретного фреймворку — ви можете використовувати її у Vue.js, React, Angular чи будь-яким іншим середовищем.

### Приклад використання (Vue.js + TypeScript)

```vue
<template>
  <div id="signToDocFrameID"></div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import {
  ENVIRONMENT_MODE,
  PROZORRO_PDF_TYPES,
  ProzorroPdfService,
  IPrzorroPdfErrorExceptionCore,
  PROZORRO_TEMPLATE_CODES,
} from "@prozorro/prozorro-pdf";

const route = useRoute();
const pdfError = ref<IPrzorroPdfErrorExceptionCore | null>(null);

onMounted(async () => {
  const { params: { type }, query: { dateModified, url, tenderUrl, contractTemplateName, title } } = route;

  try {
    ProzorroPdfService.init(ENVIRONMENT_MODE.SANDBOX);

    await ProzorroPdfService.setConfig({
      type: type as PROZORRO_PDF_TYPES,
      url,
    });

    await ProzorroPdfService.getIframe({
      tender: tenderUrl,
      title: title ?? "sign.p7s",
      date: dateModified,
      contractTemplateName: contractTemplateName as PROZORRO_TEMPLATE_CODES,
    });
  } catch (error) {
    pdfError.value = error as IPrzorroPdfErrorExceptionCore;
  }
});
</script>

<style scoped lang="scss">
#signToDocFrameID {
  width: 100%;
  height: 100vh;
}
</style>
```

---

## API

### `init(environment: ENVIRONMENT_MODE): void`
Ініціалізація та початок роботи з бібліотекою.  
Аргументи:
- `environment: ENVIRONMENT_MODE` — тип середовища "SANDBOX", "STAGING" або "PRODUCTION"

---

### `setConfig({ url: string, type: string }): Promise<void>`
Встановлює посилання на об’єкт із ЦБД та тип документа.  
Аргументи:
- `url: string` — посилання на об’єкт;
- `type: string` — тип документа (значення з `PROZORRO_PDF_TYPES`).

---

### `open({ title, date?, contractTemplateName?, tender? }, fileName?: string): Promise<void>`
Відкриття документа у **новій вкладці браузера**.  
Аргументи:
- `title: string` — назва файлу в об'єкті документу (наприклад, `"sign.p7s"`);
- `date?: string` — дата модифікації документа;
- `contractTemplateName?: string` — назва шаблону контракту;
- `tender?: string` — посилання на об’єкт тендеру;
- `fileName?: string` — назва завантажувального файлу.

---

### `save({ title, date?, contractTemplateName?, tender? }): Promise<void>`
Завантаження документа.  
Аргументи аналогічні до `open(...)`.

---

### `getIframe({ title, date?, contractTemplateName?, tender? }): Promise<void>`
Створює **iframe** у контейнері з `id="signToDocFrameID"`.  
Аргументи аналогічні до `open(...)`.

---

## Типи документів

| Type                                     | Title                                                         | Description                                                                                                                                                                                                                                                                                               | Fields                                                                                                                                          |
| ---------------------------------------- |---------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------|
| `TICKET`                                 | Запит до ДПС / Довідка ДПС                                    | Get all sign files from `tender.awards[N].documents`.<br>File title must have extensions `*.XML.p7s` or `*.KVT.p7s`.<br>Optional validation by `document.dateModified`.                                                                                                                                   | • **url** – Tender URL *(required, string)*<br>• **title** – Document title *(required, string)*<br>• **date** – Date modified *(date)*         |
| `CONCLUSION`                             | Висновок про результати моніторингу                           | Get all sign files from `monitoring.conclusion[N].documents`.<br>File title must have extension `*.p7s`.<br>Optional validation by `document.dateModified`.<br>If not set → take last document.                                                                                                           | • **url** – Monitoring URL *(required, string)*<br>• **title** – Document title *(required, string)*<br>• **date** – Date modified *(date)*     |
| `NAZK`                                   | Довідка НАЗК                                                  | Get all sign files from `award.documents`.<br>File title must have extension `*.p7s`.<br>`document.title` must be `"napc"`.<br>`document.documentType` must be `"register"`.<br>Take last document.                                                                                                       | • **url** – Award URL *(required, string)*                                                                                                      |
| `ANNOUNCEMENT`                           | Оголошення про проведення закупівлі                           | Get all sign files from `tender.documents`.<br>File title must be `sign.p7s`.<br>Optional validation by `document.dateModified`.<br>If not set → take last document.                                                                                                                                      | • **url** – Tender URL *(required, string)*<br>• **date** – Date modified *(date)*                                                              |
| `PQ`                                     | Шаблони договорів                                             | 2 options:<br>• Empty contract template – field `Contract template name` must be one of [valid codes](https://github.com/ProzorroUKR/standards/blob/master/templates/contract_templates.json).<br>• Filled contract template – use Tender / Contract URL + `Contract template name`.                      | • **url** – Tender URL *(string)*<br>• **contractTemplateName** – Contract template name *(string)*                                             |
| `ANNUAL_PROCUREMENT_PLAN`                | еПротокол затвердження річного плану закупівель               | Get all sign files from `plan.documents`.<br>File title must be `sign.p7s`.<br>Optional validation by `document.dateModified`.<br>If not set → take last document.                                                                                                                                        | • **url** – Plan URL *(required, string)*<br>• **date** – Date modified *(date)*                                                                |
| `TENDER_REJECTION_PROTOCOL`              | еПротокол відхилення пропозиції                               | Get all sign files from `award.documents`.<br>`document.documentType` must be `"notice"`.<br>`award.status` must be `"unsuccessful"` or `"cancelled"`.<br>If `"cancelled"` → `award.eligible` or `award.qualified` must be `false`.<br>Optional validation by `document.dateModified`.                    | • **url** – Award URL *(required, string)*<br>• **date** – Date modified *(date)*                                                               |
| `DETERMINING_WINNER_OF_PROCUREMENT`      | еПротокол визначення переможця та намір укласти договір       | Get all sign files from `award.documents`.<br>`document.documentType` must be `"notice"`.<br>`award.status` must be `"active"` or `"cancelled"`.<br>If `"cancelled"` → `award.qualified` must be `true` and `award.eligible` must be `true/undefined`.<br>Optional validation by `document.dateModified`. | • **url** – Award URL *(required, string)*<br>• **date** – Date modified *(date)*                                                               |
| `PROTOCOL_ON_EXTENSION_OF_REVIEW_PERIOD` | еПротокол продовження строку розгляду пропозиції              | Get all sign files from `award.documents`.<br>`document.documentType` must be `"extensionReport"`.<br>Optional validation by `document.dateModified`.<br>If not set → take last document.                                                                                                                 | • **url** – Award URL *(required, string)*<br>• **date** – Date modified *(date)*                                                               |
| `PURCHASE_CANCELLATION_PROTOCOL`         | еПротокол відміни закупівлі/лоту                              | Get all sign files from `cancellation.documents`.<br>`document.title` must be `"sign.p7s"`.<br>Optional validation by `document.dateModified`.<br>If not set → take last document.                                                                                                                        | • **url** – Cancellation URL *(required, string)*<br>• **date** – Date modified *(date)*                                                        |
| `PROTOCOL_CONSIDERATION_TENDER_OFFERS`   | еПротокол розгляду тендерних пропозицій                       | `document.documentType` must be `"evaluationReports"`.<br>`document.title` must be `"sign.p7s"`.<br>Optional validation by `document.dateModified`.<br>If not set → take last document.                                                                                                                   | • **url** – Document URL *(required, string)*<br>• **date** – Date modified *(string)*                                                          |
| `TENDER_OFFER`                           | еПропозиція                                                   | Get all sign files from `bid.documents` or `bid.financialDocuments`.<br>`document.documentType` must be `"proposal"`.                                                                                                                                                                                     | • **url** – Bid URL *(required, string)*<br>• **date** – Date modified *(required, string)*                                                     |
| `EDR`                                    | Довідка ЄДР                                                   | Get all sign files from `award.documents` or `qualification.documents`.<br>`document.documentType` must be `"registerExtract"`.<br>Optional file title (default: `edr_identification.yaml`).<br>Optional validation by `document.dateModified`.<br>If not set → take last document.                       | • **url** – Awards / Qualification URL *(required, string)*<br>• **title** – Document title *(string)*<br>• **date** – Date modified *(string)* |
| `COMPLAINT`                              | Скарга до органу оскарження                                   | Get all sign files from `complaint.documents`.<br>`document.title` must be `"sign.p7s"`.<br>Newest document is chosen by `dateModified`.                                                                                                                                                                  | • **url** – Complaint URL *(required, string)*<br>• **tender** – Tender URL *(string)*                                                          |
| `COMPLAINT_POST`                         | Запити/пояснення до скарги                                    | Field `complaint.post` mustn’t be empty.                                                                                                                                                                                                                                                                  | • **url** – Complaint URL *(required, string)*<br>• **tender** – Tender URL *(string)*                                                          |
| `DEVIATION_REPORT`                       | Протокол рішення УО щодо виявлення невідповідностей (24 год)  | Get all sign files from `award.documents` or `qualification.documents`.<br>`document.documentType` must be `"deviationReport"`.<br>Optional validation by `document.dateModified`.<br>If not set → take last document.                                                                                    | • **url** – Awards / Qualification URL *(required, string)*<br>• **date** – Date modified *(string)*                                            |

---

## Release notes

- **24.10.2025**
    - Removed environment dependency from `-beta` library tag;
    - Changed the arguments of `init` method;
- **27.10.2025**
    - Remove ProzorroEds manual dependency from documentation
    - Fix bugs in the `Announcement` type
- **28.10.2025**
  - Added `filename` optional field to `open` method; 
  - Changed the environment mode to `enum` type and values to: `SANDBOX`, `STAGING`, `PRODUCTION`;
  - Fix PQ for `SANDBOX` environment;
- **06.11.2025**
  - Added new Contract template name `NUSH.0001.01` for PQ
- **10.11.2025**
  - Fixed ANNOUNCEMENT securement amount
- **12.11.2025**
  - Added DEVIATION_REPORT PDF
  - Fix PQ Item Attributes

---

## Ліцензія

© Prozorro. Усі права захищені.

