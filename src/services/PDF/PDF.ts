import { ProzorroEds } from "@prozorro/prozorro-eds";
import pdfMake from "pdfmake/build/pdfmake";
import { ENV_CONFIG } from "@/config/ENV.config";
import { FONTS_CONFIG } from "@/config/FONTS.config";
import { ErrorExceptionCore } from "@/widgets/ErrorExceptionCore/ErrorExceptionCore";
import { ERROR_MESSAGES } from "@/widgets/ErrorExceptionCore/configs/messages";
import { PROZORRO_PDF_TYPES } from "@/services/PDF/PdfTypes";
import type { PdfConfigType } from "@/types/pdf/PdfConfigType";
import { HttpClient } from "@/services/Http/HttpClient";
import { PdfDocument } from "@/services/PDF/PdfDocument";
import { DataTypeValidator } from "@/services/DataTypeValidator/DataTypeValidator";
import { ValidationTypes } from "@/services/DataTypeValidator/ValidationTypes";
import { PROZORRO_TEMPLATE_CODES } from "@/types/pq/TemplateCodes.enum";
import type { EnvironmentType } from "@/types/pdf/EnvironmentType";
import { ENVIRONMENT_MODE } from "@/constants/ENVIRONMENT_MODE.enum";
import { edsModeMap } from "@/config/edsModeMap";
import type { PdfObjectType } from "@/types/pdf/PdfObjectType.ts";

export interface IProzorroPdf {
  MODE: typeof ENVIRONMENT_MODE;
  TYPES: typeof PROZORRO_PDF_TYPES;
  TEMPLATES: typeof PROZORRO_TEMPLATE_CODES;
  init(environment?: ENVIRONMENT_MODE): Promise<void>;
  setConfig(config: PdfConfigType): Promise<PdfDocument>;
}

/**
 * Stateless factory for the Prozorro PDF library.
 *
 * `init()` performs one-time global setup (EDS, fonts, environment). `setConfig()`
 * fetches the CBD object and returns an isolated {@link PdfDocument} handle — the
 * factory itself holds no per-request mutable state, so concurrent documents are safe.
 */
export class ProzorroPdf implements IProzorroPdf {
  readonly MODE = ENVIRONMENT_MODE;
  readonly TYPES = PROZORRO_PDF_TYPES;
  readonly TEMPLATES = PROZORRO_TEMPLATE_CODES;

  private envVars: EnvironmentType = ENV_CONFIG.SANDBOX;

  async init(environment: ENVIRONMENT_MODE = ENVIRONMENT_MODE.SANDBOX): Promise<void> {
    await ProzorroEds.init({ environment: edsModeMap.get(environment) });
    this.envVars = ENV_CONFIG[environment];
    pdfMake.fonts = FONTS_CONFIG;
  }

  async setConfig({ url, type }: PdfConfigType): Promise<PdfDocument> {
    try {
      const dataTypeValidator = new DataTypeValidator();

      if (type === PROZORRO_PDF_TYPES.PQ && !url) {
        return new PdfDocument(this.envVars, type);
      }

      dataTypeValidator.validate(url, ValidationTypes.STRING, ERROR_MESSAGES.INVALID_PARAMS.undefinedUrl);

      const { data: payload } = await HttpClient.get<{ data: PdfObjectType }>(url);

      return new PdfDocument(this.envVars, type, payload);
    } catch (error) {
      throw new ErrorExceptionCore(error as Error);
    }
  }
}
