import type { LoaderStrategyInterface } from "@/services/PDF/P7SLoader/LoaderStrategyInterface";
import type { IBase64 } from "@/utils/Base64";
import type { P7SLoadResultType } from "@/types/pdf/P7SLoadResultType";
import type { PdfDocumentConfigType } from "@/types/pdf/PdfDocumentConfigType";
import { ErrorExceptionCore } from "@/widgets/ErrorExceptionCore/ErrorExceptionCore";
import { ERROR_MESSAGES } from "@/widgets/ErrorExceptionCore/configs/messages";
import type { PdfObjectType } from "@/types/pdf/PdfObjectType";
import type { AxiosResponse, AxiosStatic } from "axios";
import { ERROR_CODES } from "@/widgets/ErrorExceptionCore/constants/ERROR_CODES.enum";

export abstract class AbstractLoaderStrategy
  implements LoaderStrategyInterface
{
  constructor(
    protected readonly base64: IBase64,
    private readonly axios: AxiosStatic
  ) {}

  protected async getData(url: string): Promise<string> {
    try {
      const { data }: AxiosResponse = await this.axios.get(url, {
        responseType: "blob",
      });

      return await this.base64.encode(data);
    } catch {
      throw new ErrorExceptionCore({
        code: ERROR_CODES.INVALID_SIGNATURE,
        message: ERROR_MESSAGES.INVALID_SIGNATURE.documentAccess,
      });
    }
  }

  protected checkDateModified(
    dateModified?: string,
    documentDate?: string
  ): boolean {
    return documentDate && dateModified ? documentDate === dateModified : true;
  }

  protected approximateCheckDateModified(
    dateModified?: string,
    documentDate?: string
  ): boolean {
    return documentDate && dateModified
      ? dateModified.slice(0, documentDate.length) === documentDate
      : true;
  }

  abstract load(
    object: PdfObjectType,
    config: PdfDocumentConfigType
  ): Promise<P7SLoadResultType>;
}
