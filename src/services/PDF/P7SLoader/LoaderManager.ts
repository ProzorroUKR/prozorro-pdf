import { LoaderFactory } from "@/services/PDF/P7SLoader/LoaderFactory";
import { loaderStrategyMap } from "@/services/PDF/P7SLoader/LoaderStrategyMap";
import { PROZORRO_PDF_TYPES } from "@/services/PDF/PdfTypes";
import type { P7SLoadResultType } from "@/types/pdf/P7SLoadResultType";
import type { PdfDocumentConfigType } from "@/types/pdf/PdfDocumentConfigType";
import type { PdfObjectType } from "@/types/pdf/PdfObjectType";
import type { EnvironmentType } from "@/types/pdf/EnvironmentType";

export interface ILoaderManager<DataType> {
  setLoaderType(type: string): void;
  getData(object: PdfObjectType, config: PdfDocumentConfigType): Promise<P7SLoadResultType<DataType>>;
}

export class LoaderManager<DataType> implements ILoaderManager<DataType> {
  private readonly loaderFactory;
  private dataGenerator;

  constructor(envVars: EnvironmentType) {
    this.loaderFactory = new LoaderFactory(loaderStrategyMap, envVars);
    this.dataGenerator = this.loaderFactory.create(PROZORRO_PDF_TYPES.TICKET);
  }

  setLoaderType(type: string): void {
    this.dataGenerator = this.loaderFactory.create(type);
  }

  async getData(object: PdfObjectType, config: PdfDocumentConfigType): Promise<P7SLoadResultType<DataType>> {
    return this.dataGenerator.load(object, config);
  }
}
