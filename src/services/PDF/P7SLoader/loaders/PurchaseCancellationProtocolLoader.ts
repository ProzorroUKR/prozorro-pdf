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
import { ObjectDecoder } from "@/utils/ObjectDecoder";
import type { DocumentType } from "@/types/Tender/DocumentType.ts";

export class PurchaseCancellationProtocolLoader
  extends AbstractLoaderStrategy<Record<any, any>>
  implements LoaderStrategyInterface<Record<any, any>>
{
  public async load(
    { documents }: CancellationType,
    config: PdfDocumentConfigType
  ): Promise<P7SLoadResultType<Record<any, any>>> {
    Assert.isDefined(documents, ERROR_MESSAGES.VALIDATION_FAILED.documentListUndefined);

    const { url, title } = this.getDocument(documents, config);
    const file = await this.getData(url);
    const { data, signers } = await this.getDataFromSign(file, config.encoding);

    return {
      url,
      title,
      signers: signers || [],
      type: PdfTemplateTypes.PURCHASE_CANCELLATION_PROTOCOL_TEMPLATE,
      file: this.unwrapTender(ObjectDecoder.decode<Record<any, any>>(data)),
    };
  }

  private getDocument(documents: DocumentType[], { date }: PdfDocumentConfigType): DocumentType {
    Assert.isDefined(documents, ERROR_MESSAGES.VALIDATION_FAILED.documentListUndefined);

    const list = documents.filter(
      (doc: DocumentType) =>
        doc.title === SIGNATURE_FILE_NAME && this.approximateCheckDateModified(doc.dateModified, date)
    );
    const document = ArrayHandler.getLastElement(list);

    Assert.isDefined(document, ERROR_MESSAGES.VALIDATION_FAILED.undefinedDocumentTitle);

    return document;
  }
}
