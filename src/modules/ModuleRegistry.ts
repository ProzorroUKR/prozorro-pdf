import { pdfFeatureModules } from "@/modules";
import type { PdfTemplateTypes } from "@/services/PDF/PdfTemplateTypes";
import type {
  LoaderStrategyConstructor,
  DocumentStrategyConstructor,
  PdfModuleTemplate,
  PdfCustomFooter,
  PdfFeatureModule,
} from "@/modules/types";

/**
 * Builds the loader / document-maker / dictionary maps from the feature-module
 * descriptors in `src/modules`. Each map is built once on first access and
 * cached.
 *
 * Maps are NOT built at construction. The module aggregator imports concrete
 * loaders/makers that transitively import this registry, so reading
 * `pdfFeatureModules` at load time would throw a circular-import TDZ. Reading it
 * only inside the getters defers it to runtime, after the descriptor list is
 * initialized.
 */
export class ModuleRegistry {
  private _loaderStrategyMap?: Map<string, LoaderStrategyConstructor>;
  private _documentStrategyMap?: Map<PdfTemplateTypes, DocumentStrategyConstructor>;
  private _dictionaryMap?: Map<PdfTemplateTypes, Map<string, string>>;
  private _footerMap?: Map<PdfTemplateTypes, PdfCustomFooter>;

  /**
   * @param _modules Override the descriptor list (tests). Omit in production so
   * the global `pdfFeatureModules` is read lazily — see the TDZ note above; do
   * NOT default this to `pdfFeatureModules`, that would read it at construction.
   */
  constructor(private readonly _modules?: PdfFeatureModule[]) {}

  private get modules(): PdfFeatureModule[] {
    return this._modules ?? pdfFeatureModules;
  }

  /** Loader strategy map keyed by public `PROZORRO_PDF_TYPES`. */
  get loaderStrategyMap(): Map<string, LoaderStrategyConstructor> {
    if (this._loaderStrategyMap) {
      return this._loaderStrategyMap;
    }

    const map = new Map<string, LoaderStrategyConstructor>();

    for (const module of this.modules) {
      if (map.has(module.documentType)) {
        throw new Error(`Duplicate loader registration for document type "${module.documentType}".`);
      }

      map.set(module.documentType, module.loader);
    }

    this._loaderStrategyMap = map;
    return map;
  }

  /** Document-maker strategy map keyed by internal `PdfTemplateTypes`. */
  get documentStrategyMap(): Map<PdfTemplateTypes, DocumentStrategyConstructor> {
    if (!this._documentStrategyMap) {
      this._documentStrategyMap = this._createRegistry("document maker", template => template.documentMaker);
    }

    return this._documentStrategyMap;
  }

  /**
   * Dictionary map keyed by internal `PdfTemplateTypes`. Every template gets an
   * entry (an empty map when it declares no dictionaries) so
   * `DictionaryCollector.loadByType` keeps its current lookup semantics.
   */
  get dictionaryMap(): Map<PdfTemplateTypes, Map<string, string>> {
    if (!this._dictionaryMap) {
      this._dictionaryMap = this._createRegistry("dictionary", template => template.dictionaries ?? new Map());
    }

    return this._dictionaryMap;
  }

  /**
   * Footer-override map keyed by internal `PdfTemplateTypes`. Only templates
   * that declare a `customFooter` get an entry; the pipeline falls back to the
   * document maker's own `createFooter` for the rest.
   */
  get footerMap(): Map<PdfTemplateTypes, PdfCustomFooter> {
    if (!this._footerMap) {
      const map = new Map<PdfTemplateTypes, PdfCustomFooter>();

      for (const module of this.modules) {
        for (const template of module.templates) {
          if (template.customFooter) {
            map.set(template.templateType, template.customFooter);
          }
        }
      }

      this._footerMap = map;
    }

    return this._footerMap;
  }

  private _createRegistry<T>(name: string, handler: (template: PdfModuleTemplate) => T): Map<PdfTemplateTypes, T> {
    const map = new Map<PdfTemplateTypes, T>();

    for (const module of this.modules) {
      for (const template of module.templates) {
        if (map.has(template.templateType)) {
          throw new Error(`Duplicate ${name} registration for template type "${template.templateType}".`);
        }

        map.set(template.templateType, handler(template));
      }
    }

    return map;
  }
}

export const moduleRegistry = new ModuleRegistry();
