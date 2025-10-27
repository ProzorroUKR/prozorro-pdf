export enum PROZORRO_PDF_ERROR_CODES {
  INVALID_SIGNATURE = "INVALID_SIGNATURE", // EDS errors
  INVALID_PARAMS = "INVALID_PARAMS", // invalid params passed to library
  VALIDATION_FAILED = "VALIDATION_FAILED", // business logic error
  PDF_GENERATION_FAILED = "PDF_GENERATION_FAILED", // PDF Make library error
  SERVICE_UNAVAILABLE = "SERVICE_UNAVAILABLE", // internal library error
}
