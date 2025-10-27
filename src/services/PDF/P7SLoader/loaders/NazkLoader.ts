import axios from "axios";
import { ArrayHandler } from "@/utils/ArrayHandler";
import type { AwardType } from "@/types/Tender/AwardType";
import { Assert } from "@/widgets/ErrorExceptionCore/Assert";
import type { DocumentType } from "@/types/Tender/DocumentType";
import { NAZK_DOCUMENT_TYPE, NAZK_TITLE } from "@/constants/nazk";
import { PdfTemplateTypes } from "@/services/PDF/PdfTemplateTypes";
import type { P7SLoadResultType } from "@/types/pdf/P7SLoadResultType";
import { ERROR_MESSAGES } from "@/widgets/ErrorExceptionCore/configs/messages";
import { AbstractLoaderStrategy } from "@/services/PDF/P7SLoader/AbstractLoaderStrategy";
import type { LoaderStrategyInterface } from "@/services/PDF/P7SLoader/LoaderStrategyInterface";

export class NazkLoader extends AbstractLoaderStrategy<string> implements LoaderStrategyInterface<string> {
  public async load(object: AwardType): Promise<P7SLoadResultType<string>> {
    const document = this.getDocument(object);
    const { data } = await axios.get(document.url);

    return {
      url: document.url,
      title: document.title,
      file: data,
      signers: [],
      type: PdfTemplateTypes.NAZK,
    };
  }

  private getDocument(award?: AwardType): DocumentType {
    Assert.isDefined(award?.documents, ERROR_MESSAGES.VALIDATION_FAILED.documentListUndefined);

    const awardDocuments = (award?.documents || []).filter(
      (doc: DocumentType) => doc?.title === NAZK_TITLE && doc?.documentType === NAZK_DOCUMENT_TYPE
    );

    const document = ArrayHandler.getLastElement(awardDocuments);

    Assert.isDefined(document, ERROR_MESSAGES.VALIDATION_FAILED.undefinedDocumentTitle);

    return document;
  }
}
