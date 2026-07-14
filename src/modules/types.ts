import type { EnvironmentType } from "@/types/pdf/EnvironmentType";
import type { LoaderStrategyInterface } from "@/services/PDF/P7SLoader/LoaderStrategyInterface";
import type { DocumentStrategyInterface } from "@/services/PDF/document/DocumentStrategyInterface";
import type { PROZORRO_PDF_TYPES } from "@/services/PDF/PdfTypes";
import type { PdfTemplateTypes } from "@/services/PDF/PdfTemplateTypes";

/**
 * Constructor for a loader strategy. A loader fetches the signed `.p7s`
 * document for a given public `PROZORRO_PDF_TYPES` value, decodes it and
 * returns the data the document maker needs.
 */
export type LoaderStrategyConstructor = new (envVars: EnvironmentType) => LoaderStrategyInterface<any>;

/**
 * Constructor for a document maker strategy. A document maker turns the
 * decoded data into a pdfmake document definition for one `PdfTemplateTypes`.
 */
export type DocumentStrategyConstructor = new (envVars: EnvironmentType) => DocumentStrategyInterface;

/**
 * A page footer that overrides the document maker's own `createFooter`. Either
 * a static footer definition or a per-page factory. Used for the rare templates
 * (e.g. `COMPLAINT_POST`) whose footer is independent of signer/QR info.
 */
export type PdfCustomFooter = Record<string, any>[] | ((currentPage: number) => Record<string, any>);

/**
 * One internal template produced by a feature module. A single public
 * document type can yield more than one template (e.g. `TICKET` produces
 * `XML` or `KVT` depending on the decoded file), so templates are listed
 * explicitly instead of hidden behind conditionals in global maps.
 */
export interface PdfModuleTemplate {
  templateType: PdfTemplateTypes;
  documentMaker: DocumentStrategyConstructor;
  /** Dictionaries this template needs. Omit when no dictionaries are required. */
  dictionaries?: Map<string, string>;
  /**
   * Optional footer override. When set, the pipeline uses it instead of the
   * document maker's `createFooter`. Lets the core stay free of document-type
   * conditionals for special footers.
   */
  customFooter?: PdfCustomFooter;
}

/**
 * Descriptor for a single Prozorro PDF document type. The core PDF pipeline
 * consumes these descriptors to build the loader / document-maker / dictionary
 * maps, instead of importing every concrete document class directly.
 */
export interface PdfFeatureModule {
  /** Public document type this module handles. */
  documentType: PROZORRO_PDF_TYPES;
  /** Loader strategy used to fetch and decode the signed document. */
  loader: LoaderStrategyConstructor;
  /** Internal templates this module can produce. */
  templates: PdfModuleTemplate[];
}
