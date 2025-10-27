export interface EmptyCheckerInterface {
  isEmptyString(value: any): boolean;
  isNotEmptyString(value: any): boolean;
  isEmptyArray(value: any): boolean;
  isNotEmptyArray(value: any): boolean;
  isEmptyObject(value: any): boolean;
  isNotEmptyObject(value: any): boolean;
}
