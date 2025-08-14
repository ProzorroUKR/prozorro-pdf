import type { AxiosStatic } from "axios";
import { Assert } from "@/widgets/ErrorExceptionCore/Assert";
import type { LoaderStrategyInterface } from "@/services/PDF/P7SLoader/LoaderStrategyInterface";
import type { LoaderFactoryInterface } from "@/services/PDF/P7SLoader/LoaderFactoryInterface";
import type { IBase64 } from "@/utils/Base64";
import { ERROR_MESSAGES } from "@/widgets/ErrorExceptionCore/configs/messages";
import { PROZORRO_PDF_ERROR_CODES } from "@/widgets/ErrorExceptionCore/constants/ERROR_CODES.enum";

export class LoaderFactory implements LoaderFactoryInterface {
  constructor(
    private readonly typesMap: Map<string, new (base64: IBase64, axios: AxiosStatic) => LoaderStrategyInterface>,
    private readonly base64: IBase64,
    private readonly axios: AxiosStatic
  ) {}

  public create(type: string): LoaderStrategyInterface {
    const strategyClass = this.typesMap.get(type);

    Assert.isDefined(
      strategyClass,
      ERROR_MESSAGES.SERVICE_UNAVAILABLE.loaderTypeIsNotDefined,
      PROZORRO_PDF_ERROR_CODES.SERVICE_UNAVAILABLE
    );

    return new strategyClass(this.base64, this.axios);
  }
}
