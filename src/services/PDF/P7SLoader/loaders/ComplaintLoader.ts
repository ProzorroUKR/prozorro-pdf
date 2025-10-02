import axios from "axios";
import type { LoaderStrategyInterface } from "@/services/PDF/P7SLoader/LoaderStrategyInterface";
import { AbstractLoaderStrategy } from "@/services/PDF/P7SLoader/AbstractLoaderStrategy";
import type { P7SLoadResultType } from "@/types/pdf/P7SLoadResultType";
import type { PdfDocumentConfigType } from "@/types/pdf/PdfDocumentConfigType";
import { PdfTemplateTypes } from "@/services/PDF/PdfTemplateTypes";
import type { ComplaintType } from "@/types/complaints";
import { Assert } from "@/widgets/ErrorExceptionCore/Assert";
import { ERROR_MESSAGES } from "@/widgets/ErrorExceptionCore/configs/messages";
import type { DocumentType } from "@/types/Tender/DocumentType";
import { SIGNATURE_FILE_NAME } from "@/constants/string";
import { DateHandler } from "@/utils/DateHandler";
import { ObjectDecoder } from "@/utils/ObjectDecoder";
import type { TenderResponseType } from "@/types/Tender/TenderResponseType";

export class ComplaintLoader
  extends AbstractLoaderStrategy<Record<any, any>>
  implements LoaderStrategyInterface<Record<any, any>>
{
  async load(
    object: ComplaintType,
    { encoding, tender }: PdfDocumentConfigType
  ): Promise<P7SLoadResultType<Record<any, any>>> {
    Assert.isDefined(object && object.documents.length, ERROR_MESSAGES.VALIDATION_FAILED.documentListUndefined);

    let additionalData = null;
    const { url, title } = this.getDocument(object);
    const file = await this.getData(url);
    const { data, signers } = await this.getDataFromSign(file, encoding);

    if (tender) {
      const {
        data: { data: payload },
      }: TenderResponseType = await axios.get(tender);
      additionalData = payload;
    }

    return {
      url,
      title,
      additionalData,
      signers: signers || [],
      type: PdfTemplateTypes.COMPLAINT,
      file: this.unwrapTender(ObjectDecoder.decode<Record<any, any>>(data)),
    };
  }

  private getDocument({ documents }: ComplaintType): DocumentType {
    const [document] = documents
      .filter((doc: DocumentType) => doc.title === SIGNATURE_FILE_NAME)
      .sort((...args) => DateHandler.dateModifiedDiff(...args))
      .slice(-1);

    Assert.isDefined(document, ERROR_MESSAGES.VALIDATION_FAILED.undefinedDocumentTitle);

    return document;
  }
}
