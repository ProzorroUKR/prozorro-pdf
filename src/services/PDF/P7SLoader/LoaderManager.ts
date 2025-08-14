import type { AxiosStatic } from "axios";
import { LoaderFactory } from "@/services/PDF/P7SLoader/LoaderFactory";
import { loaderStrategyMap } from "@/services/PDF/P7SLoader/LoaderStrategyMap";
import { PROZORRO_PDF_TYPES } from "@/services/PDF/PdfTypes";
import type { P7SLoadResultType } from "@/types/pdf/P7SLoadResultType";
import type { PdfDocumentConfigType } from "@/types/pdf/PdfDocumentConfigType";
import type { PdfObjectType } from "@/types/pdf/PdfObjectType";
import type { IBase64 } from "@/utils/Base64";

export interface ILoaderManager {
  setLoaderType(type: string): void;
  getData(object: PdfObjectType, config: PdfDocumentConfigType): Promise<P7SLoadResultType>;
}

export class LoaderManager implements ILoaderManager {
  private readonly loaderFactory;
  private dataGenerator;

  constructor(
    private readonly base64: IBase64,
    private readonly axios: AxiosStatic
  ) {
    this.loaderFactory = new LoaderFactory(loaderStrategyMap, this.base64, this.axios);
    this.dataGenerator = this.loaderFactory.create(PROZORRO_PDF_TYPES.TICKET);
  }

  setLoaderType(type: string): void {
    this.dataGenerator = this.loaderFactory.create(type);
  }

  async getData(object: PdfObjectType, config: PdfDocumentConfigType): Promise<P7SLoadResultType> {
    return this.dataGenerator.load(object, config);
  }
}
