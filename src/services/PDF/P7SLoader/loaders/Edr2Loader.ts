import YAML from "yaml";
import axios from "axios";
import { ArrayHandler } from "@/utils/ArrayHandler";
import type { LoaderStrategyInterface } from "@/services/PDF/P7SLoader/LoaderStrategyInterface";
import { AbstractLoaderStrategy } from "@/services/PDF/P7SLoader/AbstractLoaderStrategy";
import type { P7SLoadResultType } from "@/types/pdf/P7SLoadResultType";
import type { PdfDocumentConfigType } from "@/types/pdf/PdfDocumentConfigType";
import { PdfTemplateTypes } from "@/services/PDF/PdfTemplateTypes";
import type { DocumentType } from "@/types/Tender/DocumentType";
import type { AwardType } from "@/types/Tender/AwardType";
import type { QualificationsType } from "@/types/ProtocolConsiderationTenderOffers/Qualifications";
import { Assert } from "@/widgets/ErrorExceptionCore/Assert";
import { ERROR_MESSAGES } from "@/widgets/ErrorExceptionCore/configs/messages";
import { EDR_2_DOCUMENT_TYPE } from "@/constants/edr";
import { ErrorExceptionCore } from "@/widgets/ErrorExceptionCore/ErrorExceptionCore";
import { PROZORRO_PDF_ERROR_CODES } from "@/widgets/ErrorExceptionCore/constants/ERROR_CODES.enum";
import type { Edr2Type } from "@/types/Edr/Edr2Type";

const YAML_DOCUMENT_FORMAT = "application/yaml";

export class Edr2Loader extends AbstractLoaderStrategy<Edr2Type> implements LoaderStrategyInterface<Edr2Type> {
  async load(
    { documents }: AwardType | QualificationsType,
    config: PdfDocumentConfigType
  ): Promise<P7SLoadResultType<Edr2Type>> {
    Assert.isDefined(documents, ERROR_MESSAGES.VALIDATION_FAILED.documentListUndefined);

    const { url, title } = this._getDocument(documents, config);
    const { data } = await axios.get(url);

    return {
      url,
      title,
      signers: [],
      type: PdfTemplateTypes.EDR_2,
      file: YAML.parse(data) as Edr2Type,
    };
  }

  private _getDocument(documents: DocumentType[], { date, title }: PdfDocumentConfigType): DocumentType {
    const documentsFilteredByDateModified = documents.filter(({ dateModified }: DocumentType) =>
      this.approximateCheckDateModified(dateModified, date)
    );

    if (!documentsFilteredByDateModified.length) {
      throw new ErrorExceptionCore({
        code: PROZORRO_PDF_ERROR_CODES.VALIDATION_FAILED,
        message: ERROR_MESSAGES.VALIDATION_FAILED.wrongDocumentDate,
      });
    }

    const documentsRegisterUsrType = documentsFilteredByDateModified.filter(
      ({ documentType }: DocumentType) => documentType === EDR_2_DOCUMENT_TYPE
    );

    if (!documentsRegisterUsrType.length) {
      throw new ErrorExceptionCore({
        code: PROZORRO_PDF_ERROR_CODES.VALIDATION_FAILED,
        message: ERROR_MESSAGES.VALIDATION_FAILED.wrongEdr2DocumentType,
      });
    }

    const documentsYamlFormat = documentsRegisterUsrType.filter(
      ({ format }: DocumentType) => format === YAML_DOCUMENT_FORMAT
    );

    if (!documentsYamlFormat.length) {
      throw new ErrorExceptionCore({
        code: PROZORRO_PDF_ERROR_CODES.VALIDATION_FAILED,
        message: ERROR_MESSAGES.VALIDATION_FAILED.wrongDocumentFormat,
      });
    }

    const filteredByTitle = title ? documentsYamlFormat.filter(doc => doc.title === title) : documentsYamlFormat;
    const document: DocumentType | undefined = ArrayHandler.getLastElement(filteredByTitle);

    Assert.isDefined(
      document,
      title
        ? ERROR_MESSAGES.VALIDATION_FAILED.wrongDocumentTitle
        : ERROR_MESSAGES.VALIDATION_FAILED.undefinedDocumentTitle
    );

    return document;
  }
}
