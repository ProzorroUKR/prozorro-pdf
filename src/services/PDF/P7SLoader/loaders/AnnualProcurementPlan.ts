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

export class AnnualProcurementPlan
  extends AbstractLoaderStrategy
  implements LoaderStrategyInterface
{
  public async load(
    { documents }: any,
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
      type: PdfTemplateTypes.ANNUAL_PROCUREMENT_PLAN,
    };
  }

  private getDocumentUrl(
    documentList: Array<DocumentType>,
    { date }: PdfDocumentConfigType
  ): string {
    const documents = documentList.filter(
      (doc: Record<string, any>) =>
        doc.title === SIGNATURE_FILE_NAME &&
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
