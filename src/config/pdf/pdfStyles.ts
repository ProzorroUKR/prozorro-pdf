import {
  COMPLAINT_POST_HEADER_MARGIN,
  POST_HEADING_ADDRESS_MARGIN,
  PQ_GENERIC_TITLE_MARGIN,
  PQ_TESTING_GROUNDS_MARGIN,
} from "@/widgets/pq/configs/margins";

export const PDF_STYLES = {
  heading: {
    bold: true,
    alignment: "center",
  },
  heading_title: {
    fontSize: 16,
    bold: true,
    alignment: "center",
  },
  second_heading_title: {
    fontSize: 14,
    bold: true,
    alignment: "center",
  },
  pq_title: {
    fontSize: 12,
    bold: true,
    alignment: "center",
  },
  specification_heading: {
    bold: true,
    fontSize: 12,
    alignment: "right",
  },
  complaint_subheading: {
    alignment: "right",
    fontSize: 12,
    margin: POST_HEADING_ADDRESS_MARGIN,
  },
  date: {
    decoration: "underline",
    decorationStyle: "solid",
    decorationColor: "black",
  },
  content: {
    alignment: "center",
  },
  description: {
    fontSize: 10,
    color: "grey",
    alignment: "center",
  },
  regular: {
    bold: false,
  },
  bold: {
    bold: true,
  },
  italic: {
    italics: true,
  },
  title_medium_bold: {
    fontSize: 12,
    alignment: "center",
    bold: true,
  },
  title_medium: {
    fontSize: 12,
    alignment: "center",
  },
  title_large: {
    fontSize: 14,
    alignment: "center",
    bold: true,
  },
  title_large_tender_offer: {
    fontSize: 13,
    alignment: "center",
    bold: true,
  },
  field_text: {
    fontSize: 11,
    alignment: "center",
  },
  field_description_text: {
    fontSize: 7.7,
    alignment: "center",
  },
  underline: {
    fontSize: 11,
    alignment: "center",
    decoration: "underline",
    color: "white",
    decorationColor: "black",
    lineHeight: 0.1,
  },
  table_head: {
    fontSize: 12,
    bold: true,
    alignment: "left",
  },
  table_cell_title_complaint: {
    bold: true,
    alignment: "left",
    fontSize: 11,
  },
  table_data: {
    fontSize: 11,
    alignment: "left",
  },
  table_data_bold: {
    fontSize: 11,
    alignment: "left",
    bold: true,
  },
  table_data_bold_center: {
    fontSize: 11,
    alignment: "center",
    bold: true,
  },
  table_head_esco: {
    fontSize: 9,
    bold: true,
    alignment: "left",
  },
  table_data_esco: {
    fontSize: 9,
    alignment: "left",
  },
  table_data_blue: {
    fontSize: 11,
    alignment: "left",
    bold: false,
    color: "blue",
    decoration: "underline",
  },
  hidden_data: {
    color: "white",
    fontSize: 11,
  },
  header_data: {
    fontSize: 12,
    lineHeight: 1,
    alignment: "left",
    bold: false,
  },
  centered_capitalised: {
    fontSize: 13,
    alignment: "center",
    bold: true,
    margin: PQ_GENERIC_TITLE_MARGIN,
  },
  contacts_table_content: {
    fontSize: 12,
    alignment: "left",
  },
  regular_content: {
    bold: false,
    fontSize: 12,
    alignment: "left",
  },
  complaint_post_heading: {
    bold: true,
    fontSize: 12,
    alignment: "right",
    margin: COMPLAINT_POST_HEADER_MARGIN,
  },
  table_margin: {
    margin: PQ_TESTING_GROUNDS_MARGIN,
  },
  complaint_post: {
    fontSize: 12,
    alignment: "center",
    bold: true,
    margin: COMPLAINT_POST_HEADER_MARGIN,
  },
};
