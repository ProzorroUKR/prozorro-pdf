import { get } from "lodash";
import type { PQContractType, PQItem, PQsupplier } from "@/widgets/pq/types/PQTypes";
import { DocumentExtractionService } from "@/services/PDF/document/DocumentExtractionService";
import { PQFormattingService } from "@/widgets/pq/services/Formating/PQFormattingService";
import {
  pqGenericAddition1Texts,
  pqGenericAddition2Texts,
  pqGenericBase,
} from "@/widgets/pq/templates/generic/configs/pqGenericTexts";
import { DEFAULT_TEXT_FIELDS, STRING } from "@/constants/string";
import { pqBase, pqSignature } from "@/widgets/pq/configs/pqTexts";
import {
  HEADING_MARGIN,
  PQ_GENERIC_HEADER_END_MARGIN,
  PQ_GENERIC_HEADER_START_MARGIN,
  PQ_PARAGRAPH_MARGIN,
} from "@/widgets/pq/configs/margins";
import { PDF_FILED_KEYS } from "@/constants/pdf/pdfFieldKeys";
import { DateHandler } from "@/utils/DateHandler";
import { AllVersionFormatter } from "@/widgets/pq/services/contractTextFormatters/AllVersionFormatter";
import { ContractPendingChecker } from "@/widgets/pq/utils/ContractPendingChecker";
import type { PDFTableBodyType } from "@/widgets/pq/types/TextConfigType";
import { ProductAttributesHandler } from "@/widgets/pq/services/Products/ProductAttributesHandler";
import { PDFTablesHandler } from "@/services/PDF/Formatting/PDFTablesHandler";
import * as TABLES_HELPER from "@/widgets/pq/configs/tablesConfig";
import * as PDF_HELPER_CONST from "@/constants/pdf/pdfHelperConstants";
import { PriceHandler } from "@/services/Common/PriceHandler";
import { TemplateToTableHead } from "@/widgets/pq/configs/TableHead.map";
import {
  genericTableAddressHeader,
  genericTableItemsHeader,
} from "@/widgets/pq/templates/generic/configs/genericContract.config";
import { StringHandler } from "@/utils/StringHandler";
import { ADDRESS_ORDER } from "@/config/pdf/addressOrder";
import type { TenderOfferType } from "@/types/TenderOffer/Tender";
import { ContractEnsuring } from "@/widgets/pq/services/ContractEnsuring/ContractEnsuring";
import type { AddressType } from "@/types/Tender/AddressType";
import { PROZORRO_TEMPLATE_CODES } from "@/widgets/pq/types/TemplateCodes.enum";

