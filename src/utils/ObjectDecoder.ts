import { Base64 } from "@/utils/Base64";
import { ENCODING } from "@/constants/encoding";
import { ErrorExceptionCore } from "@/widgets/ErrorExceptionCore/ErrorExceptionCore";
import { PROZORRO_PDF_ERROR_CODES } from "@/widgets/ErrorExceptionCore/constants/ERROR_CODES.enum";
import { ERROR_MESSAGES } from "@/widgets/ErrorExceptionCore/configs/messages";

/**
 * Utility class for decoding Base64-encoded JSON strings into JavaScript objects.
 * Attempts to parse the data directly first, then tries various encoding formats
 * until successful or until all supported encodings are exhausted.
 */
export class ObjectDecoder {
  static decode<T extends Record<any, any>>(data: string): T {
    const base64 = new Base64();
    let dataDecoded = null;

    try {
      return JSON.parse(data) as T;
    } catch {
      dataDecoded = base64.decode(data, ENCODING.UTF_8);
    }

    try {
      return JSON.parse(dataDecoded) as T;
    } catch {
      dataDecoded = base64.decode(data, ENCODING.UTF_16LE);
    }

    try {
      return JSON.parse(dataDecoded) as T;
    } catch {
      dataDecoded = base64.decode(data, ENCODING.UTF_16);
    }

    try {
      return JSON.parse(dataDecoded) as T;
    } catch {
      dataDecoded = base64.decode(data, ENCODING.WINDOWS_1251);
    }

    try {
      return JSON.parse(dataDecoded) as T;
    } catch {
      throw new ErrorExceptionCore({
        message: ERROR_MESSAGES.INVALID_SIGNATURE.documentEncoding,
        code: PROZORRO_PDF_ERROR_CODES.INVALID_SIGNATURE,
      });
    }
  }
}
