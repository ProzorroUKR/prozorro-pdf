import { STRING } from "@/constants/string";
import { PDF_FILED_KEYS } from "@/constants/pdf/pdfFieldKeys";
import { CriterionValues } from "@/constants/tender/criterion.enum";
import { ANNOUNCEMENT_TEXTS_LIST } from "@/config/pdf/texts/ANNOUNCEMENT";
import type { CriterionType, RequirementType } from "@/types/TenderOffer/Tender";
import { PDFTablesHandler } from "@/services/PDF/Formatting/PDFTablesHandler";
import { StringConversionHelper } from "@/services/Common/StringConversionHelper";
import { DocumentExtractionService } from "@/services/PDF/document/DocumentExtractionService";
import { CriteriaRequirementDataSchema } from "@/utils/CriteriaRequirementDataSchema";

export class CriteriaHandler {
  static getCriterionLanguage(
    criteria: CriterionType[],
    dictionaries: Map<string, Record<string, any>>
  ): Record<string, any> {
    return CriteriaHandler.criterionValuesFormatter(criteria, CriterionValues.BID_LANGUAGE, dictionaries);
  }

  // виправити відображення критерія забезпечення пропозиції - вимога може бути архівною і її не треба відображати
  // Відображати всі активні вимоги (тільки requirements зі status==active).
  // Відображати в окремій таблиці зі стандартним заголовком.
  static getCriterionSecuringOffer(
    criteria: CriterionType[],
    dictionaries: Map<string, Record<string, any>>
  ): Record<string, any>[] {
    const formattedCriterion = this.criterionValuesFormatter(criteria, CriterionValues.BID_GUARANTEE, dictionaries);

    if (!formattedCriterion.length) {
      return [];
    }

    return [
      {
        text: ANNOUNCEMENT_TEXTS_LIST.securement_terms,
        style: PDF_FILED_KEYS.HEADING_TITLE,
      },
      formattedCriterion,
    ];
  }

  static getCriterionSecurityContract(
    criteria: CriterionType[],
    dictionaries: Map<string, Record<string, any>>
  ): Record<string, any>[] {
    const values = this.criterionContractValuesFormatter(criteria, CriterionValues.CONTRACT_GUARANTEE, dictionaries);
    return values.length
      ? [
          {
            text: ANNOUNCEMENT_TEXTS_LIST.criterion_security_contract,
            style: PDF_FILED_KEYS.HEADING_TITLE,
          },
          ...values,
        ]
      : [];
  }

  static criterionValuesFormatter(
    criteria: CriterionType[],
    type: CriterionValues,
    dictionaries: Map<string, Record<string, any>>
  ): Record<string, any>[] {
    const filteredCriteria = this.getFilteredCriteria(criteria, type);
    const requirements =
      DocumentExtractionService.getField<RequirementType[]>(
        filteredCriteria,
        "[0].requirementGroups[0].requirements"
      ) || [];

    return requirements.reduce<any>((acc, currentRequirement) => {
      if (currentRequirement.status !== "active") {
        return acc;
      }

      acc.push(
        PDFTablesHandler.showIfAvailable({
          title: `${currentRequirement?.title}:`,
          value: this.getRequirementValue(currentRequirement, dictionaries),
        })
      );

      return acc;
    }, []);
  }

  static getFilteredCriteria(criteria: CriterionType[], type: CriterionValues): CriterionType[] {
    return (
      criteria?.filter(item => {
        const criterionValueConditional = DocumentExtractionService.getField(item, "classification.id") === type;
        const activeRequirements = DocumentExtractionService.getField<RequirementType[]>(
          item,
          "requirementGroups[0].requirements"
        ).filter(requirement => requirement.status === "active").length;
        return criterionValueConditional && Boolean(activeRequirements);
      }) ?? []
    );
  }

  static getRequirementValue(
    { expectedValues, expectedValue, unit, dataSchema }: RequirementType,
    dictionaries: Map<string, Record<string, any>>
  ): string {
    if (expectedValues?.length) {
      const dataSchemaHandler = new CriteriaRequirementDataSchema(dictionaries);
      return dataSchemaHandler.translateValues(expectedValues, dataSchema).join(STRING.DELIMITER.NEW_LINE);
    }

    return `${StringConversionHelper.yesNoStringConversion(expectedValue)}${unit?.name ? ` ${unit.name}` : ""}`;
  }

  /*
    *     Виводити з критерія в якому tender.criteria.classification.id===CRITERION.OTHER.CONTRACT.GUARANTEE назву групи зверху з tender.criteria.requirementGroups.description, потім назву поля зліва з tender.criteria.requirementGroups.requirements.title: і виводити значення поля справа з tender.criteria.requirementGroups.requirements.expectedValue (true/True - відображаємо “Так“) або tender.criteria.requirementGroups.requirements.expectedValues (масив, виводити всі значення з нового рядка).
    Додатково до значення відображати tender.criteria.requirementGroups.requirements.unit.name за наявності.

    Відображати всі активні вимоги (тільки requirements зі status==active).
    Відображати в окремій таблиці зі стандартним заголовком.
    Якщо в групі немає жодного активного реквайремента, то не виводити назву групи.
    Якщо такого критерія немає чи в критерії немає жодного активного реквайремента, то не виводити таблицю з заголовком.
    * */
  static criterionContractValuesFormatter(
    criteria: CriterionType[],
    criterionValue: CriterionValues,
    dictionaries: Map<string, Record<string, any>>
  ): Record<string, any>[] {
    const filtered_criteria = this.getFilteredCriteria(criteria, criterionValue);

    if (!Array.isArray(criteria) || !criteria.length || !filtered_criteria.length) {
      return [];
    }

    const requirements = DocumentExtractionService.getField<RequirementType[]>(
      filtered_criteria,
      "[0].requirementGroups[0].requirements"
    );
    const description = DocumentExtractionService.getField<string>(
      filtered_criteria,
      "[0].requirementGroups[0].description"
    );
    const criterionResult = [];

    if (description) {
      criterionResult.push(
        PDFTablesHandler.showIfAvailable({
          value: STRING.WHITESPACE,
          title: description,
        })
      );
    }

    requirements.map(currentRequirement => {
      if (currentRequirement.status === "active") {
        criterionResult.push(
          PDFTablesHandler.showIfAvailable({
            title: `${currentRequirement?.title}:`,
            value: this.getRequirementValue(currentRequirement, dictionaries),
          })
        );
      }
    });
    return criterionResult;
  }
}
