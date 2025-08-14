import { Assert } from "@/widgets/ErrorExceptionCore/Assert";
import type { XMLParserInterface } from "@/services/Dom/XMLParserInterface";
import { ERROR_MESSAGES } from "@/widgets/ErrorExceptionCore/configs/messages";
import { PROZORRO_PDF_ERROR_CODES } from "@/widgets/ErrorExceptionCore/constants/ERROR_CODES.enum";
import type { DocumentFactoryInterface } from "@/services/PDF/document/DocumentFactoryInterface";
import type { DocumentStrategyInterface } from "@/services/PDF/document/DocumentStrategyInterface";

export class DocumentFactory implements DocumentFactoryInterface {
  constructor(
    private readonly typesMap: Map<string, new (xmlParser: XMLParserInterface) => DocumentStrategyInterface>,
    private readonly xmlParser: XMLParserInterface
  ) {}

  public create(type: string): DocumentStrategyInterface {
    const strategyClass = this.typesMap.get(type);

    Assert.isDefined(
      strategyClass,
      ERROR_MESSAGES.SERVICE_UNAVAILABLE.typeIsNotDefined,
      PROZORRO_PDF_ERROR_CODES.SERVICE_UNAVAILABLE
    );

    return new strategyClass(this.xmlParser);
  }
}
