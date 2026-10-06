import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { ProzorroEds } from "@prozorro/prozorro-eds";
import { Base64 } from "@/utils/Base64";
import { ENCODING } from "@/constants/encoding";
import { HttpClient } from "@/services/Http/HttpClient";
import { SIGN_DECODE_MODE } from "@/constants/SIGN_DECODE_MODE.enum";
import { SignVerifier, EDS_TRANSPORT_ERROR_CODE } from "@/services/Sign/SignVerifier";
import { ERROR_MESSAGES } from "@/widgets/ErrorExceptionCore/configs/messages";
import { ErrorExceptionCore } from "@/widgets/ErrorExceptionCore/ErrorExceptionCore";
import { PROZORRO_PDF_ERROR_CODES } from "@/widgets/ErrorExceptionCore/constants/ERROR_CODES.enum";

vi.mock("@prozorro/prozorro-eds", () => ({
  ProzorroEds: { verify: vi.fn() },
}));

const verifyMock = vi.mocked(ProzorroEds.verify);
const SIGN_URL = "https://public-api.prozorro.gov.ua/documents/abc?KeyID=1";
const RESULT = { data: "{}", signers: [] };

const edsError = (code: string, message = "eds failure"): Error & { code: string } =>
  Object.assign(new Error(message), { code });

const catchError = async (promise: Promise<unknown>): Promise<ErrorExceptionCore> => {
  try {
    await promise;
  } catch (error) {
    return error as ErrorExceptionCore;
  }

  throw new Error("Expected the promise to reject");
};

