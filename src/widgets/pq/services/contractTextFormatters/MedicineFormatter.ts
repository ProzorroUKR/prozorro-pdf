import { PROZORRO_TEMPLATE_CODES } from "@/widgets/pq/types/TemplateCodes.enum";
import { DocumentExtractionService } from "@/services/PDF/document/DocumentExtractionService";
import { PDF_FILED_KEYS } from "@/constants/pdf/pdfFieldKeys";
import { PQ_SPECIFICATION_HEADING_MARGIN, PQ_TESTING_GROUNDS_MARGIN } from "@/widgets/pq/configs/margins";
import { labAnalysisTexts, testingGroundsTexts } from "@/widgets/pq/templates/medicine/configs/medicineContract.config";

export class MedicineFormatter {
  static createMedAddition(contractTemplate: string): Record<string, any>[] {
    const text = contractTemplate === PROZORRO_TEMPLATE_CODES.MEDICINE ? testingGroundsTexts : labAnalysisTexts;
    return [
      {
        text: DocumentExtractionService.getField(text, "addition2"),
        style: PDF_FILED_KEYS.SPECIFICATION_HEADING,
        pageBreak: "before",
      },
      {
        text: DocumentExtractionService.getField(text, "toContract"),
        style: PDF_FILED_KEYS.SPECIFICATION_HEADING,
      },
      {
        text: DocumentExtractionService.getField(text, "from"),
        style: PDF_FILED_KEYS.SPECIFICATION_HEADING,
      },
      {
        text: DocumentExtractionService.getField(text, "list"),
        style: PDF_FILED_KEYS.HEADING,
        margin: PQ_SPECIFICATION_HEADING_MARGIN,
      },
      {
        type: "none",
        margin: PQ_TESTING_GROUNDS_MARGIN,
        ol: text.groundsList,
      },
    ];
  }
}
