import { TypeChecker } from "@/utils/checker/TypeChecker";
import { EmptyChecker } from "@/utils/checker/EmptyChecker";
import { TypeCheckFactory } from "@/services/DataTypeValidator/TypeCheckFactory";
import { typeCheckStrategyMap } from "@/services/DataTypeValidator/TypeCheckStrategyMap";
import { ErrorExceptionCore } from "@/widgets/ErrorExceptionCore/ErrorExceptionCore";
import { ERROR_MESSAGES } from "@/widgets/ErrorExceptionCore/configs/messages";
import { PROZORRO_PDF_ERROR_CODES } from "@/widgets/ErrorExceptionCore/constants/ERROR_CODES.enum";
import type { DataTypeValidatorInterface } from "@/services/DataTypeValidator/DataTypeValidatorInterface";

export class DataTypeValidator implements DataTypeValidatorInterface {
  private readonly _typeChecker = new TypeChecker();
  private readonly _emptyChecker = new EmptyChecker();
  private readonly _factory = new TypeCheckFactory(typeCheckStrategyMap, this._typeChecker, this._emptyChecker);

  validate(
    data: any,
    typesList: string[] | string,
    errorMessage?: string,
    errorCode: PROZORRO_PDF_ERROR_CODES = PROZORRO_PDF_ERROR_CODES.INVALID_PARAMS
  ): void {
    if (!this._typeChecker.isArray(typesList)) {
      typesList = [typesList as string];
    }

    const valid = (typesList as string[]).some((type: string) => this._checkType(data, type));

    if (!valid) {
      throw new ErrorExceptionCore({
        code: errorCode,
        message: errorMessage || ERROR_MESSAGES.INVALID_PARAMS.incorrectInputFormat,
      });
    }
  }

  private _checkType(data: any, type: string): boolean {
    const validator = this._factory.create(type);
    return validator.validate(data);
  }
}
