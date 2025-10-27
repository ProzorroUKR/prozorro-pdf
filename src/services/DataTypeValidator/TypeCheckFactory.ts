import type { TypeCheckerInterface } from "@/utils/checker/TypeCheckerInterface";
import type { EmptyCheckerInterface } from "@/utils/checker/EmptyCheckerInterface";
import type { TypeHandlerInterface } from "@/services/DataTypeValidator/TypeHandlerInterface";
import { Assert } from "@/widgets/ErrorExceptionCore/Assert";
import { ERROR_MESSAGES } from "@/widgets/ErrorExceptionCore/configs/messages";
import { PROZORRO_PDF_ERROR_CODES } from "@/widgets/ErrorExceptionCore/constants/ERROR_CODES.enum";

export class TypeCheckFactory {
  constructor(
    private readonly typesMap: Map<
      string,
      new (typeChecker: TypeCheckerInterface, emptyChecker: EmptyCheckerInterface) => TypeHandlerInterface
    >,
    private readonly typeChecker: TypeCheckerInterface,
    private readonly emptyChecker: EmptyCheckerInterface
  ) {}

  public create(type: string): TypeHandlerInterface {
    const strategyClass = this.typesMap.get(type);

    Assert.isDefined(
      strategyClass,
      ERROR_MESSAGES.SERVICE_UNAVAILABLE.typeIsNotDefined,
      PROZORRO_PDF_ERROR_CODES.SERVICE_UNAVAILABLE
    );

    return new strategyClass(this.typeChecker, this.emptyChecker);
  }
}
