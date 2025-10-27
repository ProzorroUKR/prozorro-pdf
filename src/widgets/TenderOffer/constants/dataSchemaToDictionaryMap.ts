import type { DataSchemaType } from "@/types/TenderOffer/Tender";

export const dataSchemaToDictionaryMap = new Map<DataSchemaType | undefined, string>()
  .set("ISO 3166-1 alpha-2", "countries")
  .set("ISO 639-3", "languages");
