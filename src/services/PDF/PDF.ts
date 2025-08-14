import axios from "axios";
import pdfMake from "pdfmake/build/pdfmake";
import type { Pdfmake } from "@/vite-env";
import { XMLParser } from "@/services/Dom/XMLParser";
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
import { ENCODING } from "@/constants/encoding";
import type { SignerType } from "types/sign/SignerType";
import { PdfTemplateTypes } from "@/services/PDF/PdfTemplateTypes";
import { SIGN_TO_DOC_FRAME_ID, STRING } from "@/constants/string";
import { PROZORRO_TEMPLATE_CODES } from "@/widgets/pq/types/TemplateCodes.enum";
import { FetchTender } from "@/widgets/pq//services/receivingData/FetchTender";
import type { PQContractType } from "@/widgets/pq/types/PQTypes";
import { PROZORRO_PDF_ERROR_CODES } from "@/widgets/ErrorExceptionCore/constants/ERROR_CODES.enum";
import { ObjectDecoder } from "@/utils/ObjectDecoder";
import { FONT_CDN } from "@/constants/env";

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
  private readonly xmlParser = new XMLParser();
  private readonly documentManager = new DocumentManager(this.xmlParser);
  private readonly dataTypeValidator = new DataTypeValidator();
  private readonly pdf = pdfMake as Pdfmake;
  private object?: PdfObjectType;
  private documentType = PROZORRO_PDF_TYPES.TICKET;
  private eds?: EdsInterface;

  init(eds: EdsInterface): void {
    this.eds = eds;

    pdfMake.fonts = {
      Times: {
        normal: `${FONT_CDN}/fonts/Times-New-Roman.ttf`,
        bold: `${FONT_CDN}/fonts/Times-New-Roman-Bold.ttf`,
        italics: `${FONT_CDN}/fonts/Times-New-Roman-Italic.ttf`,
        bolditalics: `${FONT_CDN}/fonts/Times-New-Roman-Bold-Italic.ttf`,
      },
    };
  }

  async setConfig({ url, type }: PdfConfigType): Promise<void | ErrorExceptionCore> {
    try {
      this.documentType = type || this.documentType;

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
    this.dataTypeValidator.validate(config.title, ValidationTypes.STRING);

    const document = await this.create(config);

    try {
      this.pdf.createPdf(document).open();
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
      this.pdf.createPdf(documentFile).getDataUrl(dataUrl => {
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
      this.pdf.createPdf(document).download(`${config.title}.pdf`);
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
      if (this.documentType === PROZORRO_PDF_TYPES.PQ) {
        const signers = [] as SignerType[];
        const dictionaries = await new DictionaryCollector().load(PdfTemplateTypes.PQ);
        this.object = await FetchTender.getTenderForContract(this.object as PQContractType);

        this.documentManager.setDocumentType(PdfTemplateTypes.PQ);

        return this.documentManager.getDocumentData(
          config.contractTemplateName || STRING.EMPTY,
          signers,
          dictionaries,
          STRING.EMPTY,
          this.object
        );
      }

      Assert.isDefined(this.object, ERROR_MESSAGES.VALIDATION_FAILED.undefinedObject);
      Assert.isDefined(this.eds, ERROR_MESSAGES.INVALID_PARAMS.libraryInit, PROZORRO_PDF_ERROR_CODES.INVALID_PARAMS);

      const loaderManager = new LoaderManager(this.base64, axios);
      loaderManager.setLoaderType(this.documentType);
      const { file, type, encoding, url } = await loaderManager.getData(this.object, config);
      let data: string = STRING.EMPTY;
      let signers = [] as SignerType[];

      if (PdfTemplateTypes.EDR === type && url) {
        const response = await axios.get(url);
        data = response.data as string;
      } else if (type !== PdfTemplateTypes.NAZK) {
        ({ data, signers } = await this.getDataFromSign(file, encoding, type));
      } else if (url) {
        ({ data } = await axios.get(url));
        data = JSON.stringify(data);
      }

      if (type === PdfTemplateTypes.COMPLAINT && config.tender) {
        const {
          data: { data: payload },
        }: TenderResponseType = await axios.get(config.tender);
        this.object = payload;
      }

      Assert.isDefined(
        data,
        ERROR_MESSAGES.INVALID_SIGNATURE.documentEncoding,
        PROZORRO_PDF_ERROR_CODES.INVALID_SIGNATURE
      );
      const dictionaries = await new DictionaryCollector().load(type);

      this.documentManager.setDocumentType(type);
      return this.documentManager.getDocumentData(data, signers, dictionaries, url, this.object);
    } catch (error) {
      throw new ErrorExceptionCore(error as Error);
    }
  }

  private async getDataFromSign(
    file: string,
    encoding: ENCODING | undefined,
    type: string
  ): Promise<{ data: any; signers: any }> {
    Assert.isDefined(this.eds, ERROR_MESSAGES.INVALID_PARAMS.libraryInit, PROZORRO_PDF_ERROR_CODES.INVALID_PARAMS);

    try {
      const response = await this.eds.verify(file, encoding);

      if ([PdfTemplateTypes.KVT, PdfTemplateTypes.XML].includes(type as any) && this.tryParseXMLObject(response.data)) {
        return response;
      }

      return {
        signers: response.signers,
        data: JSON.stringify(ObjectDecoder.decode(response.data)),
      };
    } catch (error) {
      throw new ErrorExceptionCore({
        code: PROZORRO_PDF_ERROR_CODES.INVALID_SIGNATURE,
        message: (error as any)?.message,
        originalError: error,
      });
    }
  }

  private tryParseXMLObject(xmlString: string): boolean {
    try {
      const parser = new DOMParser();
      const o = parser.parseFromString(xmlString, "application/xml");
      return Boolean(o && typeof o === "object");
    } catch {
      return false;
    }
  }
}