export class SecondVersionFormatter {
  static createGenericHeader(
    contractObject: PQContractType,
    tender: TenderOfferType | Record<string, any>
  ): Record<string, any>[] {
    const buyer: PQsupplier = DocumentExtractionService.getField(contractObject, "buyer");
    const supplier: PQsupplier = DocumentExtractionService.getField(contractObject, "suppliers[0]");

    const paragraphBuyer = PQFormattingService.createTextUnit(
      [
        pqGenericBase.buyer,
        DocumentExtractionService.getField(buyer, "name", DEFAULT_TEXT_FIELDS.UNDERSCORES_40),
        pqGenericBase.edrpou,
        DocumentExtractionService.getField(buyer, "identifier.id", DEFAULT_TEXT_FIELDS.UNDERSCORES_16),
        pqGenericBase.representedBy,
        DocumentExtractionService.getField(buyer, "signerInfo.name", DEFAULT_TEXT_FIELDS.UNDERSCORES_68),
        pqBase.basisOf,
        DocumentExtractionService.getField(
          buyer,
          "signerInfo.authorizedBy",
          DocumentExtractionService.getField(buyer, "signerInfo.basisOf", DEFAULT_TEXT_FIELDS.UNDERSCORES_32)
        ),
        pqGenericBase.onOneSide,
      ],
      PQ_GENERIC_HEADER_START_MARGIN,
      PDF_FILED_KEYS.HEADER_DATA
    );

    const paragraphSupplier = PQFormattingService.createTextUnit(
      [
        pqGenericBase.supplier,
        DocumentExtractionService.getField(supplier, "name", DEFAULT_TEXT_FIELDS.UNDERSCORES_40),
        pqGenericBase.edrpou,
        DocumentExtractionService.getField(supplier, "identifier.id", DEFAULT_TEXT_FIELDS.UNDERSCORES_16),
        pqGenericBase.representedBy,
        DocumentExtractionService.getField(supplier, "signerInfo.name", DEFAULT_TEXT_FIELDS.UNDERSCORES_68),
        pqBase.basisOf,
        DocumentExtractionService.getField(
          supplier,
          "signerInfo.authorizedBy",
          DocumentExtractionService.getField(supplier, "signerInfo.basisOf", DEFAULT_TEXT_FIELDS.UNDERSCORES_32)
        ),
        pqGenericBase.onOtherSide,
      ],
      PQ_PARAGRAPH_MARGIN,
      PDF_FILED_KEYS.HEADER_DATA
    );

    const paragraphLaw = PQFormattingService.createTextUnit(
      [
        pqGenericBase.withProposal,
        DocumentExtractionService.getField(tender, "tenderID", DEFAULT_TEXT_FIELDS.UNDERSCORES_16),
        pqGenericBase.ruledByLaw,
      ],
      PQ_PARAGRAPH_MARGIN,
      PDF_FILED_KEYS.HEADER_DATA
    );

    const paragraphAgreed = PQFormattingService.createTextUnit(
      [
        pqGenericBase.agreed,
        DocumentExtractionService.getField(contractObject, "contractID", DEFAULT_TEXT_FIELDS.UNDERSCORES_16),
        pqGenericBase.fromDate,
        DateHandler.prepareDateSigned(DocumentExtractionService.getField(contractObject, "dateSigned"), "року"),
        pqGenericBase.agreementAbout,
      ],
      PQ_GENERIC_HEADER_END_MARGIN,
      PDF_FILED_KEYS.HEADER_DATA
    );

    return [
      paragraphBuyer,
      PQFormattingService.createTextUnit(pqGenericBase.and, PQ_PARAGRAPH_MARGIN, PDF_FILED_KEYS.HEADER_DATA),
      paragraphSupplier,
      PQFormattingService.createTextUnit(pqGenericBase.togetherNext, PQ_PARAGRAPH_MARGIN, PDF_FILED_KEYS.HEADER_DATA),
      paragraphLaw,
      paragraphAgreed,
    ];
  }

  static createGenericAddition1(
    contractObject: PQContractType | Record<any, any>,
    contractTemplateParam: PROZORRO_TEMPLATE_CODES
  ): Record<string, any>[] {
    const header = AllVersionFormatter.additionHeader(
      contractObject,
      contractTemplateParam,
      pqGenericAddition1Texts.addition1,
      pqGenericAddition1Texts.toContract +
        DocumentExtractionService.getField(contractObject, "contractID", DEFAULT_TEXT_FIELDS.UNDERSCORES_16),
      pqGenericAddition1Texts.specification,
      DateHandler.prepareDateSigned(DocumentExtractionService.getField(contractObject, "dateSigned"), "року")
    );

    const isReadyToDisplay = ContractPendingChecker.isReadyToFillContract(contractObject);
    const tableItemsBody: PDFTableBodyType = this.createGenericTableItemsBody(
      isReadyToDisplay ? contractObject : {},
      contractTemplateParam
    );
    const tableAddressBody: PDFTableBodyType = this.createGenericTableAddressBody(
      isReadyToDisplay ? contractObject : {}
    );
    const tableAttributesBody: PDFTableBodyType = isReadyToDisplay
      ? ProductAttributesHandler.createTableAttributesBody(
          DocumentExtractionService.getField(contractObject, "items", [])
        )
      : [[STRING.EMPTY]];

    return [
      header,
      PDFTablesHandler.resolveTableBug(
        PDFTablesHandler.createTable(tableItemsBody, TABLES_HELPER.PQ_GENERIC_TABLE_ITEMS_WIDTH),
        {}
      ),
      PDFTablesHandler.resolveTableBug(
        PDFTablesHandler.createTable(tableAddressBody, TABLES_HELPER.PQ_GENERIC_TABLE_ADDRESS_WIDTH),
        {
          text: pqGenericAddition1Texts.address,
          margin: HEADING_MARGIN,
        }
      ),
      PDFTablesHandler.resolveTableBug(
        PDFTablesHandler.createTable(
          tableAttributesBody,
          TABLES_HELPER.PQ_GENERIC_TABLE_ATTRIBUTES_WIDTH,
          PDF_FILED_KEYS.TABLE_DATA,
          PDF_HELPER_CONST.LINE_HEIGHT_10,
          0
        ),
        {
          text: pqGenericAddition1Texts.technicalFeatures,
          margin: HEADING_MARGIN,
        }
      ),
    ];
  }

