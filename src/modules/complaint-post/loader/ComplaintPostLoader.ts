import type { LoaderStrategyInterface } from "@/services/PDF/P7SLoader/LoaderStrategyInterface";
import { AbstractLoaderStrategy } from "@/services/PDF/P7SLoader/AbstractLoaderStrategy";
import type { P7SLoadResultType } from "@/types/pdf/P7SLoadResultType";
import { PdfTemplateTypes } from "@/services/PDF/PdfTemplateTypes";
import { Assert } from "@/widgets/ErrorExceptionCore/Assert";
import { ERROR_MESSAGES } from "@/widgets/ErrorExceptionCore/configs/messages";
import { HttpClient } from "@/services/Http/HttpClient";
import type { PdfDocumentConfigType } from "@/types/pdf/PdfDocumentConfigType";
import type { TenderType } from "@/types/Tender/TenderType";

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
      const { data: payload }: { data: TenderType } = await HttpClient.get(tender);
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
