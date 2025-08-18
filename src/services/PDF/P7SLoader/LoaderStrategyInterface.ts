import type { P7SLoadResultType } from "@/types/pdf/P7SLoadResultType";
import type { PdfDocumentConfigType } from "@/types/pdf/PdfDocumentConfigType";
import type { PdfObjectType } from "@/types/pdf/PdfObjectType";

export interface LoaderStrategyInterface<DataType> {
  load(object: PdfObjectType, config: PdfDocumentConfigType): Promise<P7SLoadResultType<DataType>>;
}
