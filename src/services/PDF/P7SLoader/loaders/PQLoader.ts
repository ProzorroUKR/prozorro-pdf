import type { LoaderStrategyInterface } from "@/services/PDF/P7SLoader/LoaderStrategyInterface";
import { AbstractLoaderStrategy } from "@/services/PDF/P7SLoader/AbstractLoaderStrategy";
import type { P7SLoadResultType } from "@/types/pdf/P7SLoadResultType";
import type { PdfDocumentConfigType } from "@/types/pdf/PdfDocumentConfigType";
import { PdfTemplateTypes } from "@/services/PDF/PdfTemplateTypes";
import type { AnnouncementType } from "@/types/Announcement/AnnouncementTypes";

export class PQLoader extends AbstractLoaderStrategy implements LoaderStrategyInterface {
  public async load(_: AnnouncementType, config: PdfDocumentConfigType): Promise<P7SLoadResultType> {
    const file = await this.getData(
      "https://lb-api-sandbox-2.prozorro.gov.ua/api/2.5/tenders/72c79e1bd8ca481a8b0bb21591a4afde/awards/43fa1c2337594af5a9d016357197cd20"
    );
    return {
      file,
      type: PdfTemplateTypes.PQ,
      encoding: config.encoding,
      url: undefined,
    };
  }
}
