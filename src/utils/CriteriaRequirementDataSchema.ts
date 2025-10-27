import { STRING } from "@/constants/string";
import type { DataSchemaType } from "@/types/TenderOffer/Tender";
import { dataSchemaToDictionaryMap } from "@/widgets/TenderOffer/constants/dataSchemaToDictionaryMap";

export class CriteriaRequirementDataSchema {
  constructor(
    private readonly dictionaries: Map<string, Record<string, any>>
  ) {}

  /**
   * translate values related to dataSchema
   */
  translateValues(values?: any[], dataSchema?: DataSchemaType): string[] {
    const dictionary = this._getDictionary(dataSchema);

    if (!values?.length || !dictionary) {
      return values ?? [];
    }

    return values.map(value => dictionary[value]?.name || value);
  }

  private _getDictionary(
    dataSchema?: DataSchemaType
  ): Record<string, { name: string }> | undefined {
    const dictionaryKey =
      dataSchemaToDictionaryMap.get(dataSchema) || STRING.EMPTY;
    return this.dictionaries.get(dictionaryKey);
  }
}
