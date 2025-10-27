import type { LoaderStrategyInterface } from "@/services/PDF/P7SLoader/LoaderStrategyInterface";
import { AbstractLoaderStrategy } from "@/services/PDF/P7SLoader/AbstractLoaderStrategy";
import type { P7SLoadResultType } from "@/types/pdf/P7SLoadResultType";
import { PdfTemplateTypes } from "@/services/PDF/PdfTemplateTypes";
import { Assert } from "@/widgets/ErrorExceptionCore/Assert";
import { ERROR_MESSAGES } from "@/widgets/ErrorExceptionCore/configs/messages";
import axios from "axios";
import type { TenderResponseType } from "@/types/Tender/TenderResponseType";
import type { PdfDocumentConfigType } from "@/types/pdf/PdfDocumentConfigType";

export class ComplaintPostLoader
  extends AbstractLoaderStrategy<Record<any, any>>
  implements LoaderStrategyInterface<Record<any, any>>
{
  async load(
    object: Record<string, any>,
    { tender }: PdfDocumentConfigType
  ): Promise<P7SLoadResultType<Record<any, any>>> {
    const hasComplaintsPosts = object && object.posts?.length;
    Assert.isDefined(hasComplaintsPosts, ERROR_MESSAGES.VALIDATION_FAILED.undefinedPosts);

    let additionalData = null;

    if (tender) {
      const {
        data: { data: payload },
      }: TenderResponseType = await axios.get(tender);
      additionalData = payload;
    }

    return {
      signers: [],
      file: object,
      additionalData,
      title: "complaint-post",
      type: PdfTemplateTypes.COMPLAINT_POST,
    };
  }
}
