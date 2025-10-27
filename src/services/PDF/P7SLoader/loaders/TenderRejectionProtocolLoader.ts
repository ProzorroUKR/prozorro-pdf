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
import { AwardStatus } from "@/types/Tender/AwardType";
import { ErrorExceptionCore } from "@/widgets/ErrorExceptionCore/ErrorExceptionCore";
import { PROZORRO_PDF_ERROR_CODES } from "@/widgets/ErrorExceptionCore/constants/ERROR_CODES.enum";
import { ObjectDecoder } from "@/utils/ObjectDecoder";

export class TenderRejectionProtocolLoader
  extends AbstractLoaderStrategy<Record<any, any>>
  implements LoaderStrategyInterface<Record<any, any>>
{
  public async load(object: AwardType, config: PdfDocumentConfigType): Promise<P7SLoadResultType<Record<any, any>>> {
    const { documents, status, eligible, qualified } = object;

    Assert.isDefined(status, ERROR_MESSAGES.VALIDATION_FAILED.undefinedStatus);
    Assert.isDefined(documents, ERROR_MESSAGES.VALIDATION_FAILED.documentListUndefined);

    if (![AwardStatus.UNSUCCESSFUL, AwardStatus.CANCELLED].includes(status)) {
      throw new ErrorExceptionCore({
        code: PROZORRO_PDF_ERROR_CODES.VALIDATION_FAILED,
        message: ERROR_MESSAGES.VALIDATION_FAILED.awardStatusNotFind,
      });
    }

    if (status === AwardStatus.CANCELLED && eligible && qualified) {
      throw new ErrorExceptionCore({
        code: PROZORRO_PDF_ERROR_CODES.VALIDATION_FAILED,
        message: ERROR_MESSAGES.VALIDATION_FAILED.wrongEligibleOrQualified,
      });
    }

    const document = this.getDocument(documents, config);
    const file = await this.getData(document.url);
    const { data, signers } = await this.getDataFromSign(file, config.encoding);

    return {
      url: document.url,
      title: document.title,
      signers: signers || [],
      type: PdfTemplateTypes.TENDER_REJECTION_PROTOCOL_TEMPLATE,
      file: this.unwrapTender(ObjectDecoder.decode<Record<any, any>>(data)),
    };
  }

  private getDocument(documentList: DocumentType[], { date }: PdfDocumentConfigType): DocumentType {
    const documents = documentList.filter(
      (doc: Record<string, any>) =>
        doc.documentType === "notice" && this.approximateCheckDateModified(doc.dateModified, date)
    );
    const document = ArrayHandler.getLastElement(documents);

    Assert.isDefined(document, ERROR_MESSAGES.VALIDATION_FAILED.undefinedDocumentTitle);

    return document;
  }
}
