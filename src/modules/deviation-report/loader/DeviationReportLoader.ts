import type { LoaderStrategyInterface } from "@/services/PDF/P7SLoader/LoaderStrategyInterface";
import { AbstractLoaderStrategy } from "@/services/PDF/P7SLoader/AbstractLoaderStrategy";
import type { P7SLoadResultType } from "@/types/pdf/P7SLoadResultType";
import type { PdfDocumentConfigType } from "@/types/pdf/PdfDocumentConfigType";
import { PdfTemplateTypes } from "@/services/PDF/PdfTemplateTypes";
import type { DocumentType } from "@/types/Tender/DocumentType";
import type { AwardType } from "@/types/Tender/AwardType";
import { Assert } from "@/widgets/ErrorExceptionCore/Assert";
import { ERROR_MESSAGES } from "@/widgets/ErrorExceptionCore/configs/messages";
import { ErrorExceptionCore } from "@/widgets/ErrorExceptionCore/ErrorExceptionCore";
import { PROZORRO_PDF_ERROR_CODES } from "@/widgets/ErrorExceptionCore/constants/ERROR_CODES.enum";
import type { QualificationsType } from "@/types/ProtocolConsiderationTenderOffers/Qualifications";
import { ArrayHandler } from "@/utils/ArrayHandler";
import { ObjectDecoder } from "@/utils/ObjectDecoder";

export class DeviationReportLoader
  extends AbstractLoaderStrategy<{ tender: Record<any, any>; data: AwardType | QualificationsType }>
  implements LoaderStrategyInterface<{ tender: Record<any, any>; data: AwardType | QualificationsType }>
{
  async load(
    { documents }: AwardType | QualificationsType,
    config: PdfDocumentConfigType
  ): Promise<P7SLoadResultType<{ tender: Record<any, any>; data: AwardType | QualificationsType }>> {
    Assert.isDefined(documents, ERROR_MESSAGES.VALIDATION_FAILED.documentListUndefined);

    const { url, title } = this._getDocument(documents, config);
    const file = await this.getData(url);
    const { data, signers } = await this.getDataFromSign(file, config.encoding);

    return {
      url,
      title,
      signers,
      type: PdfTemplateTypes.DEVIATION_REPORT,
      file: {
        tender: this.unwrapTender(ObjectDecoder.decode<Record<any, any>>(data)),
        data: this.unwrapTender(ObjectDecoder.decode<Record<any, any>>(data), true) as AwardType | QualificationsType,
      },
    };
  }

  private _getDocument(documents: DocumentType[], { date }: PdfDocumentConfigType): DocumentType {
    const documentsFilteredByDateModified = documents.filter(({ dateModified }: DocumentType) =>
      this.approximateCheckDateModified(dateModified, date)
    );

    if (!documentsFilteredByDateModified.length) {
      throw new ErrorExceptionCore({
        code: PROZORRO_PDF_ERROR_CODES.VALIDATION_FAILED,
        message: ERROR_MESSAGES.VALIDATION_FAILED.wrongDocumentDate,
      });
    }

    const documentsDeviationReportType = documentsFilteredByDateModified.filter(
      ({ documentType }: DocumentType) => documentType === "deviationReport"
    );

    if (!documentsDeviationReportType.length) {
      throw new ErrorExceptionCore({
        code: PROZORRO_PDF_ERROR_CODES.VALIDATION_FAILED,
        message: ERROR_MESSAGES.VALIDATION_FAILED.wrongEdrDocumentType,
      });
    }

    const document: DocumentType | undefined = ArrayHandler.getLastElement(documentsDeviationReportType);

    Assert.isDefined(document, ERROR_MESSAGES.VALIDATION_FAILED.undefinedDocumentTitle);

    return document;
  }
}
