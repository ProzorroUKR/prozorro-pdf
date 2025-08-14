import type { LoaderStrategyInterface } from "@/services/PDF/P7SLoader/LoaderStrategyInterface";
import { AbstractLoaderStrategy } from "@/services/PDF/P7SLoader/AbstractLoaderStrategy";
import type { P7SLoadResultType } from "@/types/pdf/P7SLoadResultType";
import { ERROR_MESSAGES } from "@/widgets/ErrorExceptionCore/configs/messages";
import { Assert } from "@/widgets/ErrorExceptionCore/Assert";
import type { PdfDocumentConfigType } from "@/types/pdf/PdfDocumentConfigType";
import { PdfTemplateTypes } from "@/services/PDF/PdfTemplateTypes";
import type { DocumentType } from "@/types/Tender/DocumentType";
import { ErrorExceptionCore } from "@/widgets/ErrorExceptionCore/ErrorExceptionCore";
import { SIGNATURE_FILE_NAME } from "@/constants/string";
import { PROZORRO_PDF_ERROR_CODES } from "@/widgets/ErrorExceptionCore/constants/ERROR_CODES.enum";

export class ProtocolConsiderationTenderOffersLoader extends AbstractLoaderStrategy implements LoaderStrategyInterface {
  public async load(document: DocumentType, config: PdfDocumentConfigType): Promise<P7SLoadResultType> {
    const { title, documentType, url, dateModified } = document;
    const { date } = config;

    Assert.isDefined(title, ERROR_MESSAGES.VALIDATION_FAILED.documentListUndefined);
    Assert.isDefined(documentType, ERROR_MESSAGES.VALIDATION_FAILED.wrongDocumentType);

    if (documentType !== "evaluationReports") {
      throw new ErrorExceptionCore({
        code: PROZORRO_PDF_ERROR_CODES.VALIDATION_FAILED,
        message: ERROR_MESSAGES.VALIDATION_FAILED.wrongDocumentTypeStatus,
      });
    }

    if (title !== SIGNATURE_FILE_NAME) {
      throw new ErrorExceptionCore({
        code: PROZORRO_PDF_ERROR_CODES.VALIDATION_FAILED,
        message: ERROR_MESSAGES.VALIDATION_FAILED.wrongDocumentTitle,
      });
    }

    if (!this.approximateCheckDateModified(dateModified, date)) {
      throw new ErrorExceptionCore({
        code: PROZORRO_PDF_ERROR_CODES.VALIDATION_FAILED,
        message: ERROR_MESSAGES.VALIDATION_FAILED.wrongDocumentDate,
      });
    }

    Assert.isDefined(document, ERROR_MESSAGES.VALIDATION_FAILED.undefinedDocumentTitle);

    const file = await this.getData(url);
    return {
      url,
      file,
      encoding: config.encoding,
      type: PdfTemplateTypes.PROTOCOL_CONSIDERATION_TENDER_OFFERS_TEMPLATE,
    };
  }
}
