import type { LoaderStrategyInterface } from "@/services/PDF/P7SLoader/LoaderStrategyInterface";
import { AbstractLoaderStrategy } from "@/services/PDF/P7SLoader/AbstractLoaderStrategy";
import type { P7SLoadResultType } from "@/types/pdf/P7SLoadResultType";
import { ERROR_MESSAGES } from "@/widgets/ErrorExceptionCore/configs/messages";
import { Assert } from "@/widgets/ErrorExceptionCore/Assert";
import type { PdfDocumentConfigType } from "@/types/pdf/PdfDocumentConfigType";
import { PdfTemplateTypes } from "@/services/PDF/PdfTemplateTypes";
import { ArrayHandler } from "@/utils/ArrayHandler";
import { NAZK_DOCUMENT_TYPE, NAZK_TITLE } from "@/constants/nazk";
import type { AwardType } from "@/types/Tender/AwardType";

export class NazkLoader
  extends AbstractLoaderStrategy
  implements LoaderStrategyInterface
{
  public async load(
    object: AwardType,
    config: PdfDocumentConfigType
  ): Promise<P7SLoadResultType> {
    const url = this.getDocumentUrl(object);
    const file = await this.getData(url);
    return {
      url,
      file,
      type: PdfTemplateTypes.NAZK,
      encoding: config.encoding,
    };
  }

  private getDocumentUrl(award: AwardType): string {
    if (award) {
      const { documents } = award;

      Assert.isDefined(
        documents,
        ERROR_MESSAGES.VALIDATION_FAILED.documentListUndefined
      );

      const awardDocuments = documents.filter(
        (doc: Record<string, any>) =>
          doc.title === NAZK_TITLE && doc.documentType === NAZK_DOCUMENT_TYPE
      );

      const document = ArrayHandler.getLastElement(awardDocuments);

      Assert.isDefined(
        document,
        ERROR_MESSAGES.VALIDATION_FAILED.undefinedDocumentTitle
      );

      return document.hasOwnProperty("url") ? document.url : "";
    }

    return "";
  }
}
