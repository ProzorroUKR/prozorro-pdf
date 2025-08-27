export type TableRowTitleValueConditional = {
  conditional?: boolean;
  value: string;
  title: string;
};

export interface TableRow {
  head: string;
  data: string;
  hasMargin?: boolean;
  marginTop?: boolean;
  headStyle?: string;
}
