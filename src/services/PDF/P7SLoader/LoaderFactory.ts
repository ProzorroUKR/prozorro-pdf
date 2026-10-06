import { Assert } from "@/widgets/ErrorExceptionCore/Assert";
import type { LoaderStrategyInterface } from "@/services/PDF/P7SLoader/LoaderStrategyInterface";
import { ERROR_MESSAGES } from "@/widgets/ErrorExceptionCore/configs/messages";
import { PROZORRO_PDF_ERROR_CODES } from "@/widgets/ErrorExceptionCore/constants/ERROR_CODES.enum";
import type { EnvironmentType } from "@/types/pdf/EnvironmentType.ts";
import type { LoaderStrategyConstructor } from "@/modules/types";
import type { SignVerifierInterface } from "@/services/Sign/SignVerifier";

export interface LoaderFactoryInterface {
  create(type: string): LoaderStrategyInterface<any>;
}

export class LoaderFactory implements LoaderFactoryInterface {
  constructor(
    private readonly typesMap: Map<string, LoaderStrategyConstructor>,
    private readonly envVars: EnvironmentType,
    private readonly verifier?: SignVerifierInterface
  ) {}

  public create(type: string): LoaderStrategyInterface<any> {
    const strategyClass = this.typesMap.get(type);

    Assert.isDefined(
      strategyClass,
      ERROR_MESSAGES.SERVICE_UNAVAILABLE.loaderTypeIsNotDefined,
      PROZORRO_PDF_ERROR_CODES.SERVICE_UNAVAILABLE
    );

    return new strategyClass(this.envVars, this.verifier);
  }
}
