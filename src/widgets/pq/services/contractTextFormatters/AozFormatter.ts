import type { PQContractType, PQItem, PQsupplier } from "@/widgets/pq/types/PQTypes.ts";
import { deepClone } from "@/utils/helpers.ts";
import { PDF_FILED_KEYS } from "@/constants/pdf/pdfFieldKeys.ts";
import { pqBase } from "@/widgets/pq/configs/pqTexts.ts";
import { DocumentExtractionService } from "@/services/PDF/document/DocumentExtractionService.ts";
import { DEFAULT_TEXT_FIELDS, STRING } from "@/constants/string.ts";
import {
  PQ_GENERIC_HEADER_END_MARGIN,
  PQ_GENERIC_TITLE_MARGIN,
  PQ_LIST_HEADING_MARGIN,
  PQ_SPECIFICATION_HEADING_MARGIN,
} from "@/widgets/pq/configs/margins.ts";
import { TABLE_COLUMN_LEFT_MARGIN } from "@/config/pdf/announcementConstants.ts";
import { DateHandler } from "@/utils/DateHandler.ts";
import * as PDF_HELPER_CONST from "@/constants/pdf/pdfHelperConstants.ts";
import { pqAozTexts } from "@/widgets/pq/templates/aoz/configs/pqAozTexts.ts";
import { PQFormattingService } from "@/widgets/pq/services/Formating/PQFormattingService.ts";
import { pqGenericBase } from "@/widgets/pq/templates/generic/configs/pqGenericTexts.ts";
import { pqNushTexts } from "@/widgets/pq/templates/nush/configs/pqNushTexts.ts";
import { ContractPendingChecker } from "@/widgets/pq/utils/ContractPendingChecker.ts";
import type { PDFTableBodyType } from "@/widgets/pq/types/TextConfigType.ts";
import { PDFTablesHandler } from "@/services/PDF/Formatting/PDFTablesHandler.ts";
import * as TABLES_HELPER from "@/widgets/pq/configs/tablesConfig.ts";
import { SecondVersionFormatter } from "@/widgets/pq/services/contractTextFormatters/SecondVersionFormatter.ts";
import { PROZORRO_TEMPLATE_CODES } from "@/widgets/pq/types/TemplateCodes.enum.ts";
import {
  aozActOfAcceptanceAndTransferTableHeader,
  aozItemQuantityTableHeader,
  aozItemTermsTableHeader,
} from "@/widgets/pq/templates/aoz/configs/aozContract.config.ts";
import { CompoundTextAdapter } from "@/widgets/pq/services/Formating/CompoundTextAdapter.ts";
import { FormattingFunctionsEnum } from "@/widgets/pq/services/Formating/config/FormattingFunctions.enum.ts";

export class AozFormatter {
  static createTitle(contractObject: PQContractType): Record<string, any>[] {
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
      style: PDF_FILED_KEYS.BOLD_TEXT,
      alignment: "left",
    };

    const subtitleDate = {
      text: DateHandler.prepareDateSigned(DocumentExtractionService.getField(contractObject, "dateSigned"), "року"),
      margin: PQ_GENERIC_TITLE_MARGIN,
      style: PDF_FILED_KEYS.BOLD_TEXT,
      alignment: "right",
    };

