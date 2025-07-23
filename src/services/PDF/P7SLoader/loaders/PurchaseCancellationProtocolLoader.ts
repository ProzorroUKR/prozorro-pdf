import type { LoaderStrategyInterface } from "@/services/PDF/P7SLoader/LoaderStrategyInterface";
import { AbstractLoaderStrategy } from "@/services/PDF/P7SLoader/AbstractLoaderStrategy";
import type { P7SLoadResultType } from "@/types/pdf/P7SLoadResultType";
import { ERROR_MESSAGES } from "@/widgets/ErrorExceptionCore/configs/messages";
import { Assert } from "@/widgets/ErrorExceptionCore/Assert";
import type { PdfDocumentConfigType } from "@/types/pdf/PdfDocumentConfigType";
import { PdfTemplateTypes } from "@/services/PDF/PdfTemplateTypes";
import { ArrayHandler } from "@/utils/ArrayHandler";
import type { CancellationType } from "@/types/PurchaseCancellation/PurchaseCancellationTypes";
import { SIGNATURE_FILE_NAME } from "@/constants/string";

export class PurchaseCancellationProtocolLoader
  extends AbstractLoaderStrategy
  implements LoaderStrategyInterface
{
  public async load(
    { documents }: CancellationType,
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
      type: PdfTemplateTypes.PURCHASE_CANCELLATION_PROTOCOL_TEMPLATE,
    };
  }

  private getDocumentUrl(
    documents: Record<string, any>,
    { date }: PdfDocumentConfigType
  ): string {
    Assert.isDefined(
      documents,
      ERROR_MESSAGES.VALIDATION_FAILED.documentListUndefined
    );

    const list = documents.filter(
      (doc: Record<string, string>) =>
        doc.title === SIGNATURE_FILE_NAME &&
        this.approximateCheckDateModified(doc.dateModified, date)
    );
    const document: Record<string, any> | undefined =
      ArrayHandler.getLastElement(list);

    Assert.isDefined(
      document,
      ERROR_MESSAGES.VALIDATION_FAILED.undefinedDocumentTitle
    );

    return document.url as string;
  }
}