  static createGenericTableItemsBody(
    contractObject: PQContractType | Record<any, any>,
    contractTemplateName: PROZORRO_TEMPLATE_CODES
  ): PDFTableBodyType {
    const { items = [] } = contractObject;
    const tableItemsBody: PDFTableBodyType = [];
    const currency = DocumentExtractionService.getField<string>(contractObject, "value.currency");
    const isTaxIncluded = DocumentExtractionService.getField<boolean>(
      contractObject,
      "value.valueAddedTaxIncluded",
      false
    );
    const totalPriceNoTax = DocumentExtractionService.getField<number>(contractObject, "value.amountNet", 0);
    const totalPriceWithTax = DocumentExtractionService.getField<number>(contractObject, "value.amount", 0);
    const totalTaxAmount = PriceHandler.addCurrency(isTaxIncluded ? totalPriceWithTax - totalPriceNoTax : 0, currency);

    tableItemsBody.push(TemplateToTableHead.get(contractTemplateName) || genericTableItemsHeader);

    if ((items as [])?.length) {
      (items as PQItem[]).forEach(({ description, quantity, unit }) => {
        const itemAmount: number = get(unit, "value.amount") as number;
        const itemCurrency: string = get(unit, "value.currency") || "";
        const tax = get(unit, "value.valueAddedTaxIncluded") ? " з ПДВ" : " без ПДВ";

        const pricePerOne = PriceHandler.addCurrency(itemAmount, itemCurrency);

        const fullPrice = PriceHandler.addCurrency(
          PriceHandler.getPrice(
            {
              currency,
              amount: itemAmount,
              valueAddedTaxIncluded: false,
            },
            Number(quantity)
          ),
          itemCurrency
        );

        tableItemsBody.push([
          description,
          quantity.toString(),
          unit?.name,
          `${pricePerOne}${tax}`,
          `${fullPrice}${tax}`,
        ]);
      });
    } else {
      tableItemsBody.push([{}, {}, {}, {}, {}]);
    }

    tableItemsBody.push([
      {
        text: pqGenericAddition1Texts.tax,
        colSpan: 4,
      },
      {},
      {},
      {},
      totalTaxAmount,
    ]);

    tableItemsBody.push([
      {
        text: pqGenericAddition1Texts.totalPriceItem,
        colSpan: 4,
      },
      {},
      {},
      {},
      PriceHandler.addCurrency(totalPriceWithTax, currency),
    ]);

    return tableItemsBody;
  }

  static createGenericTableAddressBody(contractObject: PQContractType | Record<any, any>): PDFTableBodyType {
    const { items = [] } = contractObject;
    const tableAddressBody: PDFTableBodyType = [];

    tableAddressBody.push(genericTableAddressHeader);

    if ((items as [])?.length) {
      (items as PQItem[]).forEach(item =>
        tableAddressBody.push([
          DocumentExtractionService.getField(item, "description"),
          StringHandler.customerLocation(
            DocumentExtractionService.getField(item, "deliveryAddress"),
            STRING.EMPTY,
            ADDRESS_ORDER.STREET_TO_COUNTRY
          ),
        ])
      );
    } else {
      tableAddressBody.push([{}, {}]);
    }

    return tableAddressBody;
  }

  static createGenericAddition2(
    contractObject: PQContractType | Record<any, any>,
    contractTemplateParam: PROZORRO_TEMPLATE_CODES,
    tenderObject: TenderOfferType | Record<any, any>
  ): Record<string, any>[] {
    const header = AllVersionFormatter.additionHeader(
      contractObject,
      contractTemplateParam,
      pqGenericAddition2Texts.addition2,
      pqGenericAddition1Texts.toContract +
        DocumentExtractionService.getField(contractObject, "contractID", DEFAULT_TEXT_FIELDS.UNDERSCORES_16),
      pqGenericAddition2Texts.enforcementTitle,
      DateHandler.prepareDateSigned(DocumentExtractionService.getField(contractObject, "dateSigned"), "року")
    );

    const listText: Record<string, any> = this.createContractEnsuring(contractObject, tenderObject);

    return [
      header,
      listText,
      {
        text: STRING.EMPTY,
        margin: PQ_GENERIC_HEADER_START_MARGIN,
      },
      this.createContactsTable(contractObject),
      this.createSignatureBlock(contractObject),
    ];
  }

