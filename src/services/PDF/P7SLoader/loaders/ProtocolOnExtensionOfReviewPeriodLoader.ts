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
import { ObjectDecoder } from "@/utils/ObjectDecoder";

export class ProtocolOnExtensionOfReviewPeriodLoader
  extends AbstractLoaderStrategy<Record<any, any>>
  implements LoaderStrategyInterface<Record<any, any>>
{
  public async load(
    { documents }: AwardType,
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
      file: this.unwrapTender(ObjectDecoder.decode<Record<any, any>>(data)),
      type: PdfTemplateTypes.PROTOCOL_ON_EXTENSION_OF_REVIEW_PERIOD_TEMPLATE,
    };
  }

  private getDocument(documentList: DocumentType[], { date }: PdfDocumentConfigType): DocumentType {
    const documents = documentList.filter(
      (doc: DocumentType) =>
        doc.documentType === "extensionReport" && this.approximateCheckDateModified(doc.dateModified, date)
    );
    const document = ArrayHandler.getLastElement(documents);
    Assert.isDefined(document, ERROR_MESSAGES.VALIDATION_FAILED.undefinedDocumentTitle);

    return document;
  }
}
