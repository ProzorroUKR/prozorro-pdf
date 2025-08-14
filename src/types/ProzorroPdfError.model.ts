import { PROZORRO_PDF_ERROR_CODES } from "@/widgets/ErrorExceptionCore/constants/ERROR_CODES.enum";

export interface ProzorroPdfErrorModel {
  code: PROZORRO_PDF_ERROR_CODES;
  message: string;
  timestamp?: Date;
  originalError?: Error | unknown;
}
