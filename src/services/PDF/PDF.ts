import axios from "axios";
import type { Pdfmake } from "@/vite-env";
import pdfMake from "pdfmake/build/pdfmake";
import { fonts } from "@/config/fonts";
import { ErrorExceptionCore } from "@/widgets/ErrorExceptionCore/ErrorExceptionCore";
import type { TenderResponseType } from "@/types/Tender/TenderResponseType";
import { DocumentManager } from "@/services/PDF/document/DocumentManager";
import { Base64 } from "@/utils/Base64";
import { Assert } from "@/widgets/ErrorExceptionCore/Assert";
import { ERROR_MESSAGES } from "@/widgets/ErrorExceptionCore/configs/messages";
import { PROZORRO_PDF_TYPES } from "@/services/PDF/PdfTypes";
import type { PdfConfigType } from "@/types/pdf/PdfConfigType";
import { LoaderManager } from "@/services/PDF/P7SLoader/LoaderManager";
import type { PdfDocumentConfigType } from "@/types/pdf/PdfDocumentConfigType";
import type { PdfObjectType } from "@/types/pdf/PdfObjectType";
import { DataTypeValidator } from "@/services/DataTypeValidator/DataTypeValidator";
import { ValidationTypes } from "@/services/DataTypeValidator/ValidationTypes";
import type { EdsInterface } from "services/EdsInterface";
import { DictionaryCollector } from "@/services/DictionaryCollector/DictionaryCollector";
import { SIGN_TO_DOC_FRAME_ID, STRING } from "@/constants/string";
import { PROZORRO_TEMPLATE_CODES } from "@/widgets/pq/types/TemplateCodes.enum";
import { PROZORRO_PDF_ERROR_CODES } from "@/widgets/ErrorExceptionCore/constants/ERROR_CODES.enum";

export interface IProzorroPdf {
  TYPES: typeof PROZORRO_PDF_TYPES;
  TEMPLATES: typeof PROZORRO_TEMPLATE_CODES;
  init(eds: any): void;
  setConfig(config: PdfConfigType): Promise<void | ErrorExceptionCore>;
  open(config: PdfDocumentConfigType): Promise<void | ErrorExceptionCore>;
  getIframe(config: PdfDocumentConfigType): Promise<void | ErrorExceptionCore>;
  save(config: PdfDocumentConfigType): Promise<void | ErrorExceptionCore>;
}

export class ProzorroPdf implements IProzorroPdf {
  readonly TYPES = PROZORRO_PDF_TYPES;
  readonly TEMPLATES = PROZORRO_TEMPLATE_CODES;
  private readonly base64 = new Base64();
  private readonly documentManager = new DocumentManager();
  private readonly dataTypeValidator = new DataTypeValidator();
  private eds?: EdsInterface;
  private object?: PdfObjectType;
  private documentType = PROZORRO_PDF_TYPES.TICKET;

  init(eds: EdsInterface): void {
    this.eds = eds;
    pdfMake.fonts = fonts;
  }

  async setConfig({ url, type }: PdfConfigType): Promise<void | ErrorExceptionCore> {
    try {
      if (type === PROZORRO_PDF_TYPES.PQ && url === STRING.EMPTY) {
        return;
      }

      this.dataTypeValidator.validate(url, ValidationTypes.STRING, ERROR_MESSAGES.INVALID_PARAMS.undefinedUrl);

      const {
        data: { data: payload },
      }: TenderResponseType = await axios.get(url);

      this.object = payload;
      this.documentType = type;
    } catch (error) {
      throw new ErrorExceptionCore(error as Error);
    }
  }

  async open(config: PdfDocumentConfigType): Promise<void | ErrorExceptionCore> {
    this.dataTypeValidator.validate(config.title, ValidationTypes.STRING);

    const document = await this.create(config);

    try {
      (pdfMake as Pdfmake).createPdf(document).open();
    } catch (error) {
      throw new ErrorExceptionCore({
        originalError: error,
        message: (error as any)?.message,
        code: PROZORRO_PDF_ERROR_CODES.PDF_GENERATION_FAILED,
      });
    }
  }

  async getIframe(config: PdfDocumentConfigType): Promise<void | ErrorExceptionCore> {
    const documentFile = await this.create(config);

    try {
      (pdfMake as Pdfmake).createPdf(documentFile).getDataUrl(dataUrl => {
        const targetElement: HTMLElement = document.getElementById(SIGN_TO_DOC_FRAME_ID) as HTMLElement;
        const iframe = document.createElement("iframe");
        iframe.src = dataUrl;
        iframe.width = "100%";
        iframe.height = "100%";
        targetElement.appendChild(iframe);
      });
    } catch (error) {
      throw new ErrorExceptionCore({
        originalError: error,
        message: (error as any)?.message,
        code: PROZORRO_PDF_ERROR_CODES.PDF_GENERATION_FAILED,
      });
    }
  }

  async save(config: PdfDocumentConfigType): Promise<void | ErrorExceptionCore> {
    this.dataTypeValidator.validate(config.title, ValidationTypes.STRING);

    const document = await this.create(config);

    try {
      (pdfMake as Pdfmake).createPdf(document).download(`${config.title}.pdf`);
    } catch (error) {
      throw new ErrorExceptionCore({
        originalError: error,
        message: (error as any)?.message,
        code: PROZORRO_PDF_ERROR_CODES.PDF_GENERATION_FAILED,
      });
    }
  }

  private async create(config: PdfDocumentConfigType): Promise<Record<string, any>> {
    try {
      Assert.isDefined(this.object, ERROR_MESSAGES.VALIDATION_FAILED.undefinedObject);
      Assert.isDefined(this.eds, ERROR_MESSAGES.INVALID_PARAMS.libraryInit, PROZORRO_PDF_ERROR_CODES.INVALID_PARAMS);

      const loaderManager = new LoaderManager(this.base64, axios, this.eds);
      loaderManager.setLoaderType(this.documentType);
      const { file, type, signers, url, additionalData } = await loaderManager.getData(this.object, config);

      Assert.isDefined(
        file,
        ERROR_MESSAGES.INVALID_SIGNATURE.documentEncoding,
        PROZORRO_PDF_ERROR_CODES.INVALID_SIGNATURE
      );

      const dictionaries = await new DictionaryCollector().loadByType(type);

      this.documentManager.setDocumentType(type);
      return await this.documentManager.getDocumentData(
        file,
        config,
        signers,
        dictionaries,
        url,
        additionalData || this.object
      );
    } catch (error) {
      throw new ErrorExceptionCore(error as Error);
    }
  }
}
