import { AbstractLoaderStrategy } from "@/services/PDF/P7SLoader/AbstractLoaderStrategy";
import type { LoaderStrategyInterface } from "@/services/PDF/P7SLoader/LoaderStrategyInterface";
import type { P7SLoadResultType } from "@/types/pdf/P7SLoadResultType";
import { ERROR_MESSAGES } from "@/widgets/ErrorExceptionCore/configs/messages";
import { Assert } from "@/widgets/ErrorExceptionCore/Assert";
import { ArrayHandler } from "@/utils/ArrayHandler";
import type { MonitoringType } from "@/types/Monitoring/MonitoringType";
import type { DocumentType } from "@/types/Tender/DocumentType";
import { ENCODING } from "@/constants/encoding";
import { PdfTemplateTypes } from "@/services/PDF/PdfTemplateTypes.ts";
import type { PdfDocumentConfigType } from "@/types/pdf/PdfDocumentConfigType";
import { ObjectDecoder } from "@/utils/ObjectDecoder";
import { ValidationTypes } from "@/services/DataTypeValidator/ValidationTypes.ts";

export class ConclusionLoader
  extends AbstractLoaderStrategy<Record<any, any>>
  implements LoaderStrategyInterface<Record<any, any>>
{
  public async load(
    object: MonitoringType,
    config: PdfDocumentConfigType
  ): Promise<P7SLoadResultType<Record<any, any>>> {
    this._dataTypeValidator.validate(
      config.title,
      ValidationTypes.STRING,
      ERROR_MESSAGES.INVALID_PARAMS.undefinedTitle
    );

    const document = this.getDocument(object, config);
    const file = await this.getData(document.url);
    const { data, signers } = await this.getDataFromSign(file, ENCODING.UTF_8 || config.encoding);

    return {
      url: document.url,
      title: document.title,
      signers: signers || [],
      type: PdfTemplateTypes.MONITORING,
      file: this.unwrapTender(ObjectDecoder.decode<Record<any, any>>(data)),
    };
  }

  private getDocument(object: MonitoringType, { title, date }: PdfDocumentConfigType): DocumentType {
    Assert.isDefined(object.conclusion, ERROR_MESSAGES.VALIDATION_FAILED.undefinedConclusion);
    Assert.isDefined(object.conclusion.documents, ERROR_MESSAGES.VALIDATION_FAILED.undefinedConclusionOfDocs);

    const documents: DocumentType[] = object.conclusion.documents.filter(
      (doc: DocumentType) => doc.title === title && this.approximateCheckDateModified(doc.dateModified, date)
    );

    const document: DocumentType | undefined = ArrayHandler.getLastElement<DocumentType>(documents);

    Assert.isDefined(document, ERROR_MESSAGES.VALIDATION_FAILED.undefinedDocumentTitle);

    return document;
  }
}
