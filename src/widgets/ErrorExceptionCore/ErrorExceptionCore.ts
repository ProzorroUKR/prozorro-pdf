import type { ProzorroPdfErrorModel } from "@/types/ProzorroPdfError.model.ts";
import { PROZORRO_PDF_ERROR_CODES } from "@/widgets/ErrorExceptionCore/constants/ERROR_CODES.enum";

export interface IPrzorroPdfErrorExceptionCore extends Error {
  readonly timestamp?: Date;
  readonly code: PROZORRO_PDF_ERROR_CODES;
  readonly details: ProzorroPdfErrorModel;
  logWithTrace: () => void;
}

export class ErrorExceptionCore extends Error implements IPrzorroPdfErrorExceptionCore {
  public readonly timestamp?: Date;
  public readonly code: PROZORRO_PDF_ERROR_CODES;
  public readonly details: ProzorroPdfErrorModel;

  constructor(info: string | Error | ProzorroPdfErrorModel) {
    const details: ProzorroPdfErrorModel = ErrorExceptionCore.getDetails(info);

    super(details?.message);

    this.details = details;
    this.code = details.code;
    this.name = this.constructor.name;
    this.timestamp = details.timestamp;
    this.message = details?.message || details.code;

    if ("captureStackTrace" in Error && typeof Error?.captureStackTrace === "function") {
      Error?.captureStackTrace(this, this.constructor);
    }

    this.stack = (details.originalError as Error)?.stack || this.stack;

    // Handler if passed instance of ErrorExceptionCore in this class
    if (info instanceof ErrorExceptionCore) {
      return;
    }

    this.logWithTrace();
  }

  static getDetails(details: string | Error | ProzorroPdfErrorModel): ProzorroPdfErrorModel {
    const timestamp = (details as ProzorroPdfErrorModel)?.timestamp || new Date();

    switch (true) {
      case details instanceof ErrorExceptionCore: // handler if passed instance of ErrorExceptionCore in this class
        return (details as ErrorExceptionCore).details;
      case details instanceof Error: // handler for original errors
        return {
          timestamp,
          code: PROZORRO_PDF_ERROR_CODES.SERVICE_UNAVAILABLE,
          message: (details as Error).message,
          originalError: details as Error,
        };
      case typeof details === "string":
        return {
          timestamp,
          code: PROZORRO_PDF_ERROR_CODES.SERVICE_UNAVAILABLE,
          message: details as string,
        };
      default:
        return {
          ...(details as ProzorroPdfErrorModel),
          timestamp,
        };
    }
  }

  logWithTrace(): void {
    console.error(
      "--- PROZORRO PDF: Error Details ---",
      "\nCode: ",
      this.code,
      "\nMessage: ",
      this.message,
      "\nLocation: ",
      this._getLocation(),
      "\nTimestamp: ",
      this.timestamp,
      "\nOriginal Error:",
      this.details.originalError
    );

    if (!(this.details.originalError as Error)?.stack) {
      console.error("Full Stack:", this.stack);
    }
  }

  private _getLocation(): string {
    const [, location] = this.stack?.split("\n") || [];
    return location?.trim() || "Unknown location";
  }
}
