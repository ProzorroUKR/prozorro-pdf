import type { LoaderStrategyInterface } from "@/services/PDF/P7SLoader/LoaderStrategyInterface";
import { AbstractLoaderStrategy } from "@/services/PDF/P7SLoader/AbstractLoaderStrategy";
import type { P7SLoadResultType } from "@/types/pdf/P7SLoadResultType";
import type { PdfDocumentConfigType } from "@/types/pdf/PdfDocumentConfigType";
import { PdfTemplateTypes } from "@/services/PDF/PdfTemplateTypes";
import type { ComplaintType } from "@/types/complaints";
import { Assert } from "@/widgets/ErrorExceptionCore/Assert";
import { ERROR_MESSAGES } from "@/widgets/ErrorExceptionCore/configs/messages";
import type { DocumentType } from "@/types/Tender/DocumentType";
import { SIGNATURE_FILE_NAME, STRING } from "@/constants/string";
import { DateHandler } from "@/utils/DateHandler";

export class ComplaintLoader extends AbstractLoaderStrategy implements LoaderStrategyInterface {
  async load(object: ComplaintType, config: PdfDocumentConfigType): Promise<P7SLoadResultType> {
    Assert.isDefined(object && object.documents.length, ERROR_MESSAGES.VALIDATION_FAILED.documentListUndefined);

    const url = object && object.documents.length ? this.getDocumentUrl(object) : STRING.EMPTY;
    const file = await this.getData(this.getDocumentUrl(object));

    return {
      url,
      file,
      encoding: config.encoding,
      type: PdfTemplateTypes.COMPLAINT,
    };
  }

  private getDocumentUrl({ documents: documentList }: ComplaintType): string {
    const [document] = documentList
      .filter((doc: DocumentType) => doc.title === SIGNATURE_FILE_NAME)
      .sort((...args) => DateHandler.dateModifiedDiff(...args))
      .slice(-1);

    Assert.isDefined(document, ERROR_MESSAGES.VALIDATION_FAILED.undefinedDocumentTitle);

    return document.url;
  }
}
