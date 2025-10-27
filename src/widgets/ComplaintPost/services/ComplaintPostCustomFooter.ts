import { DATE_FORMAT } from "@/constants/date";
import { CUSTOM_FOOTER } from "@/widgets/pq/configs/margins";

export const complaintPostCustomFooter = (currentPage: number): Record<string, any> => {
  const dateCurrent = new Date();
  const dateString = `Дата формування: ${dateCurrent.toLocaleString("uk-UA", DATE_FORMAT).replace(",", "")}`;

  return {
    layout: "noBorders",
    fontSize: 12,
    margin: CUSTOM_FOOTER,
    table: {
      widths: ["*", "*"],
      body: [[{ text: dateString }, { text: currentPage.toString(), alignment: "right" }]],
    },
  };
};
