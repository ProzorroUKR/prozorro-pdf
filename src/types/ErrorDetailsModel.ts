import { ERROR_CODES } from "@/widgets/ErrorExceptionCore/constants/ERROR_CODES.enum";

export interface ErrorDetailsModel {
  code: ERROR_CODES;
  message: string;
  timestamp?: Date;
  originalError?: Error | unknown;
}
