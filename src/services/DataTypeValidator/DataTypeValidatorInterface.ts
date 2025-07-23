export interface DataTypeValidatorInterface {
  validate(
    data: any,
    typesList: string[] | string,
    errorMessage?: string
  ): void;
}
