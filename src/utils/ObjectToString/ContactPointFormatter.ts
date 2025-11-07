import { STRING } from "@/constants/string";
import type { ContactPointType } from "@/types/Tender/ContactPointType";
import { DocumentExtractionService } from "@/services/PDF/document/DocumentExtractionService";

export enum CONTRACT_POINT_TYPE {
  NTFEU = "name_telephone_faxNumber_email_url",
  NTE = "name_telephone_email",
  ETE = "name_en_telephone_email",
}

export type FormatConfig = {
  separator: typeof STRING.COMMA | typeof STRING.DELIMITER.NEW_LINE;
  type: CONTRACT_POINT_TYPE;
};

export class ContactPointFormatter {
  public static contactPointParts = new Map<string, string[]>()
    .set(CONTRACT_POINT_TYPE.NTFEU, ["name", "telephone", "faxNumber", "email", "url"])
    .set(CONTRACT_POINT_TYPE.NTE, ["name", "telephone", "email"])
    .set(CONTRACT_POINT_TYPE.ETE, ["name_en", "telephone", "email"]);

  public static format(contactPoint: ContactPointType, { separator, type }: FormatConfig): string {
    const parts = this.contactPointParts.get(type) || [];

    return parts.reduce((result, item): string => {
      const value = DocumentExtractionService.getField<string>(contactPoint, item);

      if (result && value) {
        return `${result}${separator} ${value}`;
      }
      return value ? value : result;
    }, "");
  }
}
