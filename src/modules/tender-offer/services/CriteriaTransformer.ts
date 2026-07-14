import type {
  CriterionType,
  DataSchemaType,
  ItemType,
  RequirementGroupType,
  RequirementResponseType,
  SubCriteriaFieldsType,
  UnitType,
} from "@/types/TenderOffer/Tender";
import { STRING } from "@/constants/string";
import { CriteriaRequirementDataSchema } from "@/utils/CriteriaRequirementDataSchema";

export class CriteriaTransformer {
  static getSpecificationsFieldsTable(
    dictionaries: Map<string, Record<string, any>>,
    item: ItemType,
    criteria?: CriterionType[],
    requirementResponses?: RequirementResponseType[]
  ): SubCriteriaFieldsType[] | null {
    if (!requirementResponses?.length || !criteria?.length) {
      return null;
    }

    const subCriteriaFields = this.getSubCriteriaFields(item, criteria, requirementResponses, dictionaries);
    return subCriteriaFields?.length ? subCriteriaFields : null;
  }

  static getSubCriteriaFields(
    { id }: ItemType,
    criteria: CriterionType[],
    requirementResponses: RequirementResponseType[],
    dictionaries: Map<string, Record<string, any>>
  ): SubCriteriaFieldsType[] {
    const itemCriteria = criteria.filter(criterion => criterion.relatedItem === id);

    if (!itemCriteria?.length) {
      return [];
    }

    return itemCriteria.reduce((acc, { requirementGroups, classification }) => {
      const criterionRequirements = this.criterionRequirements(requirementGroups);

      const filteredResponses = requirementResponses.filter(
        response =>
          CriteriaTransformer.bidRequirementIds(requirementGroups).includes(response.requirement.id) &&
          (response.relatedItem === id || !response.relatedItem)
      );

      const requirements = this.requirementGroupsRequirements(filteredResponses);

      Object.entries(criterionRequirements)
        .filter(([key]) => Object.keys(requirements).includes(key))
        .forEach(([key, { dataSchema, unit, title }]) => {
          const dataSchemaHandler = new CriteriaRequirementDataSchema(dictionaries);
          const translateValues = dataSchemaHandler.translateValues(requirements[key].values, dataSchema);

          acc.push({
            title,
            unit,
            values: translateValues,
            value: requirements[key].value,
            classificationId: classification?.id || STRING.EMPTY,
          });
        });

      return acc;
    }, [] as SubCriteriaFieldsType[]);
  }

  static criterionRequirements(requirementGroups: RequirementGroupType[]): Record<
    string,
    {
      title: string;
      unit?: UnitType;
      dataSchema?: DataSchemaType;
    }
  > {
    return requirementGroups.reduce(
      (acc, { requirements }) => {
        requirements.forEach(({ id, title, unit, dataSchema }) => {
          acc[id] = {
            title,
            unit,
            dataSchema,
          };
        });

        return acc;
      },
      {} as Record<string, { title: string; unit?: UnitType; dataSchema?: DataSchemaType }>
    );
  }

  static requirementGroupsRequirements(requirementResponses: RequirementResponseType[]): Record<
    string,
    {
      value?: any;
      values?: string[];
    }
  > {
    return requirementResponses.reduce(
      (accum, { requirement, values, value }) => {
        accum[requirement.id] = {
          value,
          values,
        };

        return accum;
      },
      {} as Record<string, { value?: any; values?: string[] }>
    );
  }

  static bidRequirementIds(requirementGroups: RequirementGroupType[]): string[] {
    return (
      requirementGroups.reduce(
        (acc, requirementResponses) =>
          acc.concat(...CriteriaTransformer.requirementResponsesRequirementsIds(requirementResponses)),
        [] as string[]
      ) || []
    );
  }

  static requirementResponsesRequirementsIds(requirementResponses: RequirementGroupType): string[] {
    return requirementResponses.requirements.reduce(
      (requirementAcc, { id }) => requirementAcc.concat(id),
      [] as string[]
    );
  }

  /**
   * Return criteria relates to lot or tender
   */
  static filterCriteriaByRelatesTo(criteria: CriterionType[], isLot: boolean): CriterionType[] {
    return criteria.filter(({ relatesTo }) => (isLot && relatesTo === "lot") || (!isLot && relatesTo !== "lot"));
  }
}
