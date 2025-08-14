import type { LoaderStrategyInterface } from "@/services/PDF/P7SLoader/LoaderStrategyInterface";
import { AbstractLoaderStrategy } from "@/services/PDF/P7SLoader/AbstractLoaderStrategy";
import type { P7SLoadResultType } from "@/types/pdf/P7SLoadResultType";
import { ERROR_MESSAGES } from "@/widgets/ErrorExceptionCore/configs/messages";
import { Assert } from "@/widgets/ErrorExceptionCore/Assert";
import type { PdfDocumentConfigType } from "@/types/pdf/PdfDocumentConfigType";
import { PdfTemplateTypes } from "@/services/PDF/PdfTemplateTypes";
import { ArrayHandler } from "@/utils/ArrayHandler";
import { AwardStatus } from "@/types/Tender/AwardType";
import type { AwardType } from "@/types/Tender/AwardType";
import { ErrorExceptionCore } from "@/widgets/ErrorExceptionCore/ErrorExceptionCore";
import type { DocumentType } from "@/types/Tender/DocumentType";
import { PROZORRO_PDF_ERROR_CODES } from "@/widgets/ErrorExceptionCore/constants/ERROR_CODES.enum";

export class DeterminingWinnerOfProcurementLoader extends AbstractLoaderStrategy implements LoaderStrategyInterface {
  public async load(
    { documents, status, qualified, eligible }: AwardType,
    config: PdfDocumentConfigType
  ): Promise<P7SLoadResultType> {
    Assert.isDefined(status, ERROR_MESSAGES.VALIDATION_FAILED.undefinedStatus);
    Assert.isDefined(documents, ERROR_MESSAGES.VALIDATION_FAILED.documentListUndefined);

    if (![AwardStatus.ACTIVE, AwardStatus.CANCELLED].includes(status)) {
      throw new ErrorExceptionCore({
        code: PROZORRO_PDF_ERROR_CODES.VALIDATION_FAILED,
        message: ERROR_MESSAGES.VALIDATION_FAILED.awardStatusNotFind,
      });
    }

    if (status === AwardStatus.CANCELLED) {
      if (eligible === false) {
        throw new ErrorExceptionCore({
          code: PROZORRO_PDF_ERROR_CODES.VALIDATION_FAILED,
          message: ERROR_MESSAGES.VALIDATION_FAILED.wrongEligible,
        });
      }

      if (qualified !== true) {
        throw new ErrorExceptionCore({
          code: PROZORRO_PDF_ERROR_CODES.VALIDATION_FAILED,
          message: ERROR_MESSAGES.VALIDATION_FAILED.wrongQualified,
        });
      }
    }

    const url = this.getDocumentUrl(documents, config);
    const file = await this.getData(url);
    return {
      url,
      file,
      encoding: config.encoding,
      type: PdfTemplateTypes.DETERMINING_WINNER_OF_PROCUREMENT_TEMPLATE,
    };
  }

  private getDocumentUrl(documentList: DocumentType[], { date }: PdfDocumentConfigType): string {
    const documents = documentList.filter(
      (doc: Record<string, any>) =>
        doc.documentType === "notice" && this.approximateCheckDateModified(doc.dateModified, date)
    );
    const document = ArrayHandler.getLastElement(documents);

    Assert.isDefined(document, ERROR_MESSAGES.VALIDATION_FAILED.undefinedDocumentTitle);

    return document.url;
  }
}
