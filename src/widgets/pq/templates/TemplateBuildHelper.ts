import { AllVersionFormatter } from "@/widgets/pq/services/contractTextFormatters/AllVersionFormatter";
import type { PQContractType } from "@/widgets/pq/types/PQTypes";
import { FirstVersionFormatter } from "@/widgets/pq/services/contractTextFormatters/FirstVersionFormatter";
import { PQFormattingService } from "@/widgets/pq/services/Formating/PQFormattingService";
import { MedicineFormatter } from "@/widgets/pq/services/contractTextFormatters/MedicineFormatter";
import { PROZORRO_TEMPLATE_CODES } from "@/widgets/pq/types/TemplateCodes.enum";
import { SecondVersionFormatter } from "@/widgets/pq/services/contractTextFormatters/SecondVersionFormatter";
import { NushFormatter } from "@/widgets/pq/services/contractTextFormatters/NushFormatter.ts";
import { pqNushTexts } from "@/widgets/pq/templates/nush/configs/pqNushTexts.ts";
import { PDF_FILED_KEYS } from "@/constants/pdf/pdfFieldKeys.ts";
import { PQ_LIST_HEADING_MARGIN } from "@/widgets/pq/configs/margins.ts";

export class TemplateBuildHelper {
  static pharmBuild(
    contractObject: PQContractType | Record<string, never>,
    contractTemplate: PROZORRO_TEMPLATE_CODES
  ): Record<string, any>[] {
    return [
      AllVersionFormatter.createTitle(contractObject as PQContractType, contractTemplate),
      FirstVersionFormatter.createBasicHeader(contractObject as PQContractType, contractTemplate),
      AllVersionFormatter.createContractText(contractObject, contractTemplate, {}),
      PQFormattingService.getLocationTitle(contractTemplate),
      FirstVersionFormatter.createSignature(contractObject, contractTemplate),
      FirstVersionFormatter.createAddition(contractObject, contractTemplate),
      FirstVersionFormatter.createSignature(contractObject, contractTemplate),
      MedicineFormatter.createMedAddition(contractTemplate),
      FirstVersionFormatter.createSignature(contractObject, contractTemplate),
    ];
  }

  static fruitBuilder(
    contractObject: PQContractType | Record<string, never>,
    contractTemplate: PROZORRO_TEMPLATE_CODES
  ): Record<string, any>[] {
    return [
      AllVersionFormatter.createTitle(contractObject as PQContractType, contractTemplate),
      FirstVersionFormatter.createBasicHeader(contractObject as PQContractType, contractTemplate),
      AllVersionFormatter.createContractText(contractObject, contractTemplate, {}),
      PQFormattingService.getLocationTitle(contractTemplate),
      FirstVersionFormatter.createSignature(contractObject, contractTemplate),
      FirstVersionFormatter.createAddition(contractObject, contractTemplate),
      FirstVersionFormatter.createSignature(contractObject, contractTemplate),
    ];
  }

  static fruit2Builder(
    contractObject: PQContractType | Record<string, never>,
    contractTemplate: PROZORRO_TEMPLATE_CODES,
    tender: any
  ): Record<string, any>[] {
    return [
      AllVersionFormatter.createTitle(contractObject as PQContractType, contractTemplate),
      FirstVersionFormatter.createBasicHeader(contractObject as PQContractType, contractTemplate),
      AllVersionFormatter.createContractText(contractObject, contractTemplate, tender),
      PQFormattingService.getLocationTitle(contractTemplate),
      FirstVersionFormatter.createSignature(contractObject, contractTemplate),
      SecondVersionFormatter.createGenericAddition1(contractObject, contractTemplate),
      SecondVersionFormatter.createGenericAddition2(contractObject, contractTemplate, tender),
    ];
  }

  static foodBuilder(
    contractObject: PQContractType | Record<string, never>,
    contractTemplate: PROZORRO_TEMPLATE_CODES,
    tender: any
  ): Record<string, any>[] {
    return [
      AllVersionFormatter.createTitle(contractObject as PQContractType, contractTemplate),
      SecondVersionFormatter.createGenericHeader(contractObject as PQContractType, tender),
      AllVersionFormatter.createContractText(contractObject, contractTemplate, tender),
      SecondVersionFormatter.createGenericAddition1(contractObject, contractTemplate),
      SecondVersionFormatter.createGenericAddition2(contractObject, contractTemplate, tender),
    ];
  }

  static nushBuilder(
    contractObject: PQContractType | Record<string, never>,
    contractTemplate: PROZORRO_TEMPLATE_CODES,
    tender: any
  ): Record<string, any>[] {
    return [
      AllVersionFormatter.createTitle(contractObject as PQContractType, contractTemplate),
      NushFormatter.createHeader(contractObject as PQContractType, tender),
      AllVersionFormatter.createContractText(contractObject, contractTemplate, tender),
      [
        PQFormattingService.createUnitHeader(
          pqNushTexts.contactTitle,
          16,
          PDF_FILED_KEYS.HEADING,
          PQ_LIST_HEADING_MARGIN
        ),
        SecondVersionFormatter.createContactsTable(contractObject),
        SecondVersionFormatter.createSignatureBlock(contractObject),
      ],
      [
        SecondVersionFormatter.createGenericAddition1(contractObject, contractTemplate),
        SecondVersionFormatter.createContactsTable(contractObject),
        SecondVersionFormatter.createSignatureBlock(contractObject),
      ],
      SecondVersionFormatter.createGenericAddition2(contractObject, contractTemplate, tender),
    ];
  }
}
