import type { LoaderStrategyInterface } from "@/services/PDF/P7SLoader/LoaderStrategyInterface";
import { AbstractLoaderStrategy } from "@/services/PDF/P7SLoader/AbstractLoaderStrategy";
import type { P7SLoadResultType } from "@/types/pdf/P7SLoadResultType";
import type { PdfDocumentConfigType } from "@/types/pdf/PdfDocumentConfigType";
import type { PdfObjectType } from "@/types/pdf/PdfObjectType";
import { PdfTemplateTypes } from "@/services/PDF/PdfTemplateTypes";
import type { DocumentType } from "@/types/Tender/DocumentType";
import { Assert } from "@/widgets/ErrorExceptionCore/Assert";
import { ERROR_MESSAGES } from "@/widgets/ErrorExceptionCore/configs/messages";
import { ErrorExceptionCore } from "@/widgets/ErrorExceptionCore/ErrorExceptionCore";
import { PROZORRO_PDF_ERROR_CODES } from "@/widgets/ErrorExceptionCore/constants/ERROR_CODES.enum";
import { ArrayHandler } from "@/utils/ArrayHandler";
import { ObjectDecoder } from "@/utils/ObjectDecoder";
import { TERMINATION_REPORT_DOCUMENT_TYPE } from "@/modules/termination-report/constants/terminationReport";
import type {
  TerminationContract,
  TerminationDetails,
  TerminationReportFile,
} from "@/modules/termination-report/types";

export class TerminationReportLoader
  extends AbstractLoaderStrategy<TerminationReportFile>
  implements LoaderStrategyInterface<TerminationReportFile>
{
  async load(object: PdfObjectType, config: PdfDocumentConfigType): Promise<P7SLoadResultType<TerminationReportFile>> {
    const contract = object as TerminationContract;
    const documents: DocumentType[] | undefined = contract?.terminationDetails?.documents;

    Assert.isDefined(documents, ERROR_MESSAGES.VALIDATION_FAILED.documentListUndefined);

    const { url, title } = this._getDocument(documents, config);
    const { data, signers } = await this.verifySign({ signUrl: url }, config.encoding);

    const decoded = ObjectDecoder.decode<{ data?: TerminationDetails; context?: { contract?: TerminationContract } }>(
      data
    );

    return {
      url,
      title,
      signers,
      type: PdfTemplateTypes.TERMINATION_REPORT,
      file: {
        terminationDetails: decoded?.data ?? {},
        contract: decoded?.context?.contract ?? {},
      },
    };
  }

  private _getDocument(documents: DocumentType[], { date }: PdfDocumentConfigType): DocumentType {
    const terminationReports = documents.filter(
      ({ documentType }: DocumentType) => documentType === TERMINATION_REPORT_DOCUMENT_TYPE
    );

    if (!terminationReports.length) {
      throw new ErrorExceptionCore({
        code: PROZORRO_PDF_ERROR_CODES.VALIDATION_FAILED,
        message: ERROR_MESSAGES.VALIDATION_FAILED.wrongDocumentType,
      });
    }

    const document: DocumentType | undefined = ArrayHandler.getLastElement(
      terminationReports.filter(({ dateModified }: DocumentType) =>
        this.approximateCheckDateModified(dateModified, date)
      )
    );

    Assert.isDefined(document, ERROR_MESSAGES.VALIDATION_FAILED.undefinedDocumentTitle);

    return document;
  }
}
