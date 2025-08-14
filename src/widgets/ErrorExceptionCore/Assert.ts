import { ErrorExceptionCore } from "@/widgets/ErrorExceptionCore/ErrorExceptionCore";
import { TypeChecker } from "@/utils/checker/TypeChecker";
import { PROZORRO_PDF_ERROR_CODES } from "@/widgets/ErrorExceptionCore/constants/ERROR_CODES.enum";

export class Assert {
  /**
   * @param value
   * @param message from: ERROR_MESSAGES
   * @param code default: VALIDATION_FAILED
   */
  static isDefined<T>(
    value: T,
    message: string,
    code: PROZORRO_PDF_ERROR_CODES = PROZORRO_PDF_ERROR_CODES.VALIDATION_FAILED
  ): asserts value is NonNullable<T> {
    const typeChecker = new TypeChecker();

    if (typeChecker.isUndefined(value) || typeChecker.isNull(value)) {
      throw new ErrorExceptionCore({ message, code });
    }
  }
}