describe("SignVerifier", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    verifyMock.mockReset();
    verifyMock.mockResolvedValue(RESULT as any);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("request shape", () => {
    it("passes the link form only, with no encoding when none is given", async () => {
      await new SignVerifier().verify({ signUrl: SIGN_URL });

      expect(verifyMock).toHaveBeenCalledWith({ signUrl: SIGN_URL }, undefined);

      const [params] = verifyMock.mock.calls[0];
      expect(params).not.toHaveProperty("sign");
      expect(params).not.toHaveProperty("data");
    });

    it("forwards the url verbatim, without normalisation", async () => {
      const messyUrl = "HTTPS://Example.COM/a b/sign.p7s?x=1&y=2#frag";
      await new SignVerifier().verify({ signUrl: messyUrl });

      expect(verifyMock).toHaveBeenCalledWith({ signUrl: messyUrl }, undefined);
    });

    it("passes dataUrl for a detached signature", async () => {
      const dataUrl = "https://public-api.prozorro.gov.ua/documents/contract.pdf";
      await new SignVerifier().verify({ signUrl: SIGN_URL, dataUrl });

      expect(verifyMock).toHaveBeenCalledWith({ signUrl: SIGN_URL, dataUrl }, undefined);
    });

    it("passes the encoding as the second argument when given", async () => {
      await new SignVerifier().verify({ signUrl: SIGN_URL }, ENCODING.WINDOWS_1251);

      expect(verifyMock).toHaveBeenCalledWith({ signUrl: SIGN_URL }, ENCODING.WINDOWS_1251);
    });

    it("returns the verified payload untouched", async () => {
      await expect(new SignVerifier().verify({ signUrl: SIGN_URL })).resolves.toEqual(RESULT);
    });
  });

  describe("error taxonomy", () => {
    it("maps an eds transport failure to SERVICE_UNAVAILABLE", async () => {
      verifyMock.mockRejectedValue(edsError(EDS_TRANSPORT_ERROR_CODE));

      const error = await catchError(new SignVerifier().verify({ signUrl: SIGN_URL }));

      expect(error).toBeInstanceOf(ErrorExceptionCore);
      expect(error.code).toBe(PROZORRO_PDF_ERROR_CODES.SERVICE_UNAVAILABLE);
      expect(error.message).toBe(ERROR_MESSAGES.SERVICE_UNAVAILABLE.requestFailed);
    });

    it("maps a native fetch failure to SERVICE_UNAVAILABLE", async () => {
      verifyMock.mockRejectedValue(new TypeError("Failed to fetch"));

      const error = await catchError(new SignVerifier().verify({ signUrl: SIGN_URL }));

      expect(error.code).toBe(PROZORRO_PDF_ERROR_CODES.SERVICE_UNAVAILABLE);
      expect(error.message).toBe(ERROR_MESSAGES.SERVICE_UNAVAILABLE.requestFailed);
    });

    it("maps an answer from the service to INVALID_SIGNATURE", async () => {
      verifyMock.mockRejectedValue(edsError("015", "Невірний формат вхідних даних"));

      const error = await catchError(new SignVerifier().verify({ signUrl: SIGN_URL }));

      expect(error.code).toBe(PROZORRO_PDF_ERROR_CODES.INVALID_SIGNATURE);
      expect(error.message).toBe("Невірний формат вхідних даних");
    });

    it("counts an unrecognised failure against the file, not the service", async () => {
      verifyMock.mockRejectedValue(new Error("something odd"));

      const error = await catchError(new SignVerifier().verify({ signUrl: SIGN_URL }));

      expect(error.code).toBe(PROZORRO_PDF_ERROR_CODES.INVALID_SIGNATURE);
    });
  });

  describe("timeout", () => {
    it("rejects with SERVICE_UNAVAILABLE once the deadline passes", async () => {
      vi.useFakeTimers();
      verifyMock.mockReturnValue(new Promise(() => {}) as any);

      const pending = catchError(new SignVerifier(SIGN_DECODE_MODE.URL, 1_000).verify({ signUrl: SIGN_URL }));
      await vi.advanceTimersByTimeAsync(1_000);
      const error = await pending;

      expect(error.code).toBe(PROZORRO_PDF_ERROR_CODES.SERVICE_UNAVAILABLE);
      expect(error.message).toBe(ERROR_MESSAGES.SERVICE_UNAVAILABLE.requestTimeout);

      vi.useRealTimers();
    });

    it("clears the timer when verification resolves in time", async () => {
      vi.useFakeTimers();
      const clearSpy = vi.spyOn(globalThis, "clearTimeout");

      await new SignVerifier(SIGN_DECODE_MODE.URL, 1_000).verify({ signUrl: SIGN_URL });

      expect(clearSpy).toHaveBeenCalled();
      vi.useRealTimers();
    });
  });

  describe("FILE mode", () => {
    const DATA_URL = "/test-data/contract.pdf";
    let httpGetMock: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
      httpGetMock = vi.spyOn(HttpClient, "get").mockImplementation(async (url: string) => new Blob([url]));
      vi.spyOn(Base64.prototype, "encode").mockImplementation(async blob => `base64:${await blob.text()}`);
    });

    it("downloads the sign file and passes its base64 content with the encoding", async () => {
      await new SignVerifier(SIGN_DECODE_MODE.FILE).verify({ signUrl: SIGN_URL }, ENCODING.WINDOWS_1251);

      expect(httpGetMock).toHaveBeenCalledWith(SIGN_URL, expect.objectContaining({ responseType: "blob" }));
      expect(verifyMock).toHaveBeenCalledWith(`base64:${SIGN_URL}`, ENCODING.WINDOWS_1251);
    });

    it("passes sign and data contents for a detached signature", async () => {
      await new SignVerifier(SIGN_DECODE_MODE.FILE).verify({ signUrl: SIGN_URL, dataUrl: DATA_URL });

      expect(verifyMock).toHaveBeenCalledWith({ sign: `base64:${SIGN_URL}`, data: `base64:${DATA_URL}` }, undefined);
    });

    it("maps a download failure to INVALID_SIGNATURE without calling the service", async () => {
      httpGetMock.mockRejectedValue(new TypeError("Failed to fetch"));

      const error = await catchError(new SignVerifier(SIGN_DECODE_MODE.FILE).verify({ signUrl: SIGN_URL }));

      expect(error).toBeInstanceOf(ErrorExceptionCore);
      expect(error.code).toBe(PROZORRO_PDF_ERROR_CODES.INVALID_SIGNATURE);
      expect(error.message).toBe(ERROR_MESSAGES.INVALID_SIGNATURE.documentAccess);
      expect(verifyMock).not.toHaveBeenCalled();
    });

    it("does not download anything in URL mode", async () => {
      await new SignVerifier(SIGN_DECODE_MODE.URL).verify({ signUrl: SIGN_URL });

      expect(httpGetMock).not.toHaveBeenCalled();
    });
  });
});
