# @prozorro/prozorro-pdf

Бібліотека для формування, перегляду та завантаження PDF-документів у Prozorro.  
Працює у зв’язці з бібліотекою електронного підпису [@prozorro/prozorro-eds](https://www.npmjs.com/package/@prozorro/prozorro-eds).

Основні можливості:
- відкриття документа у новій вкладці;
- завантаження документа;
- вставка документа у сторінку у вигляді `iframe`.

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
  <div id="pdfParentFrameID"></div>
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
    }, "pdfParentFrameID");
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

### Type `PdfDocumentConfigType`
Аргументи:
- `title: string` — назва файлу в об'єкті документу (наприклад, `"sign.p7s"`);
- `date?: string` — дата модифікації документа;
- `contractTemplateName?: string` — назва шаблону контракту;
- `tender?: string` — посилання на об’єкт тендеру;
- `fileName?: string` — назва завантажувального файлу.

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

### `open(config: PdfDocumentConfigType): Promise<void>`
Відкриття документа у **новій вкладці браузера**.  
Аргументи:
- `config` - тип PdfDocumentConfigType

---

### `save(config: PdfDocumentConfigType, fileName?: string): Promise<void>`
Завантаження документа.  
Аргументи:
- `config` - тип PdfDocumentConfigType
- `fileName` - назва файлу, за замовчуванням `document.title`

---

### `getIframe(config: PdfDocumentConfigType, parentFrameId?: string): Promise<void>`
Створює **iframe** у контейнері з вказаним ID.  
Аргументи:
- `config` - тип PdfDocumentConfigType
- `parentFrameId` - ID батьківського елементу, в середину якого буде втавлено iframe з ПДФ, за замовчуванням `signToDocFrameID`

---

## Типи документів

