import axios from "axios";
import type { AxiosResponse } from "axios";
import { pdfDictionaryMap } from "@/services/PDF/pdfDictionaryMap";
import type { DictionaryCollectorInterface } from "@/services/DictionaryCollector/DictionaryCollectorInterface";
import { STATIC_DATA_URL } from "@/constants/env.ts";

export class DictionaryCollector implements DictionaryCollectorInterface {
  async load(documentType: string): Promise<Map<string, Record<string, any>>> {
    let loadedDictionaries = new Map<string, Record<string, any>>();
    const dictionariesMap = pdfDictionaryMap.get(documentType);
    if (dictionariesMap && dictionariesMap?.size) {
      loadedDictionaries = await this.loadDictionaries(dictionariesMap, false);
      const en = Array.from(dictionariesMap.keys()).reduce(
        (accumulator, currentValue) => accumulator || currentValue.search("_en") !== -1,
        false
      );

      if (en) {
        const enDictionaries = new Map([...dictionariesMap].filter(([k]) => k.search("_en") !== -1));
        loadedDictionaries = new Map([...loadedDictionaries, ...(await this.loadDictionaries(enDictionaries, true))]);
      }
    }
    return loadedDictionaries;
  }

  private async loadDictionaries(dictionariesMap: Map<string, string>, language: boolean): Promise<Map<string, any>> {
    const query = this.createQuery(dictionariesMap, language);
    const { data: rawDictionaries }: AxiosResponse = await axios.get(query.url, query.config);
    return this.formatDictionaries(rawDictionaries, dictionariesMap);
  }

  private createQuery(
    dictionaries: Map<string, string>,
    language: boolean
  ): { url: string; config: Record<string, any> } {
    const config = language ? { headers: { "Accept-Language": "en" } } : {};

    const url = Array.from(dictionaries.values()).reduce(
      (accumulator, currentValue, currentIndex, array) =>
        accumulator.concat(
          `cache[${currentIndex}][key]=`,
          currentValue,
          localStorage.getItem(`${currentValue}Timestamp`)
            ? `&cache[${currentIndex}][timestamp]=${localStorage.getItem(`${currentValue}Timestamp`)}`
            : "",
          currentIndex < array.length - 1 ? "&" : ""
        ),
      ""
    );

    return { url: `${STATIC_DATA_URL}?${url}`, config };
  }

  private formatDictionaries(
    rawDictionaries: Record<string, { data: Record<string, any>; date_modified: string }>,
    dictionariesMap: Map<string, string>
  ): Map<string, any> {
    const formattedDictionaries = new Map<string, any>();
    dictionariesMap.forEach((value, key) => {
      if (rawDictionaries[value]["data"] && rawDictionaries[value]["data"].length !== 0) {
        formattedDictionaries.set(key, rawDictionaries[value]["data"]);
        localStorage.setItem(key, JSON.stringify(rawDictionaries[value]["data"]));
        localStorage.setItem(`${key}Timestamp`, rawDictionaries[value]["date_modified"]);
      } else if (localStorage.getItem(key)) {
        formattedDictionaries.set(key, JSON.parse(<string>localStorage.getItem(key)));
      }
    });
    return formattedDictionaries;
  }
}
