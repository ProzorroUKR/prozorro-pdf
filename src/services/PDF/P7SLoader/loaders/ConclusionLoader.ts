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

export class ConclusionLoader extends AbstractLoaderStrategy implements LoaderStrategyInterface {
  public async load(object: MonitoringType, config: PdfDocumentConfigType): Promise<P7SLoadResultType> {
    const url = this.getDocumentUrl(object, config);
    const file = await this.getData(url);

    return {
      file,
      type: PdfTemplateTypes.MONITORING,
      encoding: ENCODING.UTF_8,
      url,
    };
  }

  private getDocumentUrl(object: MonitoringType, { title, date }: PdfDocumentConfigType): string {
    Assert.isDefined(object.conclusion, ERROR_MESSAGES.VALIDATION_FAILED.undefinedConclusion);
    Assert.isDefined(object.conclusion.documents, ERROR_MESSAGES.VALIDATION_FAILED.undefinedConclusionOfDocs);

    const documents: DocumentType[] = object.conclusion.documents.filter(
      (doc: DocumentType) => doc.title === title && this.checkDateModified(doc.dateModified, date)
    );

    const document: DocumentType | undefined = ArrayHandler.getLastElement<DocumentType>(documents);

    Assert.isDefined(document, ERROR_MESSAGES.VALIDATION_FAILED.undefinedDocumentTitle);

    return document.url;
  }
}
