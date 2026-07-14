import { StringConversionHelper } from "@/services/Common/StringConversionHelper";
import { SIGNATURE_FILE_NAME, STRING } from "@/constants/string";
import { PDF_FILED_KEYS } from "@/constants/pdf/pdfFieldKeys";
import { EmptyChecker } from "@/utils/checker/EmptyChecker";
import type { BidType, ReferenceType, UnitType } from "@/types/TenderOffer/Tender";
import { DocumentExtractionService } from "@/services/PDF/document/DocumentExtractionService";

export class EvidenceFormatter {
  private static readonly emptyChecker = new EmptyChecker();

  static formatEvidenceValue(
    dictionary: Record<string, { name: string }>,
    value?: boolean | string | number,
    values?: string[],
    unit?: UnitType
  ): { text: string; style: string }[] {
    let preparedValue = "";
    const formattedUnit: string | undefined = unit?.name || dictionary[unit?.code || STRING.EMPTY]?.name || unit?.code;

    if (value !== undefined) {
      preparedValue = StringConversionHelper.yesNoStringConversion(String(value));
      preparedValue += formattedUnit ? ` (${formattedUnit})` : "";
    }

    if (values?.length) {
      preparedValue = values.join(STRING.DELIMITER.NEW_LINE);
    }

    if (this.emptyChecker.isNotEmptyString(String(preparedValue))) {
      return [
        {
          text: `${preparedValue}${STRING.DELIMITER.DOUBLE_NEWLINE}`,
          style: PDF_FILED_KEYS.TABLE_DATA_BOLD,
        },
      ];
    }

    return [];
  }

  static findEvidenceDocumentTitle(evidenceDocument: ReferenceType, bid: BidType): Record<string, any>[] {
    const { documents, financialDocuments, eligibilityDocuments, qualificationDocuments } = bid;
    const allDocuments = [
      ...(documents ?? []),
      ...(financialDocuments ?? []),
      ...(eligibilityDocuments ?? []),
      ...(qualificationDocuments ?? []),
    ];

    return allDocuments
      .filter(document => document.id === evidenceDocument.id && document.title !== SIGNATURE_FILE_NAME)
      .map(document => ({
        text: DocumentExtractionService.getField(document, "title", STRING.EMPTY),
        link: DocumentExtractionService.getField(document, "url", STRING.EMPTY),
        style: PDF_FILED_KEYS.TABLE_DATA_BLUE,
      }));
  }
}
