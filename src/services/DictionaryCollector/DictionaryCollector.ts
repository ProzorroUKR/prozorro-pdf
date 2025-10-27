import { stringify } from "qs";
import axios from "axios";
import type { AxiosResponse } from "axios";
import { pdfDictionaryMap } from "@/services/PDF/pdfDictionaryMap";
import { PdfTemplateTypes } from "@/services/PDF/PdfTemplateTypes";

const paramsSerializer: any = (query: Record<string, any>): string => stringify(query);

export interface DictionaryCollectorInterface {
  loadByType(type: string): Promise<Map<string, Record<string, any>>>;
  loadByDictionary(dictionariesMap: Map<string, string>, filters: Record<string, string[]>): Promise<Map<string, any>>;
}

export class DictionaryCollector implements DictionaryCollectorInterface {
  constructor(private readonly staticDataUrl: string) {}

  async loadByType(documentType: string): Promise<Map<string, Record<string, any>>> {
    const dictionariesMap = pdfDictionaryMap.get(documentType as PdfTemplateTypes);

    if (!dictionariesMap?.size) {
      return new Map<string, Record<string, any>>();
    }

    return await this.loadByDictionary(dictionariesMap, {});
  }

  async loadByDictionary(
    dictionariesMap: Map<string, string>,
    filters: Record<string, string[]>
  ): Promise<Map<string, any>> {
    const params = this._createQuery(dictionariesMap, filters);
    const { data: rawDictionaries }: AxiosResponse = await axios.get(this.staticDataUrl, {
      params,
      paramsSerializer,
    });
    return this._formatDictionaries(rawDictionaries, dictionariesMap);
  }

  private _createQuery(dictionaries: Map<string, string>, filters: Record<string, string[]>): Record<any, any> {
    const cache = Array.from(dictionaries.values()).reduce<Record<any, any>[]>((acc, key) => {
      acc.push({
        key,
        filters: filters[key],
        timestamp: localStorage.getItem(`${key}Timestamp`) ?? undefined,
      });

      return acc;
    }, []);

    return { cache };
  }

  private _formatDictionaries(
    rawDictionaries: Record<string, { data: Record<string, any>; date_modified: string }>,
    dictionariesMap: Map<string, string>
  ): Map<string, any> {
    const formattedDictionaries = new Map<string, any>();

    dictionariesMap.forEach((value, key) => {
      formattedDictionaries.set(key, rawDictionaries[value]["data"]);
    });

    return formattedDictionaries;
  }
}
