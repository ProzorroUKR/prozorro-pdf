import { AbstractTypeCheckHandler } from "@/services/DataTypeValidator/AbstractTypeCheckHandler.ts";
import type { TypeHandlerInterface } from "@/services/DataTypeValidator/TypeHandlerInterface";

export class StringValidator
  extends AbstractTypeCheckHandler
  implements TypeHandlerInterface
{
  public validate(data: any): boolean {
    return this.emptyChecker.isNotEmptyString(data);
  }
}
