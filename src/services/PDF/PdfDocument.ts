import type { Pdfmake } from "@/vite-env";
import pdfMake from "pdfmake/build/pdfmake";
import { ErrorExceptionCore } from "@/widgets/ErrorExceptionCore/ErrorExceptionCore";
import { DocumentManager } from "@/services/PDF/document/DocumentManager";
import { Assert } from "@/widgets/ErrorExceptionCore/Assert";
import { ERROR_MESSAGES } from "@/widgets/ErrorExceptionCore/configs/messages";
import { PROZORRO_PDF_TYPES } from "@/services/PDF/PdfTypes";
import { LoaderManager } from "@/services/PDF/P7SLoader/LoaderManager";
import type { PdfDocumentConfigType } from "@/types/pdf/PdfDocumentConfigType";
import type { PdfObjectType } from "@/types/pdf/PdfObjectType";
import { DictionaryCollector } from "@/services/DictionaryCollector/DictionaryCollector";
import { PROZORRO_PDF_ERROR_CODES } from "@/widgets/ErrorExceptionCore/constants/ERROR_CODES.enum";
import type { EnvironmentType } from "@/types/pdf/EnvironmentType";
import { DomHandler } from "@/services/Dom/DomHandler";

export interface IPdfDocument {
  open(config: PdfDocumentConfigType): Promise<void | ErrorExceptionCore>;
  save(config: PdfDocumentConfigType, fileName?: string): Promise<void | ErrorExceptionCore>;
  getIframe(config: PdfDocumentConfigType, parentFrameId?: string): Promise<void | ErrorExceptionCore>;
  getDataUrl(config: PdfDocumentConfigType): Promise<string | ErrorExceptionCore>;
}

/**
 * Stateless, isolated PDF document handle returned by {@link ProzorroPdf.setConfig}.
 *
 * All per-document state (loaded CBD object, document type, environment)
 * lives on the instance, so concurrent handles never share configuration.
 * The four producing methods all funnel through the private {@link create}.
 */
export class PdfDocument implements IPdfDocument {
  constructor(
    private readonly envVars: EnvironmentType,
    private readonly documentType: PROZORRO_PDF_TYPES,
    private readonly object?: PdfObjectType
  ) {}

  async open(config: PdfDocumentConfigType): Promise<void | ErrorExceptionCore> {
    const { data } = await this.create(config);

    return new Promise((resolve, reject) => {
      try {
        (pdfMake as Pdfmake).createPdf(data).open({
          progressCallback: progress => {
            if (progress === 1) {
              resolve();
            }
          },
        });
      } catch (error) {
        reject(
          new ErrorExceptionCore({
            originalError: error,
            message: (error as any)?.message,
            code: PROZORRO_PDF_ERROR_CODES.PDF_GENERATION_FAILED,
          })
        );
      }
    });
  }

  async save(config: PdfDocumentConfigType, fileName?: string): Promise<void | ErrorExceptionCore> {
    const { data, title } = await this.create(config);

    return new Promise((resolve, reject) => {
      try {
        (pdfMake as Pdfmake).createPdf(data).download(`${fileName || title}.pdf`, () => {}, {
          progressCallback: progress => {
            if (progress === 1) {
              resolve();
            }
          },
        });
      } catch (error) {
        reject(
          new ErrorExceptionCore({
            originalError: error,
            message: (error as any)?.message,
            code: PROZORRO_PDF_ERROR_CODES.PDF_GENERATION_FAILED,
          })
        );
      }
    });
  }

  async getIframe(
    config: PdfDocumentConfigType,
    parentFrameId: string = "prozorroPdfFrameID"
  ): Promise<void | ErrorExceptionCore> {
    const { data } = await this.create(config);

    return new Promise((resolve, reject) => {
      try {
        (pdfMake as Pdfmake).createPdf(data).getDataUrl(dataUrl => DomHandler.passIframe(parentFrameId, dataUrl), {
          progressCallback: progress => {
            if (progress === 1) {
              resolve();
            }
          },
        });
      } catch (error) {
        reject(
          new ErrorExceptionCore({
            originalError: error,
            message: (error as any)?.message,
            code: PROZORRO_PDF_ERROR_CODES.PDF_GENERATION_FAILED,
          })
        );
      }
    });
  }

  async getDataUrl(config: PdfDocumentConfigType): Promise<string | ErrorExceptionCore> {
    const { data } = await this.create(config);

    return new Promise((resolve, reject) => {
      try {
        (pdfMake as Pdfmake).createPdf(data).getDataUrl(dataUrl => resolve(dataUrl));
      } catch (error) {
        reject(
          new ErrorExceptionCore({
            originalError: error,
            message: (error as any)?.message,
            code: PROZORRO_PDF_ERROR_CODES.PDF_GENERATION_FAILED,
          })
        );
      }
    });
  }

  private async create(config: PdfDocumentConfigType): Promise<{ title: string; data: Record<string, any> }> {
    try {
      if (this.documentType !== PROZORRO_PDF_TYPES.PQ) {
        Assert.isDefined(this.object, ERROR_MESSAGES.VALIDATION_FAILED.undefinedObject);
      }

      const loaderManager = new LoaderManager(this.envVars);
      loaderManager.setLoaderType(this.documentType);
      const { file, type, signers, url, additionalData, title } = await loaderManager.getData(
        this.object as any,
        config
      );

      Assert.isDefined(
        file,
        ERROR_MESSAGES.INVALID_SIGNATURE.documentEncoding,
        PROZORRO_PDF_ERROR_CODES.INVALID_SIGNATURE
      );

      const dictionaries = await new DictionaryCollector(this.envVars.staticDataUrl).loadByType(type);

      const documentManager = new DocumentManager(this.envVars);

      documentManager.setDocumentType(type);
      const data = await documentManager.getDocumentData(
        file,
        config,
        signers,
        dictionaries,
        url,
        additionalData || this.object
      );

      return { data, title };
    } catch (error) {
      throw new ErrorExceptionCore(error as Error);
    }
  }
}
