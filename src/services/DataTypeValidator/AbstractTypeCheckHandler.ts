import type { TypeCheckerInterface } from "@/utils/checker/TypeCheckerInterface";
import type { EmptyCheckerInterface } from "@/utils/checker/EmptyCheckerInterface";
import type { TypeHandlerInterface } from "@/services/DataTypeValidator/TypeHandlerInterface";

export abstract class AbstractTypeCheckHandler implements TypeHandlerInterface {
  protected constructor(
    protected typeChecker: TypeCheckerInterface,
    protected emptyChecker: EmptyCheckerInterface
  ) {}

  abstract validate(data: any): boolean;
}
