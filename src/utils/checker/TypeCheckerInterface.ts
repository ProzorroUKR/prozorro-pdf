export interface TypeCheckerInterface {
  isString(value: any): boolean;
  isNumber(value: any): boolean;
  isArray(value: any): boolean;
  isFunction(value: any): boolean;
  isObject(value: any): boolean;
  isNull(value: any): boolean;
  isUndefined(value: any): boolean;
  isBoolean(value: any): boolean;
  isRegExp(value: any): boolean;
  isError(value: any): boolean;
  isDate(value: any): boolean;
  isSymbol(value: any): boolean;
}
