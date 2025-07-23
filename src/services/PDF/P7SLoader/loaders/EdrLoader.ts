import type { LoaderStrategyInterface } from "@/services/PDF/P7SLoader/LoaderStrategyInterface";
import { AbstractLoaderStrategy } from "@/services/PDF/P7SLoader/AbstractLoaderStrategy";
import type { P7SLoadResultType } from "@/types/pdf/P7SLoadResultType";
import { ENCODING } from "@/constants/encoding";
import type { PdfDocumentConfigType } from "@/types/pdf/PdfDocumentConfigType";
import { PdfTemplateTypes } from "@/services/PDF/PdfTemplateTypes";
import type { DocumentType } from "@/types/Tender/DocumentType";
import type { AwardType } from "@/types/Tender/AwardType";
import { Assert } from "@/widgets/ErrorExceptionCore/Assert";
import { ERROR_MESSAGES } from "@/widgets/ErrorExceptionCore/configs/messages";
import { EDR_DOCUMENT_TYPE, EDR_TITLE } from "@/constants/edr";
import { ErrorExceptionCore } from "@/widgets/ErrorExceptionCore/ErrorExceptionCore";
import { ERROR_CODES } from "@/widgets/ErrorExceptionCore/constants/ERROR_CODES.enum";

export class EdrLoader
  extends AbstractLoaderStrategy
  implements LoaderStrategyInterface
{
  async load(
    { documents }: AwardType,
    config: PdfDocumentConfigType
  ): Promise<P7SLoadResultType> {
    Assert.isDefined(
      documents,
      ERROR_MESSAGES.VALIDATION_FAILED.documentListUndefined
    );

    const url = this._getDocumentUrl(documents, config);
    const file = await this.getData(url);

    return {
      url,
      file,
      type: PdfTemplateTypes.EDR,
      encoding: ENCODING.UTF_16,
    };
  }

  private _getDocumentUrl(
    documents: DocumentType[],
    { date, title }: PdfDocumentConfigType
  ): string {
    const documentsFilteredByDateModified = documents.filter(
      ({ dateModified }: DocumentType) =>
        this.approximateCheckDateModified(dateModified, date)
    );

    if (!documentsFilteredByDateModified.length) {
      throw new ErrorExceptionCore({
        code: ERROR_CODES.VALIDATION_FAILED,
        message: ERROR_MESSAGES.VALIDATION_FAILED.wrongDocumentDate,
      });
    }

    const documentsRegisterExtractType = documentsFilteredByDateModified.filter(
      ({ documentType }: DocumentType) => documentType === EDR_DOCUMENT_TYPE
    );

    if (!documentsRegisterExtractType.length) {
      throw new ErrorExceptionCore({
        code: ERROR_CODES.VALIDATION_FAILED,
        message: ERROR_MESSAGES.VALIDATION_FAILED.wrongEdrDocumentType,
      });
    }

    const document = documentsRegisterExtractType.find(doc =>
      [title, EDR_TITLE].includes(doc.title)
    );

    if (!document) {
      Assert.isDefined(
        document,
        ERROR_MESSAGES.VALIDATION_FAILED.undefinedDocumentTitle
      );
    }

    return document.url;
  }
}
