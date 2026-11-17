import { describe, it, expect } from "vitest";
import { TerminationReportMaker } from "@/modules/termination-report/document/TerminationReportMaker";
import { TERMINATION_REPORT_TEXT } from "@/modules/termination-report/config/texts";
import type { TerminationReportFile } from "@/modules/termination-report/types";

const dictionaries = new Map<string, Record<string, any>>([
  [
    "organisation",
    { special: { title: "Юридична особа, яка забезпечує потреби держави або територіальної громади (ЦЗО)" } },
  ],
  ["tender_main_procurement_category", { services: { name: "Послуги" } }],
  ["recommended", { KGM: { name: "кілограм" }, MON: { name: "місяць" } }],
  ["countries", { UA: { name: "Україна" } }],
]);

const file = {
  terminationDetails: {
    reasonType: "disrupted",
    reason: "Перший рядок\\nДругий рядок",
    amountPaid: { amount: 500, currency: "UAH", amountNet: 400, valueAddedTaxIncluded: true },
  },
  contract: {
    contractID: "UA-2026-05-15-000135-a-a4",
    tenderID: "UA-2026-05-15-000135-a",
    mainProcurementCategory: "services",
    period: { startDate: "2026-05-15T15:05:22.184935+03:00", endDate: "2026-05-15T15:10:37.015797+03:00" },
    value: { amount: 1660.208333, currency: "UAH", amountNet: 1500, valueAddedTaxIncluded: true },
    buyer: {
      name: "Тестовий заклад #1 м.Київ",
      kind: "special",
      identifier: { scheme: "UA-EDR", id: "21725150", legalName: "Тестовий заклад" },
      address: {
        streetAddress: "вул. Тестова 22",
        locality: "м. Київ",
        region: "м. Київ",
        postalCode: "42000",
        countryName: "Україна",
      },
    },
    suppliers: [
      {
        name: "Тестове підприємство",
        identifier: { scheme: "UA-EDR", id: "00137255" },
        address: {
          streetAddress: "вул. Тестова, 33",
          locality: "м. Київ",
          postalCode: "21100",
          countryName: "Україна",
        },
        signerInfo: { telephone: "+380950000000" },
      },
    ],
    items: [
      {
        id: "item-1",
        description: "Тестова назва предмета закупівлі-1",
        product: "prod-123",
        quantity: 1,
        classification: { description: "Промислова техніка", scheme: "ДК021", id: "42000000-6" },
        additionalClassifications: [{ scheme: "ДКПП", id: "28.23.23", description: "Техніка конторська/офісна, інша" }],
        unit: { name: "кг", code: "KGM" },
        deliveryAddress: { streetAddress: "вул. Тестова 1", locality: "м. Київ", countryName: "Україна" },
        deliveryDate: { startDate: "2017-07-11T16:02:36+03:00", endDate: "2017-08-10T16:02:36+03:00" },
        attributes: [
          { name: "Ступінь локалізації", value: 31.4, unit: { code: "KGM" } },
          { name: "Країна походження", values: ["UA"], dataSchema: "ISO 3166-1 alpha-2" },
          { name: "Гарантія", value: true },
          { name: "Період", value: 0, unit: { code: "MON" } },
        ],
      },
    ],
  },
} as TerminationReportFile;

const flatten = (node: any, acc: string[] = []): string[] => {
  if (typeof node === "string") {
    acc.push(node);
  } else if (Array.isArray(node)) {
    node.forEach(child => flatten(child, acc));
  } else if (node && typeof node === "object") {
    Object.values(node).forEach(child => flatten(child, acc));
  }
  return acc;
};

describe("TerminationReportMaker", () => {
  const maker = new TerminationReportMaker({ defaultQrLink: "qr" } as any);
  const content = maker.create(file, { title: "t" } as any, [], dictionaries);
  const texts = flatten(content);

  it("renders the heading and report number", () => {
    expect(texts).toContain(TERMINATION_REPORT_TEXT.title);
    expect(texts.some(text => text.includes("UA-2026-05-15-000135-a-a4"))).toBe(true);
  });

  it("formats the contract price with the VAT clause", () => {
    expect(texts.some(text => text.includes("660,208333 UAH") && text.includes("в тому числі ПДВ"))).toBe(true);
  });

  it("resolves dictionary values for kind and procurement category", () => {
    expect(texts.some(text => text.includes("ЦЗО"))).toBe(true);
    expect(texts).toContain("Послуги");
  });

  it("renders item quantity with unit and the product link on the item name", () => {
    expect(texts).toContain("1 кг");
    const links: string[] = [];
    const collectLinks = (node: any): void => {
      if (Array.isArray(node)) {
        node.forEach(collectLinks);
      } else if (node && typeof node === "object") {
        if (node.link) links.push(node.link);
        Object.values(node).forEach(collectLinks);
      }
    };
    collectLinks(content);
    expect(links).toContain("https://prozorro.gov.ua/uk/product/prod-123");
  });

  it("separates the main and additional classifications with a blank line", () => {
    expect(texts.some(text => text.includes("42000000-6") && text.includes("28.23.23") && text.includes("\n\n"))).toBe(
      true
    );
  });

  it("translates attribute values (country, boolean) and keeps numeric 0", () => {
    expect(texts.some(text => text.includes("Україна"))).toBe(true);
    expect(texts).toContain("Так");
    expect(texts).toContain("0 місяць");
  });

  it("renders the termination reason only for disrupted, with newlines decoded", () => {
    expect(texts.some(text => text.includes("Перший рядок\nДругий рядок"))).toBe(true);
  });

  it("renders the amount paid", () => {
    expect(texts.some(text => text.includes("500,00 UAH") && text.includes("в тому числі ПДВ 100,00 UAH"))).toBe(true);
  });
});
