import type { PQContractType } from "@/widgets/pq/types/PQTypes";
import { PdfTemplateTypes } from "@/services/PDF/PdfTemplateTypes";
import type { P7SLoadResultType } from "@/types/pdf/P7SLoadResultType";
import { FetchTender } from "@/widgets/pq/services/receivingData/FetchTender";
import type { PdfDocumentConfigType } from "@/types/pdf/PdfDocumentConfigType";
import { AbstractLoaderStrategy } from "@/services/PDF/P7SLoader/AbstractLoaderStrategy";
import type { LoaderStrategyInterface } from "@/services/PDF/P7SLoader/LoaderStrategyInterface";

export class PQLoader extends AbstractLoaderStrategy<any> implements LoaderStrategyInterface<any> {
  async load(object: PQContractType, config: PdfDocumentConfigType): Promise<P7SLoadResultType<any>> {
    const file = await new FetchTender(this.envVars.apiUrl).getTenderForContract(object);

    return {
      file,
      signers: [],
      type: PdfTemplateTypes.PQ,
      title: config.contractTemplateName ? `pq-${config.contractTemplateName}` : "pq",
    };
  }
}
