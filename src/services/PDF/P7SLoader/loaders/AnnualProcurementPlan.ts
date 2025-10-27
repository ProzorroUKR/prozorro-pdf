import { AbstractLoaderStrategy } from "@/services/PDF/P7SLoader/AbstractLoaderStrategy";
import type { LoaderStrategyInterface } from "@/services/PDF/P7SLoader/LoaderStrategyInterface";
import type { PdfDocumentConfigType } from "@/types/pdf/PdfDocumentConfigType";
import { PdfTemplateTypes } from "@/services/PDF/PdfTemplateTypes";
import type { DocumentType } from "@/types/Tender/DocumentType";
import type { P7SLoadResultType } from "@/types/pdf/P7SLoadResultType";
import { Assert } from "@/widgets/ErrorExceptionCore/Assert";
import { ERROR_MESSAGES } from "@/widgets/ErrorExceptionCore/configs/messages";
import { ArrayHandler } from "@/utils/ArrayHandler";
import { SIGNATURE_FILE_NAME } from "@/constants/string";
import { ObjectDecoder } from "@/utils/ObjectDecoder";

export class AnnualProcurementPlan
  extends AbstractLoaderStrategy<Record<any, any>>
  implements LoaderStrategyInterface<Record<any, any>>
{
  public async load({ documents }: any, config: PdfDocumentConfigType): Promise<P7SLoadResultType<Record<any, any>>> {
    Assert.isDefined(documents, ERROR_MESSAGES.VALIDATION_FAILED.documentListUndefined);

    const document = this.getDocument(documents, config);
    const file = await this.getData(document.url);
    const { data, signers } = await this.getDataFromSign(file, config.encoding);

    return {
      url: document.url,
      title: document.title,
      signers: signers || [],
      type: PdfTemplateTypes.ANNUAL_PROCUREMENT_PLAN,
      file: this.unwrapTender(ObjectDecoder.decode<Record<any, any>>(data)),
    };
  }

  private getDocument(documentList: Array<DocumentType>, { date }: PdfDocumentConfigType): DocumentType {
    const documents = documentList.filter(
      (doc: DocumentType) =>
        doc.title === SIGNATURE_FILE_NAME && this.approximateCheckDateModified(doc.dateModified, date)
    );
    const document = ArrayHandler.getLastElement(documents);

    Assert.isDefined(document, ERROR_MESSAGES.VALIDATION_FAILED.undefinedDocumentTitle);

    return document;
  }
}
