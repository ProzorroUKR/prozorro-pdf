import axios from "axios";
import type { Pdfmake } from "@/vite-env";
import pdfMake from "pdfmake/build/pdfmake";
import { ProzorroEds } from "@prozorro/prozorro-eds";
import { ENV_CONFIG } from "@/config/ENV.config";
import { FONTS_CONFIG } from "@/config/FONTS.config";
import { ErrorExceptionCore } from "@/widgets/ErrorExceptionCore/ErrorExceptionCore";
import type { TenderResponseType } from "@/types/Tender/TenderResponseType";
import { DocumentManager } from "@/services/PDF/document/DocumentManager";
import { Assert } from "@/widgets/ErrorExceptionCore/Assert";
import { ERROR_MESSAGES } from "@/widgets/ErrorExceptionCore/configs/messages";
import { PROZORRO_PDF_TYPES } from "@/services/PDF/PdfTypes";
import type { PdfConfigType } from "@/types/pdf/PdfConfigType";
import { LoaderManager } from "@/services/PDF/P7SLoader/LoaderManager";
import type { PdfDocumentConfigType } from "@/types/pdf/PdfDocumentConfigType";
import type { PdfObjectType } from "@/types/pdf/PdfObjectType";
import { DataTypeValidator } from "@/services/DataTypeValidator/DataTypeValidator";
import { ValidationTypes } from "@/services/DataTypeValidator/ValidationTypes";
import { DictionaryCollector } from "@/services/DictionaryCollector/DictionaryCollector";
import { SIGN_TO_DOC_FRAME_ID, STRING } from "@/constants/string";
import { PROZORRO_TEMPLATE_CODES } from "@/widgets/pq/types/TemplateCodes.enum";
import { PROZORRO_PDF_ERROR_CODES } from "@/widgets/ErrorExceptionCore/constants/ERROR_CODES.enum";
import type { EnvironmentModeType } from "@/types/pdf/EnvironmentModeType";
import type { EnvironmentType } from "@/types/pdf/EnvironmentType";

export interface IProzorroPdf {
  TYPES: typeof PROZORRO_PDF_TYPES;
  TEMPLATES: typeof PROZORRO_TEMPLATE_CODES;
  init(environment?: EnvironmentModeType): Promise<void>;
  setConfig(config: PdfConfigType): Promise<void | ErrorExceptionCore>;
  open(config: PdfDocumentConfigType): Promise<void | ErrorExceptionCore>;
  getIframe(config: PdfDocumentConfigType): Promise<void | ErrorExceptionCore>;
  save(config: PdfDocumentConfigType): Promise<void | ErrorExceptionCore>;
}

export class ProzorroPdf implements IProzorroPdf {
  readonly TYPES = PROZORRO_PDF_TYPES;
  readonly TEMPLATES = PROZORRO_TEMPLATE_CODES;
  private readonly dataTypeValidator = new DataTypeValidator();
  private object?: PdfObjectType;
  private documentType = PROZORRO_PDF_TYPES.TICKET;
  private envVars: EnvironmentType = ENV_CONFIG.development;

  async init(environment: EnvironmentModeType = "development"): Promise<void> {
    await ProzorroEds.init({ environment });
    this.envVars = ENV_CONFIG[environment];
    pdfMake.fonts = FONTS_CONFIG;
  }

  async setConfig({ url, type }: PdfConfigType): Promise<void | ErrorExceptionCore> {
    try {
      this.documentType = type;

      if (type === PROZORRO_PDF_TYPES.PQ && url === STRING.EMPTY) {
        return;
      }

      this.dataTypeValidator.validate(url, ValidationTypes.STRING, ERROR_MESSAGES.INVALID_PARAMS.undefinedUrl);

      const {
        data: { data: payload },
      }: TenderResponseType = await axios.get(url);

      this.object = payload;
    } catch (error) {
      throw new ErrorExceptionCore(error as Error);
    }
  }

  async open(config: PdfDocumentConfigType): Promise<void | ErrorExceptionCore> {
    const { data } = await this.create(config);

    try {
      (pdfMake as Pdfmake).createPdf(data).open();
    } catch (error) {
      throw new ErrorExceptionCore({
        originalError: error,
        message: (error as any)?.message,
        code: PROZORRO_PDF_ERROR_CODES.PDF_GENERATION_FAILED,
      });
    }
  }

  async save(config: PdfDocumentConfigType): Promise<void | ErrorExceptionCore> {
    const { data, title } = await this.create(config);

    try {
      (pdfMake as Pdfmake).createPdf(data).download(`${title}.pdf`);
    } catch (error) {
      throw new ErrorExceptionCore({
        originalError: error,
        message: (error as any)?.message,
        code: PROZORRO_PDF_ERROR_CODES.PDF_GENERATION_FAILED,
      });
    }
  }

  async getIframe(config: PdfDocumentConfigType): Promise<void | ErrorExceptionCore> {
    const { data } = await this.create(config);

    try {
      (pdfMake as Pdfmake).createPdf(data).getDataUrl(dataUrl => {
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

  private async create(config: PdfDocumentConfigType): Promise<{
    title: string;
    data: Record<string, any>;
  }> {
    try {
      // TODO
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
