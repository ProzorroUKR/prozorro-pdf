import { ERROR_MESSAGES } from "@/widgets/ErrorExceptionCore/configs/messages";
import { ErrorExceptionCore } from "@/widgets/ErrorExceptionCore/ErrorExceptionCore";
import { PROZORRO_PDF_ERROR_CODES } from "@/widgets/ErrorExceptionCore/constants/ERROR_CODES.enum";

// Default per-request timeout (ms). Requests never hang indefinitely.
export const DEFAULT_REQUEST_TIMEOUT = 30_000;

export type HttpResponseType = "json" | "text" | "blob";

export interface HttpRequestOptions {
  timeout?: number; // Per-request timeout override in ms. Defaults to {@link DEFAULT_REQUEST_TIMEOUT}.
  responseType?: HttpResponseType;
  params?: Record<string, any>; // Query params.
  paramsSerializer?: (params: Record<string, any>) => string; // Serializes {@link params} into a query string. Defaults to `URLSearchParams`.
}

export class HttpClient {
  static async get<T = any>(
    url: string,
    { timeout = DEFAULT_REQUEST_TIMEOUT, responseType = "json", params, paramsSerializer }: HttpRequestOptions = {}
  ): Promise<T> {
    try {
      const response = await fetch(this._buildUrl(url, params, paramsSerializer), {
        signal: AbortSignal.timeout(timeout),
      });

      if (!response.ok) {
        throw new ErrorExceptionCore({
          code: PROZORRO_PDF_ERROR_CODES.SERVICE_UNAVAILABLE,
          message: ERROR_MESSAGES.SERVICE_UNAVAILABLE.requestFailed,
        });
      }

      return await this._parseBody<T>(response, responseType);
    } catch (error) {
      if (error instanceof ErrorExceptionCore) {
        throw error;
      }

      const isTimeout = (error as Error)?.name === "TimeoutError";

      throw new ErrorExceptionCore({
        code: PROZORRO_PDF_ERROR_CODES.SERVICE_UNAVAILABLE,
        message: isTimeout
          ? ERROR_MESSAGES.SERVICE_UNAVAILABLE.requestTimeout
          : ERROR_MESSAGES.SERVICE_UNAVAILABLE.requestFailed,
        originalError: error as Error,
      });
    }
  }

  private static _buildUrl(
    url: string,
    params?: Record<string, any>,
    paramsSerializer?: (params: Record<string, any>) => string
  ): string {
    const query = paramsSerializer ? paramsSerializer(params || {}) : new URLSearchParams(params).toString();
    return params ? (url.includes("?") ? `${url}&${query}` : `${url}?${query}`) : url;
  }

  private static async _parseBody<T>(response: Response, responseType: HttpResponseType): Promise<T> {
    if (responseType === "blob") {
      return (await response.blob()) as T;
    }

    const text = await response.text();

    if (responseType === "text") {
      return text as T;
    }

    try {
      return JSON.parse(text) as T;
    } catch {
      return text as T;
    }
  }
}
