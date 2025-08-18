import type { AxiosStatic } from "axios";
import { Assert } from "@/widgets/ErrorExceptionCore/Assert";
import type { LoaderStrategyInterface } from "@/services/PDF/P7SLoader/LoaderStrategyInterface";
import type { IBase64 } from "@/utils/Base64";
import { ERROR_MESSAGES } from "@/widgets/ErrorExceptionCore/configs/messages";
import { PROZORRO_PDF_ERROR_CODES } from "@/widgets/ErrorExceptionCore/constants/ERROR_CODES.enum";
import type { EdsInterface } from "services/EdsInterface";

export interface LoaderFactoryInterface {
  create(type: string): LoaderStrategyInterface<any>;
}

export class LoaderFactory implements LoaderFactoryInterface {
  constructor(
    private readonly typesMap: Map<
      string,
      new (base64: IBase64, axios: AxiosStatic, eds: EdsInterface) => LoaderStrategyInterface<any>
    >,
    private readonly base64: IBase64,
    private readonly axios: AxiosStatic,
    private readonly eds: EdsInterface
  ) {}

  public create(type: string): LoaderStrategyInterface<any> {
    const strategyClass = this.typesMap.get(type);

    Assert.isDefined(
      strategyClass,
      ERROR_MESSAGES.SERVICE_UNAVAILABLE.loaderTypeIsNotDefined,
      PROZORRO_PDF_ERROR_CODES.SERVICE_UNAVAILABLE
    );

    return new strategyClass(this.base64, this.axios, this.eds);
  }
}
