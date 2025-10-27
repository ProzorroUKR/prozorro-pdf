import { AllVersionFormatter } from "@/widgets/pq/services/contractTextFormatters/AllVersionFormatter";
import type { PQContractType } from "@/widgets/pq/types/PQTypes";
import { FirstVersionFormatter } from "@/widgets/pq/services/contractTextFormatters/FirstVersionFormatter";
import { PQFormattingService } from "@/widgets/pq/services/Formating/PQFormattingService";
import { MedicineFormatter } from "@/widgets/pq/services/contractTextFormatters/MedicineFormatter";
import { PROZORRO_TEMPLATE_CODES } from "@/widgets/pq/types/TemplateCodes.enum";
import { SecondVersionFormatter } from "@/widgets/pq/services/contractTextFormatters/SecondVersionFormatter";

export class TemplateBuildHelper {
  static pharmBuild(
    contractObject: PQContractType | Record<string, never>,
    contractTemplate: PROZORRO_TEMPLATE_CODES,
    _tender: any
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
    contractTemplate: PROZORRO_TEMPLATE_CODES,
    _tender: any
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
}
