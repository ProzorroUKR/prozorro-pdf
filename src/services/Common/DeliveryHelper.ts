import { STRING } from "@/constants/string";
import { MONTHS_LIST } from "@/constants/monthList";
import { AbstractDocumentStrategy } from "@/services/PDF/document/AbstractDocumentStrategy";

export class DeliveryHelper {
  private readonly strategy: AbstractDocumentStrategy;

  constructor(strategy: AbstractDocumentStrategy) {
    this.strategy = strategy;
  }

  public prepareDeliveryDate(item: Record<string, any>): string {
    const startDateRawField = this.strategy.getField(item, "deliveryDate.startDate", "");
    const endDateRawField = this.strategy.getField(item, "deliveryDate.endDate", "");
    if (
      this.strategy.emptyChecker.isEmptyString(startDateRawField) &&
      this.strategy.emptyChecker.isEmptyString(endDateRawField)
    ) {
      return STRING.DASH;
    }

    const startDateRaw = new Date(startDateRawField);
    let startDate = !isNaN(startDateRaw.getTime())
      ? `${startDateRaw.getDate()} ${MONTHS_LIST[startDateRaw.getMonth()]} ${startDateRaw.getFullYear()}`
      : "";

    const endDateRaw = new Date(endDateRawField);
    let endDate = !isNaN(endDateRaw.getTime())
      ? `${endDateRaw.getDate()} ${MONTHS_LIST[endDateRaw.getMonth()]} ${endDateRaw.getFullYear()}`
      : "";

    startDate = this.strategy.emptyChecker.isNotEmptyString(startDate) ? `з ${startDate}` : "";
    endDate = this.strategy.emptyChecker.isNotEmptyString(endDate) ? `до ${endDate}` : "";

    return `${startDate} ${endDate}`;
  }
}
