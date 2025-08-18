import { Assert } from "@/widgets/ErrorExceptionCore/Assert";
import { PdfTemplateTypes } from "@/services/PDF/PdfTemplateTypes";
import { ERROR_MESSAGES } from "@/widgets/ErrorExceptionCore/configs/messages";
import { PROZORRO_PDF_ERROR_CODES } from "@/widgets/ErrorExceptionCore/constants/ERROR_CODES.enum";
import type { DocumentStrategyInterface } from "@/services/PDF/document/DocumentStrategyInterface";

export interface DocumentFactoryInterface {
  create(type: string): DocumentStrategyInterface;
}

export class DocumentFactory implements DocumentFactoryInterface {
  constructor(private readonly typesMap: Map<PdfTemplateTypes, new () => DocumentStrategyInterface>) {}

  public create(type: string): DocumentStrategyInterface {
    const strategyClass = this.typesMap.get(type as any);

    Assert.isDefined(
      strategyClass,
      ERROR_MESSAGES.SERVICE_UNAVAILABLE.typeIsNotDefined,
      PROZORRO_PDF_ERROR_CODES.SERVICE_UNAVAILABLE
    );

    return new strategyClass();
  }
}