    return [
      {
        text: pqAozTexts.title,
        style: PDF_FILED_KEYS.HEADING,
      },
      {
        text: pqAozTexts.subtitle,
        style: PDF_FILED_KEYS.HEADING,
      },
      {
        text: [
          pqAozTexts.number,
          DocumentExtractionService.getField(contractObject, "contractID", DEFAULT_TEXT_FIELDS.UNDERSCORES_16),
        ],
        style: PDF_FILED_KEYS.HEADING,
        margin: PQ_GENERIC_TITLE_MARGIN,
      },
      {
        layout: PDF_HELPER_CONST.TABLE_LAYOUT_NO_BORDERS,
        table: {
          widths: ["*", "*"],
          body: [[subtitleLocation, subtitleDate]],
        },
      },
    ];
  }

  static createHeader(contractObject: PQContractType): Record<string, any>[] {
    const buyer: PQsupplier = DocumentExtractionService.getField(contractObject, "buyer");
    const supplier: PQsupplier = DocumentExtractionService.getField(contractObject, "suppliers[0]");

    const paragraphBuyer = PQFormattingService.createTextUnit(
      [
        { text: pqGenericBase.buyer, style: PDF_FILED_KEYS.BOLD_TEXT } as any,
        DocumentExtractionService.getField(buyer, "name", DEFAULT_TEXT_FIELDS.UNDERSCORES_40),
        pqNushTexts.edrpou,
        DocumentExtractionService.getField(buyer, "identifier.id", DEFAULT_TEXT_FIELDS.UNDERSCORES_16),
        pqAozTexts.representedBy,
        DocumentExtractionService.getField(buyer, "signerInfo.name", DEFAULT_TEXT_FIELDS.UNDERSCORES_68),
        pqBase.basisOf,
        DocumentExtractionService.getField(
          buyer,
          "signerInfo.authorizedBy",
          DocumentExtractionService.getField(buyer, "signerInfo.basisOf", DEFAULT_TEXT_FIELDS.UNDERSCORES_32)
        ),
        `${pqGenericBase.onOneSide} `,
        pqGenericBase.and,
      ],
      PQ_GENERIC_TITLE_MARGIN,
      PDF_FILED_KEYS.HEADER_DATA
    );

    const paragraphSupplier = PQFormattingService.createTextUnit(
      [
        { text: pqGenericBase.supplier, style: PDF_FILED_KEYS.BOLD_TEXT } as any,
        DocumentExtractionService.getField(supplier, "name", DEFAULT_TEXT_FIELDS.UNDERSCORES_40),
        pqAozTexts.edrpou,
        DocumentExtractionService.getField(supplier, "identifier.id", DEFAULT_TEXT_FIELDS.UNDERSCORES_16),
        pqAozTexts.supplierRepresentedBy,
        DocumentExtractionService.getField(supplier, "signerInfo.name", DEFAULT_TEXT_FIELDS.UNDERSCORES_68),
        pqBase.basisOf,
        DocumentExtractionService.getField(
          supplier,
          "signerInfo.authorizedBy",
          DocumentExtractionService.getField(supplier, "signerInfo.basisOf", DEFAULT_TEXT_FIELDS.UNDERSCORES_32)
        ),

        `${pqGenericBase.onOtherSide} `,
      ],
      PQ_GENERIC_TITLE_MARGIN,
      PDF_FILED_KEYS.HEADER_DATA
    );

    const paragraphLaw = PQFormattingService.createTextUnit(
      [pqAozTexts.headerEndPart],
      PQ_GENERIC_TITLE_MARGIN,
      PDF_FILED_KEYS.HEADER_DATA
    );

    return [paragraphBuyer, paragraphSupplier, paragraphLaw];
  }

  static createAddition1(contractObject: PQContractType | Record<any, any>): Record<string, any>[] {
    const isReadyToDisplay = ContractPendingChecker.isReadyToFillContract(contractObject);
    const tableItemsBody: PDFTableBodyType = SecondVersionFormatter.createGenericTableItemsBody(
      isReadyToDisplay ? contractObject : {},
      PROZORRO_TEMPLATE_CODES.DPA
    );
    const itemsTermsTable: PDFTableBodyType = this.createItemsTermsTable(isReadyToDisplay ? contractObject : {});

    const fullPrice = CompoundTextAdapter.convertToText(
      "value.amount",
      FormattingFunctionsEnum.PRICE_WITH_TAX_TO_TEXT,
      contractObject,
      DEFAULT_TEXT_FIELDS.DPA_PRICE
    );

    return [
      this.createAdditionHeader(1, contractObject),
      PDFTablesHandler.resolveTableBug(
        PDFTablesHandler.createTable(tableItemsBody, TABLES_HELPER.PQ_GENERIC_TABLE_ITEMS_WIDTH),
        {
          text: pqAozTexts.goodsSpecificationTitle,
          style: PDF_FILED_KEYS.HEADING,
          margin: PQ_SPECIFICATION_HEADING_MARGIN,
        }
      ),
      PDFTablesHandler.resolveTableBug(
        PDFTablesHandler.createTable(itemsTermsTable, TABLES_HELPER.PQ_AOZ_ITEM_TERMS_TABLE_WIDTH),
        {}
      ),
      {
        text: `${pqAozTexts.goodPrice}${fullPrice}`,
        style: PDF_FILED_KEYS.ITALIC_TEXT,
        margin: PQ_LIST_HEADING_MARGIN,
      },
      {
        text: pqAozTexts.freeTax,
        style: PDF_FILED_KEYS.ITALIC_TEXT,
        margin: PQ_LIST_HEADING_MARGIN,
      },
      {
        text: pqAozTexts.signersTitle,
        style: PDF_FILED_KEYS.HEADING,
        margin: PQ_LIST_HEADING_MARGIN,
      },
      SecondVersionFormatter.createContactsTable(contractObject, pqAozTexts.performerCapitalize),
      SecondVersionFormatter.createSignatureBlock(contractObject),
    ];
  }

  static createAddition2(contractObject: PQContractType | Record<any, any>): Record<string, any>[] {
    const isReadyToDisplay = ContractPendingChecker.isReadyToFillContract(contractObject);
    const itemsQuantityTable: PDFTableBodyType = this.createItemsQuantityTable(isReadyToDisplay ? contractObject : {});

    return [
      this.createAdditionHeader(2, contractObject),
      PDFTablesHandler.resolveTableBug(
        PDFTablesHandler.createTable(itemsQuantityTable, TABLES_HELPER.PQ_AOZ_ITEM_QUANTITY_TABLE_WIDTH),
        {
          text: pqAozTexts.productCompletenessTitle,
          style: PDF_FILED_KEYS.HEADING,
          margin: PQ_SPECIFICATION_HEADING_MARGIN,
        }
      ),
      {
        text: pqAozTexts.signersTitle,
        style: PDF_FILED_KEYS.HEADING,
        margin: PQ_LIST_HEADING_MARGIN,
      },
      SecondVersionFormatter.createContactsTable(contractObject, pqAozTexts.performerCapitalize),
      SecondVersionFormatter.createSignatureBlock(contractObject),
    ];
  }

  static createAddition3(contractObject: PQContractType | Record<any, any>): Record<string, any>[] {
    return [
      this.createAdditionHeader(3, contractObject, "landscape"),
      {
        text: pqAozTexts.additional3Title,
        style: PDF_FILED_KEYS.HEADING_PQ,
      },
      {
        text: pqAozTexts.additional3StartForm,
        style: PDF_FILED_KEYS.CONTENT,
      },
      {
        text: pqAozTexts.additional3Subtitle,
        style: PDF_FILED_KEYS.HEADING_PQ,
      },
      { text: DEFAULT_TEXT_FIELDS.UNDERSCORES_10 },
      PQFormattingService.createTextUnit([
        {
          text: pqAozTexts.additional3Buyer,
          style: PDF_FILED_KEYS.BOLD_TEXT,
        } as any,
        `${pqGenericBase.representedBy} ${DEFAULT_TEXT_FIELDS.UNDERSCORES_16}`,
      ]),
      PQFormattingService.createTextUnit([
        {
          text: pqAozTexts.additional3Supplier,
          style: PDF_FILED_KEYS.BOLD_TEXT,
        } as any,
        `${pqGenericBase.representedBy} ${DEFAULT_TEXT_FIELDS.UNDERSCORES_32},`,
      ]),
      PQFormattingService.createTextUnit([
        {
          text: pqAozTexts.additional3Recipient,
          style: PDF_FILED_KEYS.BOLD_TEXT,
        } as any,
        `${pqGenericBase.representedBy} ${DEFAULT_TEXT_FIELDS.UNDERSCORES_32}${pqAozTexts.additional3RecipientEnd}`,
      ]),
      PDFTablesHandler.resolveTableBug(
        PDFTablesHandler.createTable(
          [
            deepClone(aozActOfAcceptanceAndTransferTableHeader),
            [
              {
                text: pqAozTexts.bp,
                style: PDF_FILED_KEYS.BOLD_TEXT,
                colSpan: 5,
              },
              {},
              {},
              {},
              {},
              {
                text: pqAozTexts.deliveryDate,
                style: PDF_FILED_KEYS.BOLD_TEXT,
                colSpan: 3,
              },
            ],
            [{}, { text: "*" }, {}, {}, {}, {}, {}, {}],
            [
              {
                text: pqAozTexts.fullPriceWithTax,
                style: { bold: true, alignment: "right" },
                colSpan: 7,
              },
              {},
              {},
              {},
              {},
              {},
              {},
              {},
            ],
            [
              {
                text: pqAozTexts.tax,
                style: { bold: true, alignment: "right" } as any,
                colSpan: 7,
              },
              {},
              {},
              {},
              {},
              {},
              {},
              {},
            ],
            [
              {
                text: pqAozTexts.fullPriceWithoutTax,
                style: { bold: true, alignment: "right" } as any,
                colSpan: 7,
              },
              {},
              {},
              {},
              {},
              {},
              {},
              {},
            ],
            [
              {
                text: pqAozTexts.addition3TableDesc,
                style: PDF_FILED_KEYS.ITALIC_TEXT,
                colSpan: 7,
              },
              {},
              {},
              {},
              {},
              {},
              {},
              {},
            ],
          ],
          TABLES_HELPER.PQ_AOZ_ACT_OF_ACCEPTANCE_AND_TRANSFER_TABLE_WIDTH
        ),
        {}
      ),
      { text: pqAozTexts.addition3TextPartOne },
      PDFTablesHandler.createTable(
        [
          [
            { text: "(підкреслити необхідне)", style: PDF_FILED_KEYS.CONTENT },
            { text: "(вказати, що саме не відповідає)", style: PDF_FILED_KEYS.CONTENT },
          ],
        ],
        [PDF_HELPER_CONST.ROW_ALL_WIDTH, PDF_HELPER_CONST.ROW_ALL_WIDTH],
        { fontSize: 10 } as any,
        PDF_HELPER_CONST.LINE_HEIGHT_10,
        1,
        true,
        PDF_HELPER_CONST.TABLE_LAYOUT_NO_BORDERS
      ),
      { text: pqAozTexts.addition3TextPartTwo, style: PDF_FILED_KEYS.TABLE_DATA },
      {
        text: pqAozTexts.addition3TextPartThree,
        style: { fontSize: 10 },
        margin: PQ_GENERIC_TITLE_MARGIN,
      },
      PDFTablesHandler.resolveTableBug(
        PDFTablesHandler.createTable(
          [
            [
              "Акт складено:",
              {
                text: "на __________ (____________________________________________________________) аркушах в 5 (п’яти) примірниках",
                colSpan: 3,
              },
              {},
              {},
            ],
            [
              PQFormattingService.createTextUnit([
                {
                  text: "ВИКОНАВЕЦЬ",
                  style: PDF_FILED_KEYS.BOLD_TEXT,
                } as any,
                `\n(керівник або уповноважена ним особа) \n
                 _______________________________
                 М.П. \n
                 “____” __________________ 202_ р.`,
              ]),
              PQFormattingService.createTextUnit([
                {
                  text: "ВИКОНАВЕЦЬ",
                  style: PDF_FILED_KEYS.BOLD_TEXT,
                } as any,
                `\nпредставник, присутній при безпосередній передачі товару)
                (за необхідності) \n
                 _______________________________ \n
                 “____” __________________ 202_ р.`,
              ]),
              PQFormattingService.createTextUnit([
                {
                  text: "ОТРИМУВАЧ",
                  style: PDF_FILED_KEYS.BOLD_TEXT,
                } as any,
                `\n(керівник або уповноважена ним особа) \n
                 _______________________________
                 М.П. \n
                 “____” __________________ 202_ р.`,
              ]),
              PQFormattingService.createTextUnit([
                {
                  text: "ОТРИМУВАЧ",
                  style: PDF_FILED_KEYS.BOLD_TEXT,
                } as any,
                `\n(відповідальна особа) (за необхідності) \n
                 _______________________________ \n
                 “____” __________________ 202_ р.`,
              ]),
            ],
            [
              PQFormattingService.createTextUnit([
                {
                  text: "ЗАМОВНИК",
                  style: PDF_FILED_KEYS.BOLD_TEXT,
                } as any,
                `\n _______________________________
                 М.П. \n
                 “____” __________________ 202_ р.`,
              ]),
              {},
              {},
              {},
            ],
          ],
          [
            PDF_HELPER_CONST.ROW_ALL_WIDTH,
            PDF_HELPER_CONST.ROW_ALL_WIDTH,
            PDF_HELPER_CONST.ROW_ALL_WIDTH,
            PDF_HELPER_CONST.ROW_ALL_WIDTH,
          ],
          { fontSize: 10 } as any,
          PDF_HELPER_CONST.LINE_HEIGHT_20,
          1,
          true,
          PDF_HELPER_CONST.TABLE_LAYOUT_NO_BORDERS
        ),
        {}
      ),
      {
        text: pqAozTexts.additional3EndForm,
        style: PDF_FILED_KEYS.CONTENT,
      },
      {
        text: pqAozTexts.signersTitle,
        style: PDF_FILED_KEYS.HEADING,
        margin: PQ_LIST_HEADING_MARGIN,
      },
      SecondVersionFormatter.createContactsTable(contractObject, pqAozTexts.performerCapitalize),
      SecondVersionFormatter.createSignatureBlock(contractObject),
    ];
  }

  static createAddition4(contractObject: PQContractType | Record<any, any>): Record<string, any>[] {
    return [
      this.createAdditionHeader(4, contractObject, "landscape"),
      {
        text: pqAozTexts.additional4Title,
        style: PDF_FILED_KEYS.TITLE_MEDIUM,
      },
      {
        text: pqAozTexts.additional3StartForm,
        style: PDF_FILED_KEYS.CONTENT,
      },
      PDFTablesHandler.resolveTableBug(
        PDFTablesHandler.createTable(
          [
            [
              {
                text: pqAozTexts.performer,
                style: PDF_FILED_KEYS.BOLD_TEXT,
              },
              pqAozTexts.performerName,
            ],
            [
              {
                text: pqAozTexts.customer,
                style: PDF_FILED_KEYS.BOLD_TEXT,
              },
              pqAozTexts.customerName,
            ],
            [
              {
                text: pqAozTexts.recipient,
                style: PDF_FILED_KEYS.BOLD_TEXT,
              },
              pqAozTexts.recipientName,
            ],
            [
              {
                text: pqAozTexts.govContract,
                style: PDF_FILED_KEYS.BOLD_TEXT,
              },
              pqAozTexts.govContractName,
            ],
            [
              {
                text: pqAozTexts.deliveryDate,
                style: PDF_FILED_KEYS.BOLD_TEXT,
                colSpan: 2,
              },
              {},
            ],
          ],
          TABLES_HELPER.PQ_AOZ_EXPENSE_INVOICE_FORM_TABLE_WIDTH,
          { fontSize: 10 } as any,
          PDF_HELPER_CONST.LINE_HEIGHT_20,
          1,
          true,
          PDF_HELPER_CONST.TABLE_LAYOUT_NO_BORDERS
        ),
        {}
      ),
      PDFTablesHandler.resolveTableBug(
        PDFTablesHandler.createTable(
          [
            deepClone(aozActOfAcceptanceAndTransferTableHeader),
            [{}, { text: "*" }, {}, {}, {}, {}, {}, {}],
            [
              {
                text: pqAozTexts.fullPriceWithTax,
                style: { bold: true, alignment: "right" },
                colSpan: 7,
              },
              {},
              {},
              {},
              {},
              {},
              {},
              {},
            ],
            [
              {
                text: pqAozTexts.tax,
                style: { bold: true, alignment: "right" } as any,
                colSpan: 7,
              },
              {},
              {},
              {},
              {},
              {},
              {},
              {},
            ],
            [
              {
                text: pqAozTexts.fullPriceWithoutTax,
                style: { bold: true, alignment: "right" } as any,
                colSpan: 7,
              },
              {},
              {},
              {},
              {},
              {},
              {},
              {},
            ],
            [
              {
                text: pqAozTexts.additional4TableFullPriceWithVat,
                colSpan: 8,
              },
              {},
              {},
              {},
              {},
              {},
              {},
              {},
            ],
            [
              {
                text: pqAozTexts.addition3TableDesc,
                style: PDF_FILED_KEYS.ITALIC_TEXT,
                colSpan: 7,
              },
              {},
              {},
              {},
              {},
              {},
              {},
              {},
            ],
            [
              {
                text: pqAozTexts.additional4TableAdditionalDesc1,
                colSpan: 8,
              },
              {},
              {},
              {},
              {},
              {},
              {},
              {},
            ],
            [
              {
                text: pqAozTexts.additional4TableAdditionalDesc2,
                colSpan: 8,
              },
              {},
              {},
              {},
              {},
              {},
              {},
              {},
            ],
          ],
          TABLES_HELPER.PQ_AOZ_ACT_OF_ACCEPTANCE_AND_TRANSFER_TABLE_WIDTH
        ),
        {
          text: pqAozTexts.additional4TableTitle,
          style: PDF_FILED_KEYS.HEADING_PQ,
        }
      ),
      this.performerAndRecipientSignForm(),
      {
        text: pqAozTexts.additional3EndIndicativeForm,
        style: PDF_FILED_KEYS.CONTENT,
      },
      this.performerAndRecipientSignForm(),
      {
        text: pqAozTexts.additional3EndForm,
        style: PDF_FILED_KEYS.CONTENT,
      },
      {
        text: pqAozTexts.signersTitle,
        style: PDF_FILED_KEYS.HEADING,
        margin: PQ_LIST_HEADING_MARGIN,
      },
      SecondVersionFormatter.createContactsTable(contractObject, pqAozTexts.performerCapitalize),
      SecondVersionFormatter.createSignatureBlock(contractObject),
    ];
  }

  static createAddition5(contractObject: PQContractType | Record<any, any>): Record<string, any>[] {
    return [
      this.createAdditionHeader(5, contractObject, "portrait"),
      {
        text: pqAozTexts.additional5Title,
        style: PDF_FILED_KEYS.TITLE_MEDIUM,
      },
      {
        text: pqAozTexts.additional5StartOfSample,
        style: PDF_FILED_KEYS.CONTENT,
        margin: [0, 20, 0, 10],
      },
      PDFTablesHandler.resolveTableBug(
        PDFTablesHandler.createTable(
          [
            [
              `Від _____________ \n
              вих. №___________`,
              `Державне підприємство Міністерства оборони України “Агенція оборонних закупівель” \n
              ______________________________
              (назва юридичної особи заявника) \n
              ______________________________
              (ПІБ та посада уповноваженої особи заявника)`,
            ],
          ],
          [PDF_HELPER_CONST.ROW_ALL_WIDTH, PDF_HELPER_CONST.ROW_ALL_WIDTH]
        ),
        {}
      ),
      {
        text: pqAozTexts.statement,
        style: PDF_FILED_KEYS.TITLE_MEDIUM,
        margin: [0, 20, 0, 10],
      },
      {
        text: pqAozTexts.statementDesc,
        margin: [0, 0, 0, 10],
      },
      { text: pqAozTexts.supplierCard },
      PDFTablesHandler.resolveTableBug(
        PDFTablesHandler.createTable(
          [
            ["Постачальник", "ТОВ «ДРОН»"],
            ["ЄДРПОУ (ІПН юр. особи)", "0001112223"],
            [`Відповідальна особа по інтеграції + контактні дані`, "Керівник направлення або керівник відділу"],
          ],
          [PDF_HELPER_CONST.ROW_WIDTH_150, PDF_HELPER_CONST.ROW_ALL_WIDTH]
        ),
        {}
      ),
      {
        text: pqAozTexts.userList,
        margin: [0, 20, 0, 0],
      },
      PDFTablesHandler.resolveTableBug(
        PDFTablesHandler.createTable(
          [
            [
              {
                text: "Прізвище",
                style: PDF_FILED_KEYS.TITLE_MEDIUM_BOLD,
                margin: [0, 13, 0, 0],
              },
              {
                text: "Ім'я",
                style: PDF_FILED_KEYS.TITLE_MEDIUM_BOLD,
                margin: [0, 13, 0, 0],
              },
              {
                text: "Пошта",
                style: PDF_FILED_KEYS.TITLE_MEDIUM_BOLD,
                margin: [0, 13, 0, 0],
              },
              {
                text: "РНОКПП",
                style: PDF_FILED_KEYS.TITLE_MEDIUM_BOLD,
                margin: [0, 13, 0, 0],
              },
            ],
            [
              {
                text: "Павленко",
                style: PDF_FILED_KEYS.ITALIC_TEXT,
              },
              {
                text: "Павленко",
                style: PDF_FILED_KEYS.ITALIC_TEXT,
              },
              {
                text: "p.pavlo@gmail.com",
                style: PDF_FILED_KEYS.ITALIC_TEXT,
              },
              {
                text: `1234567890 – РНОКПП
                потрібно для входу в систему через електронний ключ КЕП`,
                style: PDF_FILED_KEYS.ITALIC_TEXT,
              },
            ],
            [
              {
                text: "Воля",
                style: PDF_FILED_KEYS.ITALIC_TEXT,
              },
              {
                text: "Ольга",
                style: PDF_FILED_KEYS.ITALIC_TEXT,
              },
              {
                text: "o.volya@ex.ua",
                style: PDF_FILED_KEYS.ITALIC_TEXT,
              },
              {
                text: `0123456789 – РНОКПП
                потрібно для входу в систему через електронний ключ КЕП`,
                style: PDF_FILED_KEYS.ITALIC_TEXT,
              },
            ],
          ],
          [
            PDF_HELPER_CONST.ROW_WIDTH_90,
            PDF_HELPER_CONST.ROW_WIDTH_90,
            PDF_HELPER_CONST.ROW_WIDTH_125,
            PDF_HELPER_CONST.ROW_ALL_WIDTH,
          ]
        ),
        {}
      ),
      {
        text: pqAozTexts.statementResponsibility,
        margin: [0, 10, 0, 20],
      },
      PDFTablesHandler.resolveTableBug(
        PDFTablesHandler.createTable(
          [
            [
              {
                text: `____________________
                  посада`,
                style: PDF_FILED_KEYS.CONTENT,
              },
              {
                text: `____________________
                  підпис`,
                style: PDF_FILED_KEYS.CONTENT,
              },
              {
                text: `____________________
                  П.І.Б.`,
                style: PDF_FILED_KEYS.CONTENT,
              },
            ],
            [{}, {}, "М.П."],
          ],
          [PDF_HELPER_CONST.ROW_ALL_WIDTH, PDF_HELPER_CONST.ROW_ALL_WIDTH, PDF_HELPER_CONST.ROW_ALL_WIDTH],
          {} as any,
          PDF_HELPER_CONST.LINE_HEIGHT_20,
          1,
          true,
          PDF_HELPER_CONST.TABLE_LAYOUT_NO_BORDERS
        ),
        {}
      ),
      {
        text: pqAozTexts.additional5EndOfSample,
        style: PDF_FILED_KEYS.CONTENT,
        margin: [0, 20, 0, 0],
      },
      {
        text: pqAozTexts.signersTitle,
        style: PDF_FILED_KEYS.HEADING,
        margin: PQ_LIST_HEADING_MARGIN,
      },
      SecondVersionFormatter.createContactsTable(contractObject, pqAozTexts.performerCapitalize),
      SecondVersionFormatter.createSignatureBlock(contractObject),
    ];
  }

  static createAddition6(contractObject: PQContractType | Record<any, any>): Record<string, any>[] {
    return [
      this.createAdditionHeader(6, contractObject, "portrait"),
      {
        text: pqAozTexts.additional6Title,
        style: PDF_FILED_KEYS.TITLE_MEDIUM,
      },
      {
        text: pqAozTexts.additional6StartOfSample,
        style: PDF_FILED_KEYS.CONTENT,
        margin: [0, 20, 0, 10],
      },
      PDFTablesHandler.resolveTableBug(
        PDFTablesHandler.createTable(
          [
            [
              {
                text: "Державний контракт:",
                style: PDF_FILED_KEYS.BOLD_TEXT,
              },
              "№ __________ від _______________",
            ],
            [
              {
                text: "Видаткова накладна:",
                style: PDF_FILED_KEYS.BOLD_TEXT,
              },
              "№ __________ (______________) від _______________",
            ],
            [
              {
                text: "Виконавець:",
                style: PDF_FILED_KEYS.BOLD_TEXT,
              },
              `НАЙМЕНУВАННЯ ВИКОНАВЦЯ «_______»
              код ЄДРПОУ _________`,
            ],
            [
              {
                text: "Отримувач:",
                style: PDF_FILED_KEYS.BOLD_TEXT,
              },
              `Військова частина __________
              Код ЄДРПОУ ____________
              Підрозділ _______________`,
            ],
          ],
          [PDF_HELPER_CONST.ROW_WIDTH_125, PDF_HELPER_CONST.ROW_ALL_WIDTH],
          { fontSize: 11 } as any,
          PDF_HELPER_CONST.LINE_HEIGHT_10,
          1,
          true,
          PDF_HELPER_CONST.TABLE_LAYOUT_NO_BORDERS
        ),
        {}
      ),
      PDFTablesHandler.resolveTableBug(
        PDFTablesHandler.createTable(
          [
            [
              {
                text: "№",
                style: PDF_FILED_KEYS.BOLD_TEXT,
              },
              { text: "Найменування", style: PDF_FILED_KEYS.BOLD_TEXT },
              { text: "Серійний номер **", style: PDF_FILED_KEYS.BOLD_TEXT },
              { text: "Номер партії **", style: PDF_FILED_KEYS.BOLD_TEXT },
            ],
            [{}, { text: "*" }, {}, {}],
          ],
          [
            PDF_HELPER_CONST.ROW_WIDTH_20,
            PDF_HELPER_CONST.ROW_WIDTH_200,
            PDF_HELPER_CONST.ROW_WIDTH_110,
            PDF_HELPER_CONST.ROW_ALL_WIDTH,
          ],
          { fontSize: 11 } as any,
          PDF_HELPER_CONST.LINE_HEIGHT_10
        ),
        {
          text: pqAozTexts.additional4TableTitle,
          style: PDF_FILED_KEYS.HEADING_PQ,
        }
      ),
      {
        text: pqAozTexts.addition3TableDesc,
        style: { italics: true } as any,
      },
      {
        text: pqAozTexts.additional6InformationIsCompiledOn,
        style: { fontSize: 11 } as any,
        margin: [0, 10, 0, 0],
      },
      PDFTablesHandler.resolveTableBug(
        PDFTablesHandler.createTable(
          [
            [
              {
                text: "М.П.",
                style: { alignment: "right" } as any,
                rowSpan: 2,
                margin: [0, 28, 0, 0],
              },
              {
                text: "ВИКОНАВЕЦЬ",
                style: [PDF_FILED_KEYS.TITLE_MEDIUM_BOLD, PDF_FILED_KEYS.TITLE_MEDIUM],
              },
              {},
              {
                text: "М.П.",
                style: { alignment: "right" } as any,
                rowSpan: 2,
                margin: [0, 28, 0, 0],
              },
              {
                text: "ОТРИМУВАЧ",
                style: [PDF_FILED_KEYS.TITLE_MEDIUM_BOLD, PDF_FILED_KEYS.TITLE_MEDIUM],
              },
            ],
            [
              {},
              {
                text: `_______________________________
                 “____” __________________ 202_ р.`,
                style: { alignment: "center" } as any,
              },
              {},
              {},
              {
                text: `_______________________________
                 “____” __________________ 202_ р.`,
                style: { alignment: "center" } as any,
              },
            ],
            [
              {
                text: `Діє на підставі довіреності (доручення)
                від "____" ___________________ 202_ р. № _____`,
                colSpan: 2,
              },
              {},
              {},
              {
                text: `Діє на підставі довіреності (доручення)
                від "____" ___________________ 202_ р. № _____`,
                colSpan: 2,
              },
              {},
            ],
          ],
          [
            PDF_HELPER_CONST.ROW_WIDTH_30,
            PDF_HELPER_CONST.ROW_ALL_WIDTH,
            PDF_HELPER_CONST.ROW_WIDTH_50,
            PDF_HELPER_CONST.ROW_WIDTH_30,
            PDF_HELPER_CONST.ROW_ALL_WIDTH,
          ],
          { fontSize: 11 } as any,
          PDF_HELPER_CONST.LINE_HEIGHT_20,
          1,
          true,
          PDF_HELPER_CONST.TABLE_LAYOUT_NO_BORDERS
        ),
        {}
      ),
      {
        text: pqAozTexts.additional6EndOfSample,
        style: PDF_FILED_KEYS.CONTENT,
        margin: [0, 20, 0, 0],
      },
      {
        text: pqAozTexts.signersTitle,
        style: PDF_FILED_KEYS.HEADING,
        margin: PQ_LIST_HEADING_MARGIN,
      },
      SecondVersionFormatter.createContactsTable(contractObject, pqAozTexts.performerCapitalize),
      SecondVersionFormatter.createSignatureBlock(contractObject),
    ];
  }

  static createAdditionHeader(
    number: number,
    contractObject: PQContractType | Record<any, any>,
    pageOrientation?: "landscape" | "portrait"
  ): Record<string, any> {
    const dateSigned = DateHandler.prepareDateSigned(contractObject?.["dateSigned"], "року");
    const contractID = contractObject?.["contractID"] || DEFAULT_TEXT_FIELDS.UNDERSCORES_16;
    return [
      {
        text: `${pqAozTexts.addition}${number}`,
        style: PDF_FILED_KEYS.SPECIFICATION_HEADING,
        margin: PQ_GENERIC_HEADER_END_MARGIN,
        pageBreak: "before",
        pageOrientation,
      },
      {
        text: pqAozTexts.toStateContract,
        style: PDF_FILED_KEYS.SPECIFICATION_HEADING,
        margin: PQ_GENERIC_HEADER_END_MARGIN,
      },
      {
        text: `${pqAozTexts.number}${contractID}`,
        style: PDF_FILED_KEYS.SPECIFICATION_HEADING,
        margin: PQ_GENERIC_HEADER_END_MARGIN,
      },
      {
        text: `від ${dateSigned}`,
        style: PDF_FILED_KEYS.SPECIFICATION_HEADING,
        margin: PQ_GENERIC_HEADER_END_MARGIN,
      },
    ];
  }

  static createItemsTermsTable({ items = [] }: PQContractType | Record<any, any>): PDFTableBodyType {
    const tableAddressBody: PDFTableBodyType = [];

    tableAddressBody.push(aozItemTermsTableHeader);

    if ((items as [])?.length) {
      (items as PQItem[]).forEach((item, index) =>
        tableAddressBody.push([
          `${index + 1}`,
          DocumentExtractionService.getField(item, "description"),
          DateHandler.fullDate(item?.deliveryDate?.endDate, "до "),
        ])
      );
    } else {
      tableAddressBody.push(["1", {}, {}]);
    }

    return tableAddressBody;
  }

  static createItemsQuantityTable({ items = [] }: PQContractType | Record<any, any>): PDFTableBodyType {
    const tableAddressBody: PDFTableBodyType = [];

    tableAddressBody.push(aozItemQuantityTableHeader);

    if ((items as [])?.length) {
      (items as PQItem[]).forEach((item, index) =>
        tableAddressBody.push([`${index + 1}`, item?.description, item?.quantity?.toString() ?? STRING.EXTRA_LONG_DASH])
      );
    } else {
      tableAddressBody.push(["1", {}, {}]);
    }

    return tableAddressBody;
  }

  static performerAndRecipientSignForm(): Record<string, any> {
    return PDFTablesHandler.resolveTableBug(
      PDFTablesHandler.createTable(
        [
          [
            {
              text: "М.П.",
              style: { alignment: "right" } as any,
              rowSpan: 2,
              margin: [0, 17, 0, 0],
            },
            {
              text: "ВИКОНАВЕЦЬ",
              style: [PDF_FILED_KEYS.TITLE_MEDIUM_BOLD, PDF_FILED_KEYS.TITLE_MEDIUM],
            },
            {},
            {
              text: "М.П.",
              style: { alignment: "right" } as any,
              rowSpan: 2,
              margin: [0, 17, 0, 0],
            },
            {
              text: "ОТРИМУВАЧ",
              style: [PDF_FILED_KEYS.TITLE_MEDIUM_BOLD, PDF_FILED_KEYS.TITLE_MEDIUM],
            },
          ],
          [
            {},
            {
              text: `_______________________________
                 “____” __________________ 202_ р.`,
              style: { alignment: "center" } as any,
            },
            {},
            {},
            {
              text: `_______________________________
                 “____” __________________ 202_ р.`,
              style: { alignment: "center" } as any,
            },
          ],
          [
            {
              text: `Діє на підставі довіреності (доручення)
                від "____" ___________________ 202_ р. № _____`,
              colSpan: 2,
            },
            {},
            {},
            {
              text: `Діє на підставі довіреності (доручення)
                від "____" ___________________ 202_ р. № _____`,
              colSpan: 2,
            },
            {},
          ],
        ],
        [
          PDF_HELPER_CONST.ROW_WIDTH_65,
          PDF_HELPER_CONST.ROW_ALL_WIDTH,
          PDF_HELPER_CONST.ROW_WIDTH_110,
          PDF_HELPER_CONST.ROW_WIDTH_65,
          PDF_HELPER_CONST.ROW_ALL_WIDTH,
        ],
        { fontSize: 12 } as any,
        PDF_HELPER_CONST.LINE_HEIGHT_20,
        1,
        true,
        PDF_HELPER_CONST.TABLE_LAYOUT_NO_BORDERS
      ),
      {}
    );
  }
}
