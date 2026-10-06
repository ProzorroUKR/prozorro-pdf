import type { ENCODING } from "@/constants/encoding";
import type { PdfObjectType } from "@/types/pdf/PdfObjectType";
import type { EnvironmentType } from "@/types/pdf/EnvironmentType";
import type { P7SLoadResultType } from "@/types/pdf/P7SLoadResultType";
import type { PdfDocumentConfigType } from "@/types/pdf/PdfDocumentConfigType";
import { DataTypeValidator } from "@/services/DataTypeValidator/DataTypeValidator";
import type { LoaderStrategyInterface } from "@/services/PDF/P7SLoader/LoaderStrategyInterface";
import type { SignVerifierInterface, VerifySignParams, VerifySignResultType } from "@/services/Sign/SignVerifier";
import { signVerifier } from "@/services/Sign/SignVerifier";

export abstract class AbstractLoaderStrategy<DataType> implements LoaderStrategyInterface<DataType> {
  readonly _dataTypeValidator = new DataTypeValidator();

  constructor(
    protected readonly envVars: EnvironmentType,
    protected readonly verifier: SignVerifierInterface = signVerifier
  ) {}

  protected approximateCheckDateModified(dateModified?: string, documentDate?: string): boolean {
    return documentDate && dateModified ? dateModified.slice(0, documentDate.length) === documentDate : true;
  }

  protected async verifySign(params: VerifySignParams, encoding?: ENCODING): Promise<VerifySignResultType> {
    return this.verifier.verify(params, encoding);
  }

  // checkup for different input data from api for response with data and without data inside general object
  protected unwrapTender<DataType>(rawData: Record<any, any>, getData = false): Record<string, any> | DataType {
    if (rawData?.context && !getData) {
      return rawData?.context?.tender as Record<string, any>;
    }

    if (rawData?.data) {
      return rawData?.data as Record<string, any>;
    }

    return rawData;
  }

  abstract load(object: PdfObjectType, config: PdfDocumentConfigType): Promise<P7SLoadResultType<DataType>>;
}
