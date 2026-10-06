import { ProzorroEds } from "@prozorro/prozorro-eds";
import type { ENCODING } from "@/constants/encoding";
import { Base64 } from "@/utils/Base64";
import type { SignerType } from "@/types/sign/SignerType";
import { SIGN_DECODE_MODE } from "@/constants/SIGN_DECODE_MODE.enum";
import { DEFAULT_REQUEST_TIMEOUT, HttpClient } from "@/services/Http/HttpClient";
import { ERROR_MESSAGES } from "@/widgets/ErrorExceptionCore/configs/messages";
import { ErrorExceptionCore } from "@/widgets/ErrorExceptionCore/ErrorExceptionCore";
import { PROZORRO_PDF_ERROR_CODES } from "@/widgets/ErrorExceptionCore/constants/ERROR_CODES.enum";

/**
 * `apiSignRequest` code of `@prozorro/prozorro-eds`: the request never reached the
 * decryption service. Any other code means the service did answer.
 */
export const EDS_TRANSPORT_ERROR_CODE = "003";

const TRANSPORT_ERROR_NAMES = ["TypeError", "AbortError", "TimeoutError"];

export type VerifySignParams = {
  /** Link to the `.p7s` file. Fetched by the decryption service in `URL` mode, by the browser in `FILE` mode. */
  signUrl: string;
  /** Link to the signed payload of a detached signature. Fetched the same way as `signUrl`. */
  dataUrl?: string;
};

export type VerifySignResultType = {
  data: string;
  signers: SignerType[];
};

export interface SignVerifierInterface {
  verify(params: VerifySignParams, encoding?: ENCODING): Promise<VerifySignResultType>;
}

class TimeoutError extends Error {
  constructor() {
    super(ERROR_MESSAGES.SERVICE_UNAVAILABLE.requestTimeout);
    this.name = "SignVerifyTimeoutError";
  }
}

export class SignVerifier implements SignVerifierInterface {
  private readonly _base64 = new Base64();

  constructor(
    private readonly mode: SIGN_DECODE_MODE = SIGN_DECODE_MODE.URL,
    private readonly timeout: number = DEFAULT_REQUEST_TIMEOUT
  ) {}

  async verify(params: VerifySignParams, encoding?: ENCODING): Promise<VerifySignResultType> {
    // Download failures in `FILE` mode are thrown as-is, before the service is involved.
    const input = this.mode === SIGN_DECODE_MODE.FILE ? await this._downloadFiles(params) : params;

    // The URL is forwarded exactly as the API gave it: link format is the decryption
    // service's rule, and duplicating it here would go stale on its first update.
    try {
      return await this._withTimeout(ProzorroEds.verify(input, encoding));
    } catch (error) {
      throw this._toErrorException(error);
    }
  }

  private async _downloadFiles({
    signUrl,
    dataUrl,
  }: VerifySignParams): Promise<string | { sign: string; data: string }> {
    const sign = await this._download(signUrl);

    return dataUrl ? { sign, data: await this._download(dataUrl) } : sign;
  }

  private async _download(url: string): Promise<string> {
    try {
      const file = await HttpClient.get<Blob>(url, { responseType: "blob", timeout: this.timeout });

      return await this._base64.encode(file);
    } catch (error) {
      throw new ErrorExceptionCore({
        code: PROZORRO_PDF_ERROR_CODES.INVALID_SIGNATURE,
        message: ERROR_MESSAGES.INVALID_SIGNATURE.documentAccess,
        originalError: error,
      });
    }
  }

  private _withTimeout<T>(promise: Promise<T>): Promise<T> {
    let timer: ReturnType<typeof setTimeout>;

    const timeout = new Promise<never>((_, reject) => {
      timer = setTimeout(() => reject(new TimeoutError()), this.timeout);
    });

    return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
  }

  private _toErrorException(error: unknown): ErrorExceptionCore {
    const originalError = error as Error & { code?: string };

    if (originalError instanceof TimeoutError) {
      return new ErrorExceptionCore({
        code: PROZORRO_PDF_ERROR_CODES.SERVICE_UNAVAILABLE,
        message: ERROR_MESSAGES.SERVICE_UNAVAILABLE.requestTimeout,
        originalError,
      });
    }

    // A failure that never reached the service is an outage; anything the service
    // answered - recognised or not - counts against the file, not the service.
    if (originalError?.code === EDS_TRANSPORT_ERROR_CODE || TRANSPORT_ERROR_NAMES.includes(originalError?.name)) {
      return new ErrorExceptionCore({
        code: PROZORRO_PDF_ERROR_CODES.SERVICE_UNAVAILABLE,
        message: ERROR_MESSAGES.SERVICE_UNAVAILABLE.requestFailed,
        originalError,
      });
    }

    return new ErrorExceptionCore({
      code: PROZORRO_PDF_ERROR_CODES.INVALID_SIGNATURE,
      message: originalError?.message || ERROR_MESSAGES.INVALID_SIGNATURE.documentEncoding,
      originalError,
    });
  }
}

export const signVerifier = new SignVerifier();
