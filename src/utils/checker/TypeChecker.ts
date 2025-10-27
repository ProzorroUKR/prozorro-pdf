import type { TypeCheckerInterface } from "@/utils/checker/TypeCheckerInterface";
import type {
  CompoundTextType,
  OlConfigType,
} from "@/widgets/pq/types/TextConfigType";

export class TypeChecker implements TypeCheckerInterface {
  static isCompoundTextType(x: OlConfigType): boolean {
    return Boolean(
      typeof x === "object" &&
        x !== null &&
        (x as CompoundTextType).text?.length &&
        (x as CompoundTextType).paths?.length &&
        (x as CompoundTextType).defaults?.length
    );
  }

  isString(value: any): boolean {
    return typeof value === "string" || value instanceof String;
  }

  isNumber(value: any): boolean {
    return typeof value === "number" && isFinite(value);
  }

  isArray(value: any): boolean {
    return Boolean(
      value && typeof value === "object" && value.constructor === Array
    );
  }

  isFunction(value: any): boolean {
    return typeof value === "function";
  }

  isObject(value: any): boolean {
    return Boolean(
      value && typeof value === "object" && value.constructor === Object
    );
  }

  isNull(value: any): boolean {
    return value === null;
  }

  isUndefined(value: any): boolean {
    return typeof value === "undefined";
  }

  isBoolean(value: any): boolean {
    return typeof value === "boolean";
  }

  isRegExp(value: any): boolean {
    return Boolean(
      value && typeof value === "object" && value.constructor === RegExp
    );
  }

  isError(value: any): boolean {
    return value instanceof Error && typeof value.message !== "undefined";
  }

  isDate(value: any): boolean {
    return value instanceof Date;
  }

  isSymbol(value: any): boolean {
    return typeof value === "symbol";
  }
}
