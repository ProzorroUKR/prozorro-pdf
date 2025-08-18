import type { LoaderStrategyInterface } from "@/services/PDF/P7SLoader/LoaderStrategyInterface";
import { AbstractLoaderStrategy } from "@/services/PDF/P7SLoader/AbstractLoaderStrategy";
import type { P7SLoadResultType } from "@/types/pdf/P7SLoadResultType";
import { ERROR_MESSAGES } from "@/widgets/ErrorExceptionCore/configs/messages";
import { Assert } from "@/widgets/ErrorExceptionCore/Assert";
import type { PdfDocumentConfigType } from "@/types/pdf/PdfDocumentConfigType";
import { PdfTemplateTypes } from "@/services/PDF/PdfTemplateTypes";
import { ArrayHandler } from "@/utils/ArrayHandler";
import type { BidType } from "@/types/TenderOffer/Tender";
import { ErrorExceptionCore } from "@/widgets/ErrorExceptionCore/ErrorExceptionCore";
import { PROZORRO_PDF_ERROR_CODES } from "@/widgets/ErrorExceptionCore/constants/ERROR_CODES.enum";
import { ObjectDecoder } from "@/utils/ObjectDecoder";

export class TenderOfferLoader
  extends AbstractLoaderStrategy<Record<any, any>>
  implements LoaderStrategyInterface<Record<any, any>>
{
  public async load(object: BidType, config: PdfDocumentConfigType): Promise<P7SLoadResultType<Record<any, any>>> {
    const { documents, financialDocuments } = object;
    const allDocuments = [...(documents ?? []), ...(financialDocuments ?? [])];

    if (!allDocuments.length) {
      throw new ErrorExceptionCore({
        code: PROZORRO_PDF_ERROR_CODES.VALIDATION_FAILED,
        message: ERROR_MESSAGES.VALIDATION_FAILED.documentListUndefined,
      });
    }

    const url = this.getDocumentUrl(allDocuments, config);
    const file = await this.getData(url);
    const { data, signers } = await this.getDataFromSign(file, config.encoding);

    return {
      url,
      signers: signers || [],
      type: PdfTemplateTypes.TENDER_OFFER_TEMPLATE,
      file: {
        tender: this.unwrapTender(ObjectDecoder.decode<Record<any, any>>(data)),
        bidData: this.unwrapTender(ObjectDecoder.decode<Record<any, any>>(data), true),
      },
    };
  }

  private getDocumentUrl(documents: Record<string, any>, { date }: PdfDocumentConfigType): string {
    Assert.isDefined(documents, ERROR_MESSAGES.VALIDATION_FAILED.documentListUndefined);

    const list = documents.filter(
      (doc: Record<string, string>) =>
        doc.documentType === "proposal" && this.approximateCheckDateModified(doc.dateModified, date)
    );
    const document: Record<string, any> | undefined = ArrayHandler.getLastElement(list);

    Assert.isDefined(document, ERROR_MESSAGES.VALIDATION_FAILED.undefinedDocumentTitle);

    return document.url as string;
  }
}
