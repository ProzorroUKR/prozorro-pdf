import type { RequirementResponseType } from "@/types/TenderOffer/Tender";
import { STRING } from "@/constants/string";
import { TypeChecker } from "@/utils/checker/TypeChecker";
import {
  ENSURING_CLASSIFICATION,
  ENSURING_TYPE_REQUIREMENTS,
  ENSURING_TYPE_VALUE,
} from "@/widgets/pq/services/ContractEnsuring/config/PQreqirements";
import { EnsuringTypeCodesEnum } from "@/widgets/pq/services/ContractEnsuring/types/EnsuringTypeCodes.enum";

export class EnsuringRequirementsParser {
  private static readonly _typeChecker = new TypeChecker();

  public static findEnsuringOption(requirementResponses: RequirementResponseType[]): string {
    const EnsuringTypeRequirement = EnsuringRequirementsParser.findRequirementValue(
      requirementResponses,
      ENSURING_TYPE_REQUIREMENTS,
      STRING.EMPTY
    ).trim();

    return EnsuringTypeRequirement === ENSURING_TYPE_VALUE
      ? EnsuringTypeCodesEnum.OPTION_1
      : EnsuringTypeCodesEnum.OPTION_2;
  }

  public static getEnsuringOptionalField(requirementResponses: RequirementResponseType[]): string {
    const optionalRequirement = requirementResponses.find(
      response =>
        EnsuringRequirementsParser._typeChecker.isBoolean(response.value) &&
        response.value &&
        ENSURING_CLASSIFICATION === response?.classification?.id
    );

    return optionalRequirement?.requirement.title ?? STRING.EMPTY;
  }

  public static findRequirementValue(
    requirementResponses: RequirementResponseType[],
    titles: string[],
    defaults: string
  ): string {
    const requirement = requirementResponses.find(response =>
      titles.includes(response.requirement.title || STRING.EMPTY)
    );

    if (requirement?.values && Array.isArray(requirement?.values)) {
      return requirement.values?.join(STRING.DELIMITER.COMMA);
    }

    return requirement?.value !== undefined ? String(requirement?.value) : defaults;
  }
}
