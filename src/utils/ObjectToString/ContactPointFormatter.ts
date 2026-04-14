import type { ContactPointType } from "@/types/Tender/ContactPointType";
import { DocumentExtractionService } from "@/services/PDF/document/DocumentExtractionService";
import type { Edr2ContactsType } from "@/types/Edr/Edr2Type.ts";

export enum CONTRACT_POINT_TYPE {
  NTFEU = "name_telephone_faxNumber_email_url",
  NTE = "name_telephone_email",
  ETE = "name_en_telephone_email",
  ETFWA = "email_tel_fax_web_page_anotherInfo",
}

export type FormatConfig = {
  separator: string;
  type: CONTRACT_POINT_TYPE;
};

export class ContactPointFormatter {
  public static contactPointParts = new Map<string, string[]>()
    .set(CONTRACT_POINT_TYPE.NTFEU, ["name", "telephone", "faxNumber", "email", "url"])
    .set(CONTRACT_POINT_TYPE.NTE, ["name", "telephone", "email"])
    .set(CONTRACT_POINT_TYPE.ETE, ["name_en", "telephone", "email"])
    .set(CONTRACT_POINT_TYPE.ETFWA, ["email", "tel", "fax", "web_page", "anotherInfo"]);

  public static format(contactPoint: ContactPointType | Edr2ContactsType, { separator, type }: FormatConfig): string {
    return (this.contactPointParts.get(type) || [])
      .map(path => DocumentExtractionService.getField<string>(contactPoint, path))
      .map(value => (Array.isArray(value) ? value.join(separator) : value))
      .filter(Boolean)
      .join(separator);
  }
}
