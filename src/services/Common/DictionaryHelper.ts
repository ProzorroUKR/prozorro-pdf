import { CLASSIFICATION_CONSTANTS, STRING } from "@/constants/string";
import { AbstractDocumentStrategy } from "@/services/PDF/document/AbstractDocumentStrategy";
import { ANNOUNCEMENT_TEXTS_LIST } from "@/config/pdf/texts/ANNUAL_PROCUREMENT_PLAN";

export class DictionaryHelper {
  private readonly strategy: AbstractDocumentStrategy;
  constructor(strategy: AbstractDocumentStrategy) {
    this.strategy = strategy;
  }
  public getTenderProcurementMethodType(
    type: string,
    procurementMethodTypeDictionary: Record<string, any> | undefined,
    title: string
  ): Record<string, any> {
    if (procurementMethodTypeDictionary === undefined) {
      return this.strategy.showWithDefault(STRING.DASH, title);
    }
    if ("" === type) {
      return this.strategy.showWithDefault(STRING.DASH, title);
    }
    const mapDict = new Map(Object.entries(procurementMethodTypeDictionary));
    const methodTypeTranslated = mapDict.get(type).name;
    return this.strategy.showWithDefault(methodTypeTranslated, title, methodTypeTranslated !== undefined);
  }

  public getClassificationField(
    classification: Record<string, any>,
    classifierDictionary: Record<string, any> | undefined
  ): string {
    if (classifierDictionary === undefined || this.strategy.emptyChecker.isEmptyObject(classification)) {
      return STRING.DASH;
    }

    const { id, scheme: classificationType } = classification;

    if (
      this.strategy.emptyChecker.isEmptyString(classificationType) ||
      (classificationType !== CLASSIFICATION_CONSTANTS.CPV && classificationType !== CLASSIFICATION_CONSTANTS.DK021)
    ) {
      return STRING.DASH;
    }

    let description = this.strategy.getField(classification, "description", STRING.EMPTY);

    if (this.strategy.emptyChecker.isEmptyString(description) && !this.strategy.emptyChecker.isEmptyString(id)) {
      description = classifierDictionary.hasOwnProperty(`${id}`) ? classifierDictionary[id] : STRING.DASH;
    }

    return `${ANNOUNCEMENT_TEXTS_LIST.dk_2015} ${id} ${STRING.DASH} ${description}`;
  }
}