| Type                                     | Title                                                         | Description                                                                                                                                                                                                                                                                                              | Fields                                                                                                                                          |
| ---------------------------------------- |---------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------|
| `TICKET`                                 | Запит до ДПС / Довідка ДПС                                    | Get all sign files from `tender.awards[N].documents`.<br>File title must have extensions `*.XML.p7s` or `*.KVT.p7s`.<br>Optional validation by `document.dateModified`.                                                                                                                                  | • **url** – Tender URL *(required, string)*<br>• **title** – Document title *(required, string)*<br>• **date** – Date modified *(date)*         |
| `CONCLUSION`                             | Висновок про результати моніторингу                           | Get all sign files from `monitoring.conclusion[N].documents`.<br>File title must have extension `*.p7s`.<br>Optional validation by `document.dateModified`.<br>If not set → take last document.                                                                                                          | • **url** – Monitoring URL *(required, string)*<br>• **title** – Document title *(required, string)*<br>• **date** – Date modified *(date)*     |
| `NAZK`                                   | Довідка НАЗК                                                  | Get all sign files from `award.documents`.<br>File title must have extension `*.p7s`.<br>`document.title` must be `"napc"`.<br>`document.documentType` must be `"register"`.<br>Take last document.                                                                                                      | • **url** – Award URL *(required, string)*                                                                                                      |
| `ANNOUNCEMENT`                           | Оголошення про проведення закупівлі                           | Get all sign files from `tender.documents`.<br>File title must be `sign.p7s`.<br>Optional validation by `document.dateModified`.<br>If not set → take last document.                                                                                                                                     | • **url** – Tender URL *(required, string)*<br>• **date** – Date modified *(date)*                                                              |
| `PQ`                                     | Шаблони договорів                                             | 2 options:<br>• Empty contract template – field `Contract template name` must be one of [valid codes](https://github.com/ProzorroUKR/standards/blob/master/templates/contract_templates.json).<br>• Filled contract template – use Tender / Contract URL + `Contract template name`.                     | • **url** – Tender URL *(string)*<br>• **contractTemplateName** – Contract template name *(string)*                                             |
| `ANNUAL_PROCUREMENT_PLAN`                | еПротокол затвердження річного плану закупівель               | Get all sign files from `plan.documents`.<br>File title must be `sign.p7s`.<br>Optional validation by `document.dateModified`.<br>If not set → take last document.                                                                                                                                       | • **url** – Plan URL *(required, string)*<br>• **date** – Date modified *(date)*                                                                |
| `TENDER_REJECTION_PROTOCOL`              | еПротокол відхилення пропозиції                               | Get all sign files from `award.documents`.<br>`document.documentType` must be `"notice"`.<br>`award.status` must be `"unsuccessful"` or `"cancelled"`.<br>If `"cancelled"` → `award.eligible` or `award.qualified` must be `false`.<br>Optional validation by `document.dateModified`.                   | • **url** – Award URL *(required, string)*<br>• **date** – Date modified *(date)*                                                               |
| `DETERMINING_WINNER_OF_PROCUREMENT`      | еПротокол визначення переможця та намір укласти договір       | Get all sign files from `award.documents`.<br>`document.documentType` must be `"notice"`.<br>`award.status` must be `"active"` or `"cancelled"`.<br>If `"cancelled"` → `award.qualified` must be `true` and `award.eligible` must be `true/undefined`.<br>Optional validation by `document.dateModified`. | • **url** – Award URL *(required, string)*<br>• **date** – Date modified *(date)*                                                               |
| `PROTOCOL_ON_EXTENSION_OF_REVIEW_PERIOD` | еПротокол продовження строку розгляду пропозиції              | Get all sign files from `award.documents`.<br>`document.documentType` must be `"extensionReport"`.<br>Optional validation by `document.dateModified`.<br>If not set → take last document.                                                                                                                | • **url** – Award URL *(required, string)*<br>• **date** – Date modified *(date)*                                                               |
| `PURCHASE_CANCELLATION_PROTOCOL`         | еПротокол відміни закупівлі/лоту                              | Get all sign files from `cancellation.documents`.<br>`document.documentType` must be `cancellationReport`.<br>Optional validation by `document.dateModified`.<br>If not set → take last document.                                                                                                          | • **url** – Cancellation URL *(required, string)*<br>• **date** – Date modified *(date)*                                                        |
| `PROTOCOL_CONSIDERATION_TENDER_OFFERS`   | еПротокол розгляду тендерних пропозицій                       | `document.documentType` must be `"evaluationReports"`.<br>`document.title` must be `"sign.p7s"`.<br>Optional validation by `document.dateModified`.<br>If not set → take last document.                                                                                                                  | • **url** – Document URL *(required, string)*<br>• **date** – Date modified *(string)*                                                          |
| `TENDER_OFFER`                           | еПропозиція                                                   | Get all sign files from `bid.documents` or `bid.financialDocuments`.<br>`document.documentType` must be `"proposal"`.                                                                                                                                                                                    | • **url** – Bid URL *(required, string)*<br>• **date** – Date modified *(required, string)*                                                     |
| `EDR`                                    | Довідка ЄДР                                                   | Get all sign files from `award.documents` or `qualification.documents`.<br>`document.documentType` must be `"registerExtract"`.<br>Optional file title (default: `edr_identification.yaml`).<br>Optional validation by `document.dateModified`.<br>If not set → take last document.                      | • **url** – Awards / Qualification URL *(required, string)*<br>• **title** – Document title *(string)*<br>• **date** – Date modified *(string)* |
| `EDR_2`                                  | Витяг з ЄДР 2.0                                               | Get YAML files from `award.documents` or `qualification.documents`.<br>`document.documentType` must be `"registerUSR"`.<br>`document.format` must be `"application/yaml"`.<br>Optional validation by `document.title` and `document.dateModified`.<br>If not set → take last matching document.         | • **url** – Awards / Qualification URL *(required, string)*<br>• **title** – Document title *(string)*<br>• **date** – Date modified *(string)* |
| `COMPLAINT`                              | Скарга до органу оскарження                                   | Get all sign files from `complaint.documents`.<br>`document.title` must be `"sign.p7s"`.<br>Newest document is chosen by `dateModified`.                                                                                                                                                                 | • **url** – Complaint URL *(required, string)*<br>• **tender** – Tender URL *(string)*                                                          |
| `COMPLAINT_POST`                         | Запити/пояснення до скарги                                    | Field `complaint.post` mustn’t be empty.                                                                                                                                                                                                                                                                 | • **url** – Complaint URL *(required, string)*<br>• **tender** – Tender URL *(string)*                                                          |
| `DEVIATION_REPORT`                       | Протокол рішення УО щодо виявлення невідповідностей (24 год)  | Get all sign files from `award.documents` or `qualification.documents`.<br>`document.documentType` must be `"deviationReport"`.<br>Optional validation by `document.dateModified`.<br>If not set → take last document.                                                                                   | • **url** – Awards / Qualification URL *(required, string)*<br>• **date** – Date modified *(string)*                                            |

---

## Обробка помилок

Бібліотека використовує уніфіковану систему обробки помилок, яка повертає екземпляри `IPrzorroPdfErrorExceptionCore` для всіх випадків помилок. Це забезпечує послідовну обробку помилок і надає детальну інформацію про помилки.

### Структура помилки
Кожен об’єкт помилки реалізує інтерфейс `IPrzorroPdfErrorExceptionCore` і містить:
- `code`: Ідентифікатор типів помилок (`PROZORRO_PDF_ERROR_CODES` enum)
- `details`: Містить розширену інформацію про помилку (`ErrorDetailsModel`)
- `timestamp`: Час створення помилки
- `logWithTrace()`: Метод для реєстрації помилок з трасуванням

### Типи помилок (`PROZORRO_PDF_ERROR_CODES`)

| Код | Опис | Можливі причини | Рекомендовані дії |
| :--- | :--- | :--- | :--- |
| **INVALID_SIGNATURE** | Помилка електронного підпису | Підпис пошкоджений, некоректний формат, підпис не відповідає даним | Перевірити цілісність підпису, повторно підписати |
| **INVALID_PARAMS** | Некоректні вхідні дані | Неповні дані, некоректний формат параметрів, відсутні URL | Валідувати дані перед передачею в бібліотеку |
| **VALIDATION_FAILED** | Помилка бізнес-логіки | Відсутні дані в об'єкті (наприклад, awards, conclusion), невідповідність статусів | Перевірити наявність всіх необхідних даних у ЦБД |
| **PDF_GENERATION_FAILED** | Помилка генерації PDF | Внутрішня помилка генератора PDF Make | Звернутись до технічної підтримки |
| **SERVICE_UNAVAILABLE** | Сервіс недоступний | Внутрішні помилки сервісу, неможливо визначити стратегію | Звернутись до технічної підтримки |

### Детальні повідомлення про помилки

| Тип помилки | Ключ повідомлення             | Повідомлення | Контекст валідації |
| :--- |:------------------------------| :--- | :--- |
| **INVALID_SIGNATURE** | `documentAccess`              | Не вдалося отримати доступ до файлу підпису | Помилка при спробі завантажити файл підпису за посиланням |
| | `documentEncoding`            | Не вдалося розшифрувати файл підпису | Помилка при спробі декодувати контент файлу (p7s) |
| **INVALID_PARAMS** | `incorrectInputFormat`        | Неправильний формат вхідних даних | Передані типи даних не відповідають очікуваним |
| | `undefinedUrl`                | Відсутнє посилання на об'єкт ЦБД | Обов'язкове поле `url` у `setConfig` не передано |
| | `undefinedTitle`              | Відсутній параметр "Document title" | Обов'язкове поле `title` (для деяких типів) не передано |
| | `undefinedDate`               | Відсутній параметр "Date modified" | Обов'язкове поле `date` (для деяких типів) не передано |
| **VALIDATION_FAILED** | `undefinedObject`             | Дані об'єкта ЦБД відсутні | Завантажений JSON об'єкт пустий або некоректний |
| | `undefinedAwards`             | Відсутнє поле "awards" об'єкта з ЦБД | У завантажених даних тендеру відсутній масив `awards` |
| | `undefinedStatus`             | Відсутнє поле "status" об'єкта "award" | У об'єкті нагороди відсутній статус |
| | `undefinedConclusion`         | Відсутнє поле "conclusion" об'єкта з ЦБД | У даних моніторингу відсутній розділ `conclusion` |
| | `undefinedConclusionOfDocs`   | Відсутнє поле "document" в об'єкті "conclusion" | У висновку моніторингу відсутні посилання на документи |
| | `undefinedDocumentTitle`      | Не вдалося знайти ім'я документу в об'єкті | Не знайдено документа з відповідним заголовком у списку |
| | `wrongDocumentType`           | Не вдалося визначити тип документу | Документи в списку не відповідають очікуваному `documentType` |
| | `signersObjectUnavailable`    | Виникла помилка при формуванні колонтитулу з підписом | Не вдалося отримати інформацію про підписувачів з файлу |
| | `documentListUndefined`       | Відсутній список документів для отримання посилання файлу підпису | Поле `documents` в об'єкті відсутнє або пусте |
| | `wrongDocumentTypeStatus`     | Неправильний тип документу | Тип документа не відповідає вимогам обраного шаблону PDF |
| | `wrongDocumentFormat`         | Неправильний формат документу | Формат документа не відповідає вимогам обраного шаблону PDF |
| | `wrongDocumentTitle`          | Неправильний заголовок документу | Заголовок документа не відповідає очікуваному (наприклад, не "sign.p7s") |
| | `wrongURL`                    | Неправильне посилання на документ | У списку документів відсутнє або некоректне поле `url` |
| | `tenderLoader`                | Виникла помилка при завантаженні документу закупівлі. Не передано "config.tender" | Для деяких типів (наприклад, `COMPLAINT`) потрібно посилання на тендер |
| | `undefinedCancellationStatus` | Статус відміни закупівлі відсутній | У об'єкті `cancellation` відсутнє поле `status` |
| | `awardStatusNotFind`          | Статус в "award" не відповідає заданим умовам | Статус нагороди не є допустимим для генерації обраного PDF |
| | `wrongDocumentDate`           | Неправильна дата документу (dateModified не відповідає переданій даті) | `dateModified` документа не збігається з переданою датою |
| | `wrongQualified`              | Поле "qualified" не "true" | Бізнес-перевірка: учасник має бути кваліфікований |
| | `wrongEligible`               | Поле "eligible" не "true" | Бізнес-перевірка: учасник має відповідати вимогам |
| | `wrongEligibleOrQualified`    | Поле "eligible" або "qualified" не "false" | Перевірка для еПротоколу відхилення |
| | `awardNotFound`               | Відсутня інформація про закупівлю та переможця в файлі підпису | Дані всередині підпису не містять потрібної інформації про закупівлю та переможця |
| | `suppliersIsNotDefined`       | Відсутня інформація про постачальників | Поле `suppliers` відсутнє в об'єкті `award`/`bid` |
| | `cancellationNotFound`        | Відсутня інформація про закупівлю та/або відміну закупівлі/лоту в файлі підпису | У файлі підпису відсутні дані про закупівлю або скасування закупівлі/лоту |
| | `participantsIsNotDefined`    | Відсутня інформація про учасників | Поле `participants` відсутнє в даних |
| | `tenderersIsNotDefined`       | Відсутня інформація про учасника в даних пропозиції | Поле `tenderers` відсутнє в даних пропозиції |
| | `wrongEdrDocumentType`        | Поле "documentType" не "registerExtract" | Перевірка типу документа для ЄДР |
| | `wrongEdr2DocumentType`       | Поле "documentType" не "registerUSR" | Перевірка типу документа для `EDR_2` |
| | `wrongEdrFile`                | На жаль, за вказаним кодом нічого не знайдено | Помилка пошуку в даних ЄДР |
| | `undefinedPosts`              | В скарзі відсутні не пусті об'єкти objections:posts. | У даних скарги відсутні деталі заперечень |
| | `encodingOrError`             | Невірний формат вхідних даних або не валідний підпис | Структура даних не відповідає валідаціям або вказано не підтримуване кодування файлу |
| **SERVICE_UNAVAILABLE** | `typeIsNotDefined`            | Неможливо отримати стратегію обробки типів | Передано невідомий `PROZORRO_PDF_TYPES` |
| | `loaderTypeIsNotDefined`      | Не вдається отримати стратегію типу завантажувача pdf | Внутрішня помилка вибору стратегії завантаження даних |

### Приклад обробки помилок

```typescript
import { IPrzorroPdfErrorExceptionCore, PROZORRO_PDF_ERROR_CODES } from "@prozorro/prozorro-pdf";

try {
  await ProzorroPdfService.setConfig({
    url: '/tender-url',
    type: PROZORRO_PDF_TYPES.TICKET
  });
  await ProzorroPdfService.open({ title: 'document.xml.p7s' });
} catch (error) {
  const pdfError = error as IPrzorroPdfErrorExceptionCore;
  
  switch (pdfError.code) {
    case PROZORRO_PDF_ERROR_CODES.INVALID_PARAMS:
      console.error("Перевірте вхідні параметри:", pdfError.details.message);
      break;
    case PROZORRO_PDF_ERROR_CODES.VALIDATION_FAILED:
      console.error("Помилка валідації даних:", pdfError.details.message);
      break;
    default:
      console.error("Виникла помилка:", pdfError.details.message);
  }
}
```

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
- **14.11.2025**
  - Optimized library speed;
  - Updated documentation;
  - Added `parentFrameId` to `getIframe` method;
- **20.11.2025**
  - Fixed Announcement Items table
- **05.12.2025**
  - Updated ANNOUNCEMENT texts
- **08.12.2025**
  - Updated ANNOUNCEMENT texts
- **10.12.2025**
  - Fix table width in `DEVIATION_REPORT`
- **22.01.2026**
  - Fixed `ANNOUNCEMENT` visualization plan's ids
- **23.01.2026**
  - Fixed Announcement Items table
- **30.01.2026**
  - Added error handling documentation
- **23.02.2026**
  - Refactored `ANNOUNCEMENT` subtitles
- **26.02.2026**
  - Fixed `CONSLUSION` pdf with unvalid sign
- **12.03.2026**
  - Updated `PURCHASE_CANCELLATION_PROTOCOL` validation rules:
    - Before: Field `document.title` must be `"sign.p7s"`
    - After: Field `document.documentType` must be `"cancellationReport"`.
- **19.03.2026**
  - Fix calculation prices in PQ;
  - Fix `value.amount` and `minimalStep.amount` in ANNOUNCEMENT;
  - Added `value.amountPercentage` and `minimalStep.amountPercentage` to ANNOUNCEMENT;
- **24.03.2026**
  - Update `TENDER_OFFER` for ARMA;
- **01.04.2026**
  - Added new `EDR_2` document type;
  - Updated validation error documentation in `README.md`;
- **08.04.2026**
- Fix `PQ` first generation;
- **10.04.2026**
- Fix `PQ` DPA type generation;

---

## Ліцензія

© Prozorro. Усі права захищені.
