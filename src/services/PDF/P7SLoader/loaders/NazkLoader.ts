import { ArrayHandler } from "@/utils/ArrayHandler";
import type { AwardType } from "@/types/Tender/AwardType";
import { Assert } from "@/widgets/ErrorExceptionCore/Assert";
import { NAZK_DOCUMENT_TYPE, NAZK_TITLE } from "@/constants/nazk";
import { PdfTemplateTypes } from "@/services/PDF/PdfTemplateTypes";
import type { P7SLoadResultType } from "@/types/pdf/P7SLoadResultType";
import { ERROR_MESSAGES } from "@/widgets/ErrorExceptionCore/configs/messages";
import { AbstractLoaderStrategy } from "@/services/PDF/P7SLoader/AbstractLoaderStrategy";
import type { LoaderStrategyInterface } from "@/services/PDF/P7SLoader/LoaderStrategyInterface";

export class NazkLoader extends AbstractLoaderStrategy<string> implements LoaderStrategyInterface<string> {
  public async load(object: AwardType): Promise<P7SLoadResultType<string>> {
    const url = this.getDocumentUrl(object);
    const { data } = await this.axios.get(url);

    return {
      url,
      file: data,
      signers: [],
      type: PdfTemplateTypes.NAZK,
    };
  }

  private getDocumentUrl(award: AwardType): string {
    if (award) {
      const { documents } = award;

      Assert.isDefined(documents, ERROR_MESSAGES.VALIDATION_FAILED.documentListUndefined);

      const awardDocuments = documents.filter(
        (doc: Record<string, any>) => doc.title === NAZK_TITLE && doc.documentType === NAZK_DOCUMENT_TYPE
      );

      const document = ArrayHandler.getLastElement(awardDocuments);

      Assert.isDefined(document, ERROR_MESSAGES.VALIDATION_FAILED.undefinedDocumentTitle);

      return document.hasOwnProperty("url") ? document.url : "";
    }

    return "";
  }
}
