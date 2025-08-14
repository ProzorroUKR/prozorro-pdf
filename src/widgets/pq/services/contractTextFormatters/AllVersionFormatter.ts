import { get } from "lodash";
import {
  HEADING_MARGIN,
  PQ_GENERIC_HEADER_END_MARGIN,
  PQ_GENERIC_TITLE_MARGIN,
  PQ_LIST_HEADING_MARGIN,
  PQ_SPECIFICATION_HEADING_MARGIN,
} from "@/widgets/pq/configs/margins";
import type { PQContractType } from "@/widgets/pq/types/PQTypes";
import * as PDF_HELPER_CONST from "@/constants/pdf/pdfHelperConstants";
import { PDF_FILED_KEYS } from "@/constants/pdf/pdfFieldKeys";
import { FirstVersionFormatter } from "@/widgets/pq/services/contractTextFormatters/FirstVersionFormatter";
import { pqBase, pqSpecificationTexts } from "@/widgets/pq/configs/pqTexts";
import { DateHandler } from "@/utils/DateHandler";
import { DocumentExtractionService } from "@/services/PDF/document/DocumentExtractionService";
import { DEFAULT_TEXT_FIELDS } from "@/constants/string";
import { TABLE_COLUMN_LEFT_MARGIN } from "@/config/pdf/announcementConstants";
import { PROZORRO_TEMPLATE_CODES } from "@/widgets/pq/types/TemplateCodes.enum";
import { TemplateToPqTitlesMap } from "@/widgets/pq/configs/TemplateToPqTitles.map";
import { genericContractConfig } from "@/widgets/pq/templates/generic/configs/genericContract.config";
import { TemplateToTextMap } from "@/widgets/pq/configs/TemplateToText.map";
import { PQFormattingService } from "@/widgets/pq/services/Formating/PQFormattingService";
import type { OlConfigType } from "@/widgets/pq/types/TextConfigType";
import type { TenderOfferType } from "@/types/TenderOffer/Tender";
import { genericTitlesConfig } from "@/widgets/pq/templates/generic/configs/genericTitles.config";
import { TemplateCodeChecker } from "@/widgets/pq/utils/TemplateCodeChecker";
import { TemplateVersionsEnum } from "@/widgets/pq/types/TemplateVersions.enum";

export class AllVersionFormatter {
  static additionHeader(
    contractObject: PQContractType | Record<any, any>,
    contractTemplateParam: PROZORRO_TEMPLATE_CODES,
    additionId: string,
    contractIdLabel: string,
    additionTitle: string,
    dateSigned: string
  ): Record<string, any>[] {
    const margin = TemplateCodeChecker.isVersionTemplate(contractTemplateParam, TemplateVersionsEnum.VERSION_2)
      ? PQ_GENERIC_HEADER_END_MARGIN
      : PDF_HELPER_CONST.NULL_MARGIN;

    const header: Record<string, any>[] = [
      {
        text: additionId,
        style: PDF_FILED_KEYS.SPECIFICATION_HEADING,
        margin,
        pageBreak: "before",
      },
      {
        text: contractIdLabel,
        style: PDF_FILED_KEYS.SPECIFICATION_HEADING,
        margin,
      },
      {
        text: `від ${dateSigned}`,
        style: PDF_FILED_KEYS.SPECIFICATION_HEADING,
        margin,
      },
    ];

    if (FirstVersionFormatter.isMedicineTemplate(contractTemplateParam)) {
      header.push(
        {
          text: pqSpecificationTexts.specification,
          style: PDF_FILED_KEYS.HEADING,
          margin: PQ_LIST_HEADING_MARGIN,
        },
        {
          text: `${pqSpecificationTexts.toPurchaseAgreement} ${DateHandler.prepareDateSigned(DocumentExtractionService.getField(contractObject, "dateSigned"), "року")}`,
          style: PDF_FILED_KEYS.CONTENT,
        },
        {
          text: `${pqSpecificationTexts.medicineCity} ${DateHandler.prepareDateSigned(DocumentExtractionService.getField(contractObject, "dateSigned"), "року")}`,
          margin: PQ_SPECIFICATION_HEADING_MARGIN,
        }
      );
    } else {
      header.push({
        text: additionTitle,
        style: PDF_FILED_KEYS.HEADING,
        margin: PQ_SPECIFICATION_HEADING_MARGIN,
      });
    }

    return header;
  }

  static createContractText(
    contractObject: PQContractType | Record<string, never>,
    contractTemplateParam: PROZORRO_TEMPLATE_CODES,
    tender: TenderOfferType | Record<string, any>
  ): Record<string, any>[] {
    const listText: Record<string, any>[] = [];
    const titles = TemplateToPqTitlesMap.get(contractTemplateParam) || genericTitlesConfig;
    const templateTexts = TemplateToTextMap.get(contractTemplateParam) || genericContractConfig;

    Object.keys(titles).map((item, listIndex) => {
      listText.push(
        PQFormattingService.createUnitHeader(
          get(titles, item),
          listIndex,
          PDF_FILED_KEYS.HEADING,
          PQ_LIST_HEADING_MARGIN
        )
      );
      listText.push(
        PQFormattingService.createCompoundItemFromConfig(
          get(templateTexts, item) as OlConfigType[],
          contractObject,
          listIndex,
          tender
        )
      );
    });

    return listText;
  }

  static createTitle(
    contractObject: PQContractType,
    contractTemplateParam: PROZORRO_TEMPLATE_CODES
  ): Record<string, any>[] {
    const isVersion2 = TemplateCodeChecker.isVersionTemplate(contractTemplateParam, TemplateVersionsEnum.VERSION_2);
    const subtitleStyle = isVersion2 ? PDF_FILED_KEYS.BOLD_TEXT : PDF_FILED_KEYS.REGULAR_TEXT;

    const agreementTitle = {
      text: [
        pqBase.contractNumber,
        DocumentExtractionService.getField(contractObject, "contractID", DEFAULT_TEXT_FIELDS.UNDERSCORES_16),
      ],
      style: isVersion2 ? PDF_FILED_KEYS.HEADING : PDF_FILED_KEYS.HEADING_PQ,
      margin: isVersion2 ? PQ_GENERIC_TITLE_MARGIN : HEADING_MARGIN,
    };

    const subtitleLocation = {
      text: [
        DocumentExtractionService.getField(
          contractObject,
          "buyer.address.locality",
          DEFAULT_TEXT_FIELDS.UNDERSCORES_16
        ),
        pqBase.ukraine,
      ],
      margin: TABLE_COLUMN_LEFT_MARGIN,
      style: subtitleStyle,
      alignment: isVersion2 ? "right" : "left",
    };

    const subtitleDate = {
      text: DateHandler.prepareDateSigned(DocumentExtractionService.getField(contractObject, "dateSigned"), "року"),
      margin: PQ_GENERIC_TITLE_MARGIN,
      style: subtitleStyle,
      alignment: isVersion2 ? "left" : "right",
    };

    return [
      agreementTitle,
      {
        layout: PDF_HELPER_CONST.TABLE_LAYOUT_NO_BORDERS,
        table: {
          widths: ["*", "*"],
          body: [[subtitleLocation, subtitleDate]],
        },
      },
    ];
  }
}
