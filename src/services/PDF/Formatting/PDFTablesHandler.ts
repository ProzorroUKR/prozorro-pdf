import { STRING } from "@/constants/string";
import * as PDF_HELPER_CONST from "@/constants/pdf/pdfHelperConstants";
import { PDF_FILED_KEYS } from "@/constants/pdf/pdfFieldKeys";
import * as CONCLUSION_OF_MONITORING_CONST from "@/config/pdf/conclusionOfMonitoringConstants";
import type { TableRow, TableRowTitleValueConditional } from "@/types/pdfFormatting/tableFormatting";
import type { PDFTableBodyType, TableConfigType, TableWidthType } from "@/widgets/pq/types/TextConfigType";
import {
  TABLE_COLUMN_LEFT_MARGIN,
  TABLE_COLUMN_MARGIN,
  TABLE_COLUMN_RIGHT_MARGIN,
} from "@/config/pdf/announcementConstants";

export class PDFTablesHandler {
  static createTable(
    body: PDFTableBodyType = [[STRING.EMPTY]],
    widths: TableWidthType = [PDF_HELPER_CONST.ROW_AUTO_WIDTH],
    style = PDF_FILED_KEYS.TABLE_DATA,
    heights = PDF_HELPER_CONST.LINE_HEIGHT_40,
    headerRows = 1,
    dontBreakRows = true
  ): TableConfigType {
    return {
      headerRows,
      style,
      table: {
        dontBreakRows,
        heights,
        widths,
        body,
      },
    };
  }
  // TODO add test
  static showIfAvailable({ value, title, conditional = true }: TableRowTitleValueConditional): Record<string, any> {
    return conditional && value
      ? this.createTableLayout([
          this.createTableRow({
            head: title,
            data: value,
          }),
        ])
      : PDF_HELPER_CONST.EMPTY_FIELD;
  }

  // TODO add test
  static createTableLayout(
    body: Record<string, any>[][],
    dontBreakRows = false,
    tableMargin: number[] = [],
    tableLayout: string = PDF_HELPER_CONST.TABLE_LAYOUT_NO_BORDERS,
    rowWidth = [PDF_HELPER_CONST.ROW_WIDTH_250, PDF_HELPER_CONST.ROW_ALL_WIDTH]
  ): Record<string, any> {
    const addedLeftColPadding = body.map(value => [
      {
        text: value[0],
        margin: TABLE_COLUMN_LEFT_MARGIN,
      },
      {
        text: value.slice(1),
        margin: TABLE_COLUMN_RIGHT_MARGIN,
      },
    ]);

    const table: Record<string, any> = {
      layout: tableLayout,
      table: {
        dontBreakRows,
        widths: rowWidth,
        body: addedLeftColPadding,
      },
    };
    if (tableMargin.length) {
      table["margin"] = tableMargin;
    }
    return table;
  }

  // pass table head style as props
  static createTableRow({
    head,
    data,
    hasMargin = true,
    marginTop = false,
    headStyle = PDF_FILED_KEYS.TABLE_HEAD,
  }: TableRow): Record<string, any>[] {
    const margin = hasMargin
      ? {
          margin: marginTop ? CONCLUSION_OF_MONITORING_CONST.MARGIN_TOP_10 : TABLE_COLUMN_MARGIN,
        }
      : {};
    return [
      {
        style: headStyle, // hasBoldHead ? PDF_FILED_KEYS.TABLE_HEAD : PDF_FILED_KEYS.TABLE_DATA,
        text: head,
        ...margin,
      },
      {
        style: PDF_FILED_KEYS.TABLE_DATA,
        text: data,
        ...margin,
      },
    ];
  }

  static createTableRowNoText({
    head,
    data,
    hasMargin = true,
    marginTop = false,
  }: {
    head: string;
    data: Record<string, any>;
    hasMargin?: boolean;
    marginTop?: boolean;
  }): Record<string, any>[] {
    const margin = hasMargin
      ? {
          margin: marginTop ? CONCLUSION_OF_MONITORING_CONST.MARGIN_TOP_10 : TABLE_COLUMN_MARGIN,
        }
      : {};
    return [
      {
        style: PDF_FILED_KEYS.TABLE_HEAD,
        text: head,
        ...margin,
      },
      data,
    ];
  }

  static resolveTableBug(table: Record<string, any>, title: Record<string, any>): Record<string, any> {
    return {
      layout: {
        hLineColor: (): string => "white",
        vLineColor: (): string => "white",
        defaultBorder: false,
      },
      headlineLevel: 1,
      table: {
        headerRows: 0,
        dontBreakRows: false,
        body: [[title], [table]],
        widths: [PDF_HELPER_CONST.ROW_ALL_WIDTH],
      },
    };
  }
}
