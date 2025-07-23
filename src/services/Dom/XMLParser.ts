import { STRING } from "@/constants/string";
import type { XMLParserInterface } from "@/services/Dom/XMLParserInterface";
import { Logger } from "@/utils/Logger";
import type { ILogger } from "@/utils/Logger";

export class XMLParser implements XMLParserInterface {
  private readonly _logger: ILogger = new Logger("XMLParser");

  getData(xmlString: string, selectors: string[]): Record<string, string> {
    const result: [string, string][] = selectors.map((selector: string) => [
      selector,
      this.getDataByTag(xmlString, selector),
    ]);
    return Object.fromEntries<string>(result);
  }

  private getDataByTag(xmlString: string, tagName: string): string {
    const SEARCH_TAG = new RegExp(`<${tagName}>(.*?)<\\/${tagName}>`, "g");
    const REPLACE_TEXT = new RegExp(`<\\/?${tagName}>`, "g");
    const matchedText: string[] | null = xmlString.match(SEARCH_TAG);

    if (matchedText === null) {
      this._logger.warn(`Cannot reach element ${tagName}`);
      return "";
    }

    const [tag] = matchedText;
    return tag.replaceAll(REPLACE_TEXT, STRING.EMPTY);
  }
}
