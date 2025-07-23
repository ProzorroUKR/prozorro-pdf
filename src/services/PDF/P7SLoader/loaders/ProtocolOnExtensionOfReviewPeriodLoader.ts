import type { LoaderStrategyInterface } from "@/services/PDF/P7SLoader/LoaderStrategyInterface";
import { AbstractLoaderStrategy } from "@/services/PDF/P7SLoader/AbstractLoaderStrategy";
import type { P7SLoadResultType } from "@/types/pdf/P7SLoadResultType";
import { ERROR_MESSAGES } from "@/widgets/ErrorExceptionCore/configs/messages";
import { Assert } from "@/widgets/ErrorExceptionCore/Assert";
import type { PdfDocumentConfigType } from "@/types/pdf/PdfDocumentConfigType";
import { PdfTemplateTypes } from "@/services/PDF/PdfTemplateTypes";
import { ArrayHandler } from "@/utils/ArrayHandler";
import type { DocumentType } from "@/types/Tender/DocumentType";
import type { AwardType } from "@/types/Tender/AwardType";

export class ProtocolOnExtensionOfReviewPeriodLoader
  extends AbstractLoaderStrategy
  implements LoaderStrategyInterface
{
  public async load(
    { documents }: AwardType,
    config: PdfDocumentConfigType
  ): Promise<P7SLoadResultType> {
    Assert.isDefined(
      documents,
      ERROR_MESSAGES.VALIDATION_FAILED.documentListUndefined
    );

    const url = this.getDocumentUrl(documents, config);
    const file = await this.getData(url);

    return {
      url,
      file,
      encoding: config.encoding,
      type: PdfTemplateTypes.PROTOCOL_ON_EXTENSION_OF_REVIEW_PERIOD_TEMPLATE,
    };
  }

  private getDocumentUrl(
    documentList: DocumentType[],
    { date }: PdfDocumentConfigType
  ): string {
    const documents = documentList.filter(
      (doc: Record<string, any>) =>
        doc.documentType === "extensionReport" &&
        this.approximateCheckDateModified(doc.dateModified, date)
    );
    const document = ArrayHandler.getLastElement(documents);
    Assert.isDefined(
      document,
      ERROR_MESSAGES.VALIDATION_FAILED.undefinedDocumentTitle
    );

    return document.url;
  }
}
