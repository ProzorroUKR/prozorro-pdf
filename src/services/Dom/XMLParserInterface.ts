export interface XMLParserInterface {
  getData(xmlString: string, selectors: string[]): Record<string, string>;
}
