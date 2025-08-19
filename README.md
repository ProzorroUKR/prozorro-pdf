# @prozorro/prozorro-pdf

Бібліотека для формування, перегляду та завантаження PDF-документів у Prozorro.  
Працює у зв’язці з бібліотекою електронного підпису [@prozorro/prozorro-eds](https://www.npmjs.com/package/@prozorro/prozorro-eds).

Основні можливості:
- ініціалізація через ProzorroEds;
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

Бібліотека незалежна від конкретного фреймворку — ви можете використовувати її у Vue.js, React, Angular чи будь-якому іншому середовищі.

### Приклад використання (Vue.js + TypeScript)

```vue
<template>
  <div id="signToDocFrameID"></div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { ProzorroEds } from "@prozorro/prozorro-eds";
import {
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
    await ProzorroEds.init({
      debug: true,
    });

    ProzorroPdfService.init(ProzorroEds);

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

### `init(eds: EdsInterface): void`
Ініціалізація та початок роботи з бібліотекою.  
Аргументи:
- `eds: EdsInterface` — екземпляр ProzorroEds.

---

### `setConfig({ url: string, type: string }): Promise<void>`
Встановлює посилання на об’єкт із ЦБД та тип документа.  
Аргументи:
- `url: string` — посилання на об’єкт;
- `type: string` — тип документа (значення з `PROZORRO_PDF_TYPES`).

---

### `open({ title, date?, contractTemplateName?, tender? }): Promise<void>`
Відкриття документа у **новій вкладці браузера**.  
Аргументи:
- `title: string` — назва файлу (наприклад, `"sign.p7s"`);
- `date?: string` — дата модифікації документа;
- `contractTemplateName?: string` — назва шаблону контракту;
- `tender?: string` — посилання на об’єкт тендеру.

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

Бібліотека підтримує різні типи документів через константу `PROZORRO_PDF_TYPES`:
- `TICKET` — запит до ДПС/довідка ДПС
- `CONCLUSION` — висновок про результати моніторингу
- `ANNOUNCEMENT` — оголошення про проведення закупівлі
- `NAZK` — довідка НАЗК
- `PQ` — шаблони договорів
- `COMPLAINT` — скарга до органу оскарження
- `DETERMINING_WINNER_OF_PROCUREMENT` — еПротокол визначення переможця та намір укласти договір
- `TENDER_REJECTION_PROTOCOL` — еПротокол відхилення пропозиції
- `PURCHASE_CANCELLATION_PROTOCOL` — еПротокол відміни закупівлі/лоту
- `ANNUAL_PROCUREMENT_PLAN` — еПротокол затвердження річного плану закупівель
- `PROTOCOL_CONSIDERATION_TENDER_OFFERS` — еПротокол розгляду тендерних пропозицій
- `PROTOCOL_ON_EXTENSION_OF_REVIEW_PERIOD` — еПротокол продовження строку розгляду пропозиції
- `TENDER_OFFER` — еПропозиція
- `EDR` - Довідка ЄДР

---

## Шаблони контрактів

Доступні коди шаблонів (через `PROZORRO_TEMPLATE_CODES`):
- `09130000-9.0001.01` — Нафта і дистиляти (Бензин А-92; Дизельне паливо)
- `03220000-9.0001.01` — Овочі, фрукти та горіхи
- `33600000-6.0001.01` — Фармацевтична продукція
- `33190000-8.0001.01` — Медичні вироби
- `30210000-4.0001.01` — Машини для обробки даних (комп’ютери)
- `00000000-0.0001.01` — інші CPV

---

## Ліцензія

© Prozorro. Усі права захищені.
