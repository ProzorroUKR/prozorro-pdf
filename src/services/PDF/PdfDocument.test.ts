import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import pdfMake from "pdfmake/build/pdfmake";
import { PdfDocument } from "@/services/PDF/PdfDocument";
import { PROZORRO_PDF_TYPES } from "@/services/PDF/PdfTypes";
import type { EnvironmentType } from "@/types/pdf/EnvironmentType";
import { ErrorExceptionCore } from "@/widgets/ErrorExceptionCore/ErrorExceptionCore";
import { PROZORRO_PDF_ERROR_CODES } from "@/widgets/ErrorExceptionCore/constants/ERROR_CODES.enum";

vi.mock("pdfmake/build/pdfmake", () => ({
  default: { createPdf: vi.fn() },
}));

const createPdfMock = vi.mocked(pdfMake.createPdf);
const DOCUMENT_DATA = { content: "announcement" };
const CONFIG = { title: "sign.p7s" };

const createDocument = (): PdfDocument => {
  const document = new PdfDocument({} as EnvironmentType, PROZORRO_PDF_TYPES.ANNOUNCEMENT, { id: "tender-1" } as any);

  vi.spyOn(document as any, "create").mockResolvedValue({ data: DOCUMENT_DATA, title: "Оголошення" });

  return document;
};

const catchError = async (promise: Promise<unknown>): Promise<ErrorExceptionCore> => {
  try {
    await promise;
  } catch (error) {
    return error as ErrorExceptionCore;
  }

  throw new Error("Expected the promise to reject");
};

describe("PdfDocument", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    createPdfMock.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("getBlob", () => {
    it("resolves with the Blob produced by pdfmake for the created document data", async () => {
      const blob = new Blob(["%PDF-1.3"], { type: "application/pdf" });
      const getBlob = vi.fn((callback: (result: Blob) => void) => callback(blob));
      createPdfMock.mockReturnValue({ getBlob } as any);

      const result = await createDocument().getBlob(CONFIG);

      expect(result).toBe(blob);
      expect(createPdfMock).toHaveBeenCalledWith(DOCUMENT_DATA);
    });

    it("rejects with PDF_GENERATION_FAILED when pdfmake throws", async () => {
      createPdfMock.mockImplementation(() => {
        throw new Error("pdfmake failure");
      });

      const error = await catchError(createDocument().getBlob(CONFIG));

      expect(error).toBeInstanceOf(ErrorExceptionCore);
      expect(error.code).toBe(PROZORRO_PDF_ERROR_CODES.PDF_GENERATION_FAILED);
      expect(error.message).toBe("pdfmake failure");
    });
  });

  describe("open", () => {
    it("hands the pre-opened window to pdfmake so the tab survives Safari's popup blocker", async () => {
      const win = { location: { href: "" } } as Window;
      const open = vi.fn((options: { progressCallback: (progress: number) => void }) => options.progressCallback(1));
      createPdfMock.mockReturnValue({ open } as any);

      await createDocument().open(CONFIG, win);

      expect(open).toHaveBeenCalledWith(expect.objectContaining({ progressCallback: expect.any(Function) }), win);
    });

    it("lets pdfmake open its own window when none is given", async () => {
      const open = vi.fn((options: { progressCallback: (progress: number) => void }) => options.progressCallback(1));
      createPdfMock.mockReturnValue({ open } as any);

      await createDocument().open(CONFIG);

      expect(open).toHaveBeenCalledWith(expect.any(Object), undefined);
    });

    it("rejects with PDF_GENERATION_FAILED when the browser blocks the popup", async () => {
      createPdfMock.mockReturnValue({
        open: () => {
          throw "Open PDF in new window blocked by browser";
        },
      } as any);

      const error = await catchError(createDocument().open(CONFIG));

      expect(error.code).toBe(PROZORRO_PDF_ERROR_CODES.PDF_GENERATION_FAILED);
    });
  });

  describe("getDataUrl", () => {
    it("resolves with the data URL produced by pdfmake", async () => {
      const getDataUrl = vi.fn((callback: (result: string) => void) => callback("data:application/pdf;base64,AAA"));
      createPdfMock.mockReturnValue({ getDataUrl } as any);

      await expect(createDocument().getDataUrl(CONFIG)).resolves.toBe("data:application/pdf;base64,AAA");
    });
  });
});