  static createContractEnsuring(
    contractObject: PQContractType | Record<any, any>,
    tenderObject: TenderOfferType | Record<any, any>
  ): Record<string, any> {
    const contractEnsuringHelper = new ContractEnsuring(
      tenderObject as TenderOfferType,
      DocumentExtractionService.getField<string>(contractObject, "awardID", STRING.EMPTY)
    );
    return contractEnsuringHelper.createEnsuringList();
  }

  static createContactsTable(contractObject: PQContractType | Record<any, any>): Record<string, any> {
    const { buyer } = contractObject;
    const supplier = DocumentExtractionService.getField<PQsupplier | string>(contractObject, "suppliers[0]");
    const table = [
      [
        {
          style: PDF_FILED_KEYS.CENTERED_CAPITALISED,
          text: pqSignature.supplier,
        },
        {
          style: PDF_FILED_KEYS.CENTERED_CAPITALISED,
          text: pqSignature.customer,
        },
      ],
      [
        pqGenericBase.suppliersTitle + DocumentExtractionService.getField(supplier as any, "name"),
        pqGenericBase.buyersTitle + DocumentExtractionService.getField(buyer, "name"),
      ],
      [
        pqGenericBase.location +
          StringHandler.customerLocation(DocumentExtractionService.getField<AddressType>(supplier as any, "address")),
        pqGenericBase.location +
          StringHandler.customerLocation(DocumentExtractionService.getField<AddressType>(buyer, "address")) ||
          pqSignature.location,
      ],
      [
        pqGenericBase.mailAddress + DocumentExtractionService.getField(supplier as any, "signerInfo.email"),
        pqGenericBase.mailAddress + DocumentExtractionService.getField(buyer, "signerInfo.email"),
      ],
      [
        pqGenericBase.edrpouIpn + DocumentExtractionService.getField(supplier as any, "identifier.id"),
        pqGenericBase.edrpouIpn + DocumentExtractionService.getField(buyer, "identifier.id"),
      ],
      [
        pqGenericBase.iban + DocumentExtractionService.getField(supplier as any, "signerInfo.iban"),
        pqGenericBase.iban + DocumentExtractionService.getField(buyer, "signerInfo.iban"),
      ],
      [
        pqGenericBase.phone + DocumentExtractionService.getField(supplier as any, "signerInfo.telephone"),
        pqGenericBase.phone + DocumentExtractionService.getField(buyer, "signerInfo.telephone"),
      ],
      [
        pqGenericBase.email + DocumentExtractionService.getField(supplier as any, "signerInfo.email"),
        pqGenericBase.email + DocumentExtractionService.getField(buyer, "signerInfo.email"),
      ],
    ];

    return PDFTablesHandler.createTable(
      table,
      [PDF_HELPER_CONST.ROW_WIDTH_250, "auto"],
      PDF_FILED_KEYS.CONTACTS_TABLE_CONTENT
    );
  }

  static createSignatureBlock(contractObject: PQContractType | Record<any, any>): Record<string, any> {
    return {
      layout: "noBorders",
      style: PDF_FILED_KEYS.CONTACTS_TABLE_CONTENT,
      table: {
        widths: [PDF_HELPER_CONST.ROW_WIDTH_250, "auto"],
        body: [
          [STRING.WHITESPACE, STRING.WHITESPACE],
          [
            DocumentExtractionService.getField(
              contractObject,
              "suppliers[0].signerInfo.position",
              DEFAULT_TEXT_FIELDS.UNDERSCORES_M
            ),
            DocumentExtractionService.getField(
              contractObject,
              "buyer.signerInfo.position",
              DEFAULT_TEXT_FIELDS.UNDERSCORES_M
            ),
          ],
          [pqGenericBase.position, pqGenericBase.position],
          [STRING.WHITESPACE, STRING.WHITESPACE],
          [DEFAULT_TEXT_FIELDS.SIGNATURE, DEFAULT_TEXT_FIELDS.SIGNATURE],
        ],
      },
    };
  }
}
