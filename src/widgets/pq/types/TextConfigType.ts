export type TextConfigType = Record<string, OlConfigType>;

export type OlFromConfigAccumulatorType = {
  listText: Record<string, any>[];
  consecutiveNoMarkerText: number;
};

export type OlConfigType = string | (string | CompoundTextType)[] | CompoundTextType;

export enum PdfItemEnum {
  TEXT = "text",
  LIST_ITEM = "listItem",
  TABLE = "table",
}

export type CompoundTextType = {
  text: (string | number)[];
  paths: string[];
  defaults: string[];
  pdfType: PdfItemEnum;
  functionName?: string[];
  header?: string[];
  widths?: string[];
};

export type OlPdfType = {
  separator: string[];
  start: number;
  ol: string[] | PDFUnitType[] | Record<string, any>[];
  indexReducer?: number;
  margin?: number[];
};

export type TableHeadConfigType = { text: string }[];

export type PDFTableBodyType = (TableCellConfigType | string)[][];

export type TableBodyConfigType = {
  body: PDFTableBodyType;
  widths?: TableWidthType;
  heights?: number;
  unbreakable?: boolean;
  dontBreakRows?: boolean;
  headerRows?: number;
};

export type TableCellConfigType = PDFUnitType & {
  colSpan?: number;
  rowSpan?: number;
  border?: boolean[];
  fillColor?: string;
};

export type TableConfigType = {
  table: TableBodyConfigType;
  style?: string;
  margin?: number[];
  headerRows?: number;
  layout?: Record<string, any>;
};

export type TableWidthType = (number | string)[];

export type PDFUnitType = {
  text?: string | string[] | Record<string, any>;
  style?: string | string[];
  margin?: number[];
  pageBreak?: string;
  alignment?: string;
};
