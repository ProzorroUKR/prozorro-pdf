import type { LoaderStrategyInterface } from "@/services/PDF/P7SLoader/LoaderStrategyInterface";
import type { IBase64 } from "@/utils/Base64";
import type { P7SLoadResultType } from "@/types/pdf/P7SLoadResultType";
import type { PdfDocumentConfigType } from "@/types/pdf/PdfDocumentConfigType";
import { ErrorExceptionCore } from "@/widgets/ErrorExceptionCore/ErrorExceptionCore";
import { ERROR_MESSAGES } from "@/widgets/ErrorExceptionCore/configs/messages";
import type { PdfObjectType } from "@/types/pdf/PdfObjectType";
import type { AxiosResponse, AxiosStatic } from "axios";
import { PROZORRO_PDF_ERROR_CODES } from "@/widgets/ErrorExceptionCore/constants/ERROR_CODES.enum";
import type { EdsInterface } from "services/EdsInterface";
import { ENCODING } from "@/constants/encoding";
import { Assert } from "@/widgets/ErrorExceptionCore/Assert";
import { DataTypeValidator } from "@/services/DataTypeValidator/DataTypeValidator.ts";

export abstract class AbstractLoaderStrategy<DataType> implements LoaderStrategyInterface<DataType> {
  readonly _dataTypeValidator = new DataTypeValidator();

  constructor(
    protected readonly base64: IBase64,
    protected readonly axios: AxiosStatic,
    protected readonly eds: EdsInterface
  ) {}

  protected async getData(url: string): Promise<string> {
    try {
      const { data }: AxiosResponse = await this.axios.get(url, {
        responseType: "blob",
      });

      return await this.base64.encode(data);
    } catch {
      throw new ErrorExceptionCore({
        code: PROZORRO_PDF_ERROR_CODES.INVALID_SIGNATURE,
        message: ERROR_MESSAGES.INVALID_SIGNATURE.documentAccess,
      });
    }
  }

  protected approximateCheckDateModified(dateModified?: string, documentDate?: string): boolean {
    return documentDate && dateModified ? dateModified.slice(0, documentDate.length) === documentDate : true;
  }

  protected async getDataFromSign(file: string, encoding: ENCODING | undefined): Promise<{ data: any; signers: any }> {
    Assert.isDefined(this.eds, ERROR_MESSAGES.INVALID_PARAMS.libraryInit, PROZORRO_PDF_ERROR_CODES.INVALID_PARAMS);

    try {
      return await this.eds.verify(file, encoding);
    } catch (error) {
      throw new ErrorExceptionCore({
        code: PROZORRO_PDF_ERROR_CODES.INVALID_SIGNATURE,
        message: (error as Error).message,
        originalError: error,
      });
    }
  }

  // checkup for different input data from api for response with data and without data inside general object
  protected unwrapTender<DataType>(rawData: Record<any, any>, getData = false): Record<string, any> | DataType {
    if (rawData.hasOwnProperty("context") && !getData) {
      return rawData?.context?.tender as Record<string, any>;
    }

    if (rawData.hasOwnProperty("data")) {
      return rawData?.data as Record<string, any>;
    }

    return rawData;
  }

  abstract load(object: PdfObjectType, config: PdfDocumentConfigType): Promise<P7SLoadResultType<DataType>>;
}
