import { AbstractDocumentStrategy } from "@/services/PDF/document/AbstractDocumentStrategy";
import { v4 as uuid } from "uuid";
import { PDF_FILED_KEYS } from "@/constants/pdf/pdfFieldKeys";
import { ANNOUNCEMENT_PAGE_MARGIN, TIME_NAMES } from "@/config/pdf/announcementConstants";
import { TENDER_OFFER } from "@/config/pdf/texts/TENDER_OFFER";
import * as PDF_HELPER_CONST from "@/constants/pdf/pdfHelperConstants";
import type { SignerType } from "@/types/sign/SignerType";
import { MARGIN_TOP_10__BOTTOM_15 } from "@/config/pdf/tenderOffer";
import { ESCO_TYPE, SIGNATURE_FILE_NAME, STRING } from "@/constants/string";
import type {
  BidParametersType,
  BidsValueType,
  BidType,
  CriterionType,
  DataSchemaType,
  EnumType,
  FeatureType,
  ItemTableRowType,
  ItemType,
  LotValueType,
  RequirementResponseType,
  SubCriteriaFieldsType,
  TenderOfferType,
} from "@/types/TenderOffer/Tender";
import { DateHandler } from "@/utils/DateHandler";
import { UnitHelper } from "@/services/Common/UnitHelper";
import { StringConversionHelper } from "@/services/Common/StringConversionHelper";
import {
  CRITERION_LOCAL_ORIGIN_LEVEL,
  CRITERION_TECHNICAL_FEATURES,
} from "@/widgets/TenderOffer/configs/CRITERION_VALUES";
import { CriteriaTransformer } from "@/widgets/TenderOffer/services/CriteriaTransformer";
import { StringHandler } from "@/utils/StringHandler";
import { EvidenceFormatter } from "@/widgets/TenderOffer/services/EvidenceFormatter";
import { Assert } from "@/widgets/ErrorExceptionCore/Assert";
import { ERROR_MESSAGES } from "@/widgets/ErrorExceptionCore/configs/messages";
import { MainInformationBuilder } from "@/widgets/TenderOffer/services/MainInformation.builder";
import { isNumber } from "lodash";
import type { CriteriaFactoryConfig } from "@/types/CriteriaFactoryConfig";
import {
  criterionLotTablesConfig,
  criterionTenderTablesConfig,
} from "@/widgets/TenderOffer/configs/criterionTables.config";
import { CriteriaRequirementDataSchema } from "@/utils/CriteriaRequirementDataSchema";
import type { PdfDocumentConfigType } from "@/types/pdf/PdfDocumentConfigType";
import { PDFTablesHandler } from "@/services/PDF/Formatting/PDFTablesHandler.ts";

export class TenderOfferDataMaker extends AbstractDocumentStrategy {
  private readonly HUNDRED_PERCENT: number = 100;
  private readonly NUMBER_OF_DECIMALS: number = 2;
  private readonly NUMBER_LENGTH_OF_YEAR: number = 4;
  private readonly MAX_TITLE_LENGTH = 40;
  private dictionaries: Map<string, Record<string, any>> = new Map();

  create(
    { tender, bidData }: { tender: TenderOfferType; bidData?: BidType },
    _config: PdfDocumentConfigType,
    _signers: SignerType[],
    dictionaries: Map<string, Record<string, any>>
  ): Record<string, any>[] {
    Assert.isDefined(bidData?.tenderers, ERROR_MESSAGES.VALIDATION_FAILED.tenderersIsNotDefined);

    const { criteria, features } = tender;
    const hasLots = Boolean(bidData?.lotValues?.length);
    this.dictionaries = dictionaries;
    const mainInfoBuilder = new MainInformationBuilder(tender, bidData, dictionaries);

    return [
      ...mainInfoBuilder.setTitle.setTenderId.setName.setIdentifier.setAddress.setContactPoint.setScale.setValue
        .setWeightedValue.setSubcontractingDetails.getResult,
      hasLots ? [PDF_HELPER_CONST.EMPTY_FIELD] : this.escoTable(tender, bidData),
      this.buildParametersTable(bidData.parameters, features),
      ...[criteria?.length ? this.resolveCriterionTables(criteria, bidData) : PDF_HELPER_CONST.EMPTY_FIELD],
      hasLots ? [PDF_HELPER_CONST.EMPTY_FIELD] : this.resolveSpecificationTable(tender, bidData),
      this.getTenderDocumentsTable(bidData),
      ...this.lotResolvesTable(tender, bidData),
    ];
  }

  getPageMargins(): number[] {
    return ANNOUNCEMENT_PAGE_MARGIN;
  }

  prepareQuantity(item: ItemType): string {
    if (!item.hasOwnProperty("quantity") || this.emptyChecker.isEmptyString(item.quantity)) {
      return STRING.DASH;
    }

    const quantity = this.getQuantity(item, "quantity");
    const { unit } = item;
    if (!unit) {
      return `${quantity}`;
    }
    const { name, code } = unit;
    if (name && name.length) {
      return `${quantity} ${name}`;
    }
    if (code.length) {
      const unitDictionary = this.dictionaries?.get("recommended");
      if (!unitDictionary) {
        return `${quantity}`;
      }
      const mapDict = new Map(Object.entries(unitDictionary));
      const unitName = mapDict.get(code).name ?? STRING.EMPTY;
      return `${quantity} ${unitName}`;
    }
    return `${quantity}`;
  }

  private resolveSpecificationTable(tender: TenderOfferType, bid: BidType, lot?: LotValueType): Record<string, any> {
    const { items: bidItems, requirementResponses } = bid;
    const { items: tenderItems, criteria } = tender;

    if (!bidItems?.length || !tenderItems?.length) {
      return [PDF_HELPER_CONST.EMPTY_FIELD];
    }

    const items: ItemType[] = bidItems.filter(bidItem =>
      tenderItems.find(item => {
        if (lot?.id) {
          return item.relatedLot === lot.id && item.id === bidItem.id;
        }

        return item.id === bidItem.id;
      })
    );

    if (!items?.length) {
      return [PDF_HELPER_CONST.EMPTY_FIELD];
    }

    const criterionList = criteria?.filter(
      criterion => criterion.hasOwnProperty("relatedItem") && items.find(item => criterion.relatedItem === item.id)
    );
    return this.createSpecificationTable(items, criterionList, requirementResponses);
  }

  /**
   * Створення таблиці специфікації
   * Вона складається з 2-х частин:
   * 1. Основна частина, де вказується назва товару, кількість та ціна за одиницю
   * 2. Додаткова частина, де вказуються технічні характеристики товару
   *
   * @param items
   * @param criteria
   * @param requirementResponses
   * @private
   */
  private createSpecificationTable(
    items: ItemType[],
    criteria: CriterionType[] | undefined,
    requirementResponses: RequirementResponseType[] | undefined
  ): Record<string, any> {
    /**
     * Основна частина таблиці, де вказується назва товару, кількість та ціна за одиницю
     */
    const mainTableAllRawRows: ItemTableRowType[] = this.getAllTableRowsFromItems(
      items,
      criteria,
      requirementResponses
    );

    if (!mainTableAllRawRows.length) {
      return [PDF_HELPER_CONST.EMPTY_FIELD];
    }

    const bodyRowsFinalTable: Record<string, any>[][] = [
      [
        {
          text: TENDER_OFFER.name_nomenclature_item_procurement_item,
          style: PDF_FILED_KEYS.TABLE_HEAD,
        },
        {
          text: TENDER_OFFER.quantity_or_units_of_measurement,
          style: PDF_FILED_KEYS.TABLE_HEAD,
        },
        {
          text: TENDER_OFFER.price_per_unit,
          style: PDF_FILED_KEYS.TABLE_HEAD,
        },
      ],
    ];
    /**
     * Якщо в таблиці є товари, які мають додаткові характеристики, після рядків таблиці товарів, які не мають додаткових характеристик,
     */
    mainTableAllRawRows.forEach(row => {
      const { mainRow, additional } = row;
      /**
       * Основний рядок з характеристиками
       */
      bodyRowsFinalTable.push(mainRow);
      /**
       * Рядок з надписом "Технічні характеристики" та додатковими характеристиками
       */
      if (additional) {
        this.addAdditionalRows(bodyRowsFinalTable, additional, CRITERION_TECHNICAL_FEATURES);
        this.addAdditionalRows(bodyRowsFinalTable, additional, CRITERION_LOCAL_ORIGIN_LEVEL);
      }
    });

    return PDFTablesHandler.resolveTableBug(
      {
        table: {
          headerRows: 0,
          dontBreakRows: false,
          widths: [PDF_HELPER_CONST.ROW_AUTO_WIDTH, PDF_HELPER_CONST.ROW_WIDTH_125, PDF_HELPER_CONST.ROW_WIDTH_125],
          body: bodyRowsFinalTable,
        },
        margin: MARGIN_TOP_10__BOTTOM_15,
      },
      {
        style: PDF_FILED_KEYS.TITLE_MEDIUM_BOLD,
        text: TENDER_OFFER.specification,
      }
    );
  }

  private addAdditionalRows(
    bodyRowsFinalTable: Record<string, any>[][],
    additional: SubCriteriaFieldsType[],
    criterionId: string
  ): Record<string, any>[][] {
    const filteredAdditional = additional?.filter(additionalItem => additionalItem.classificationId === criterionId);
    if (filteredAdditional.length === 0) {
      return bodyRowsFinalTable;
    }

    bodyRowsFinalTable.push([
      {
        colSpan: 3,
        text:
          criterionId === CRITERION_TECHNICAL_FEATURES
            ? TENDER_OFFER.technical_features
            : TENDER_OFFER.localization_criteria,
        style: PDF_FILED_KEYS.TABLE_DATA_BOLD_CENTER,
        border: [false, false, false, false],
      },
      {
        text: STRING.EMPTY,
        style: PDF_FILED_KEYS.TABLE_DATA,
      },
      {
        text: STRING.EMPTY,
        style: PDF_FILED_KEYS.TABLE_DATA,
      },
    ]);
    /**
     * Додаткові рядки з характеристиками товару
     */
    bodyRowsFinalTable.push(...this.prepareAdditionalSpecificationFields(filteredAdditional));
    // відступ після рядків з додатковими характеристиками товару
    bodyRowsFinalTable.push([
      {
        colSpan: 3,
        text: STRING.DOT,
        border: [false, false, false, false],
        style: PDF_FILED_KEYS.HIDDEN_DATA,
      },
      {
        text: STRING.EMPTY,
        style: PDF_FILED_KEYS.TABLE_DATA,
      },
      {
        text: STRING.EMPTY,
        style: PDF_FILED_KEYS.TABLE_DATA,
      },
    ]);
    return bodyRowsFinalTable;
  }

  private getAllTableRowsFromItems(
    items: ItemType[],
    criteria?: CriterionType[],
    requirementResponses?: RequirementResponseType[]
  ): ItemTableRowType[] {
    return items.map(item => {
      const mainRow = [
        {
          text: this.getField(item, "description", STRING.DASH),
          style: PDF_FILED_KEYS.TABLE_DATA_BOLD,
        },
        {
          text: `${this.prepareQuantity(item)}`,
          style: PDF_FILED_KEYS.TABLE_DATA_BOLD,
        },
        {
          text: this._getPrice(
            this.getField<BidsValueType>(item, "unit.value") || {},
            "amount",
            TENDER_OFFER.without_tax
          ),
          style: PDF_FILED_KEYS.TABLE_DATA_BOLD,
        },
      ];

      const additional = CriteriaTransformer.getSpecificationsFieldsTable(
        this.dictionaries,
        item,
        criteria,
        requirementResponses
      );

      return { key: uuid(), mainRow, additional };
    });
  }

  private prepareAdditionalSpecificationFields(specFields: SubCriteriaFieldsType[]): Record<string, any>[][] {
    if (!specFields || specFields.length === 0) {
      return [[PDF_HELPER_CONST.EMPTY_FIELD]];
    }
    const res: Record<string, any>[][] = [];
    specFields.forEach(field => {
      const { title, unit, value, values } = field;
      const unitName = unit === undefined ? STRING.EMPTY : this.getField(unit, "name", STRING.EMPTY);
      let fullTitle = `${title}`;
      if (unitName.length > 0) {
        fullTitle = `${fullTitle} (${unitName})`;
      }
      const valueText = this.emptyChecker.isNotEmptyString(value?.toString())
        ? StringConversionHelper.yesNoStringConversion(value)
        : STRING.DASH;
      const valuesText = this.emptyChecker.isNotEmptyArray(values)
        ? values?.map((val: string) => StringConversionHelper.yesNoStringConversion(val)).join(", ")
        : STRING.EMPTY;
      res.push([
        {
          text: fullTitle,
          style: PDF_FILED_KEYS.TABLE_DATA,
        },
        {
          text: valuesText?.length ? valuesText : valueText,
          style: PDF_FILED_KEYS.TABLE_DATA,
          colSpan: 2,
        },
        {
          text: STRING.EMPTY,
          style: PDF_FILED_KEYS.TABLE_DATA,
        },
      ]);
    });
    return res;
  }

  private resolveCriterionTables(criteria: CriterionType[], bidType: BidType): Record<string, any>[] {
    return criterionTenderTablesConfig.map(criterionData =>
      this.createCriterionTable(criterionData, criteria, bidType)
    );
  }

  private createCriterionTable(
    { types, tableTitle, isLot }: CriteriaFactoryConfig,
    criteria?: CriterionType[],
    bid?: BidType
  ): Record<string, any> {
    if (!bid?.requirementResponses?.length || !criteria?.length) {
      return [PDF_HELPER_CONST.EMPTY_FIELD];
    }

    const tableRows: Record<string, any>[] = [];
    const filteredCriterias: CriterionType[] = CriteriaTransformer.filterCriteriaByRelatesTo(criteria, isLot);

    types.forEach(type => {
      (bid?.requirementResponses || []).forEach(requirementResponse => {
        // find `criterion` related to `bid.requirementResponse`
        const criterion: CriterionType | undefined = filteredCriterias
          // remove criteria without requirementGroups, and validate `type` property
          .filter(
            ({ requirementGroups, classification }: CriterionType) =>
              requirementGroups?.length && classification?.id?.includes(type)
          )
          .find(
            ({ requirementGroups }: CriterionType) =>
              requirementGroups
                .flatMap(({ requirements }) => requirements) // return all requirement list
                .find(({ id }) => id === requirementResponse.requirement.id) // find requirement by id
          );

        // find `requirement` in criteria, who match `bid.requirementResponse.requirement`
        const requirement = (criterion?.requirementGroups || [])
          .flatMap(({ requirements }) => requirements)
          .find(({ id }) => id === requirementResponse.requirement.id);

        if (!requirement) {
          return;
        }

        const responseText: Record<string, any>[] = this.resolveEvidenceData(
          bid,
          requirementResponse,
          requirement.dataSchema
        );

        if (!responseText.length) {
          return;
        }

        const preparedTitle: Record<string, any>[] = [
          {
            text: `${criterion?.title}\n`,
            style: PDF_FILED_KEYS.TABLE_HEAD,
          },
          {
            text: `${requirement.title || STRING.EMPTY}\n`,
            style: PDF_FILED_KEYS.TABLE_DATA,
          },
          {
            text: requirement.description || STRING.EMPTY,
            style: PDF_FILED_KEYS.TABLE_DATA,
          },
        ];

        tableRows.push([preparedTitle, responseText]);
      });
    });

    if (!tableRows.length) {
      return [PDF_HELPER_CONST.EMPTY_FIELD];
    }

    // Header row for the table
    tableRows.unshift([
      {
        text: TENDER_OFFER.the_participant_confirms_that,
        style: PDF_FILED_KEYS.TABLE_HEAD,
      },
      {
        text: TENDER_OFFER.answer_and_confirmation,
        style: PDF_FILED_KEYS.TABLE_HEAD,
      },
    ]);

    return PDFTablesHandler.resolveTableBug(
      {
        table: {
          headerRows: 0,
          dontBreakRows: false,
          widths: [PDF_HELPER_CONST.ROW_WIDTH_250, PDF_HELPER_CONST.ROW_ALL_WIDTH],
          body: tableRows,
        },
        margin: MARGIN_TOP_10__BOTTOM_15,
      },
      {
        style: PDF_FILED_KEYS.TITLE_MEDIUM_BOLD,
        text: tableTitle,
      }
    );
  }

  private resolveEvidenceData(
    bid: BidType,
    { evidences, value, values, unit }: RequirementResponseType,
    dataSchema?: DataSchemaType
  ): Record<string, any>[] {
    const dictionary = this.dictionaries?.get("recommended") || {};
    const dataSchemaHandler = new CriteriaRequirementDataSchema(this.dictionaries);
    const translatedValues = dataSchemaHandler.translateValues(values, dataSchema);
    const response: Record<string, any>[] = EvidenceFormatter.formatEvidenceValue(
      dictionary,
      value,
      translatedValues,
      unit
    );

    evidences?.forEach(({ type, title, description, relatedDocument }) => {
      // todo refactor with convertion of object to map or using object keys  + extract formatting to separate function
      if (type) {
        response.push({
          text: [
            {
              text: TENDER_OFFER.confirmation_form + STRING.WHITESPACE,
              style: PDF_FILED_KEYS.TABLE_DATA_BOLD,
            },
            {
              text: `${this.resolveEvidenceType(type)}\n`,
              style: PDF_FILED_KEYS.TABLE_DATA,
            },
          ],
        });
      }

      if (title) {
        response.push({
          text: [
            {
              text: TENDER_OFFER.evidence_title + STRING.WHITESPACE,
              style: PDF_FILED_KEYS.TABLE_DATA_BOLD,
            },
            {
              text: `${title}\n`,
              style: PDF_FILED_KEYS.TABLE_DATA,
            },
          ],
        });
      }

      if (description) {
        response.push({
          text: [
            {
              text: TENDER_OFFER.evidence_description + STRING.WHITESPACE,
              style: PDF_FILED_KEYS.TABLE_DATA_BOLD,
            },
            {
              text: `${description}\n`,
              style: PDF_FILED_KEYS.TABLE_DATA,
            },
          ],
        });
      }

      if (relatedDocument) {
        const documents = EvidenceFormatter.findEvidenceDocumentTitle(relatedDocument, bid);

        response.push({
          text: [
            {
              text: TENDER_OFFER.evidence_document + STRING.WHITESPACE,
              style: PDF_FILED_KEYS.TABLE_DATA_BOLD,
            },
            {
              text: documents,
              style: PDF_FILED_KEYS.TABLE_DATA_BLUE,
            },
          ],
        });
      }
    });

    return response;
  }

  // TODO evidence formatter extract start
  private resolveEvidenceType(type: string): string {
    switch (type) {
      case "document":
        return "Документ";
      case "statement":
        return "Заява";
      default:
        return type;
    }
  }

  // todo evidence formatter extract finish
  private escoTable(
    tender: TenderOfferType,
    bidType: BidType,
    lot: LotValueType | undefined = undefined
  ): Record<string, any> {
    if (tender.procurementMethodType !== ESCO_TYPE) {
      return [PDF_HELPER_CONST.EMPTY_FIELD];
    }

    const bidEntity: BidType | LotValueType = lot ?? bidType;
    const bidValueObject: BidsValueType | undefined = bidEntity.hasOwnProperty("value") ? bidEntity.value : undefined;

    if (!bidValueObject || this.emptyChecker.isEmptyObject(bidValueObject)) {
      return [PDF_HELPER_CONST.EMPTY_FIELD];
    }

    const body: Record<string, any>[][] = [];
    const { contractDuration, amountPerformance, currency, yearlyPaymentsPercentage, annualCostsReduction } =
      bidValueObject;

    if (undefined !== contractDuration) {
      const { years, days } = contractDuration;
      body.push([
        {
          text: TENDER_OFFER.contract_term_table,
          style: PDF_FILED_KEYS.TABLE_HEAD,
        },
        {
          text: `${DateHandler.timeToStr(years, TIME_NAMES.Years)} ${DateHandler.timeToStr(days, TIME_NAMES.Days)}`,
          style: PDF_FILED_KEYS.TABLE_DATA,
        },
      ]);
    }

    if (undefined !== amountPerformance || undefined !== currency) {
      body.push([
        {
          text: TENDER_OFFER.performance_indicator_energy_service_contract_title,
          style: PDF_FILED_KEYS.TABLE_HEAD,
        },
        {
          text: this._getPrice(bidValueObject, "amountPerformance"),
          style: PDF_FILED_KEYS.TABLE_DATA,
        },
      ]);
    }

    if (undefined !== yearlyPaymentsPercentage) {
      body.push([
        {
          text: TENDER_OFFER.fixed_percentage_annual_payments_favor_of_participant_table,
          style: PDF_FILED_KEYS.TABLE_HEAD,
        },
        {
          text: `${Number(yearlyPaymentsPercentage * this.HUNDRED_PERCENT)
            .toFixed(this.NUMBER_OF_DECIMALS)
            .replace(/\./g, STRING.COMMA)} %`,
          style: PDF_FILED_KEYS.TABLE_DATA,
        },
      ]);
    }

    if (undefined !== annualCostsReduction) {
      body.push([
        {
          text: TENDER_OFFER.amounts_of_annual_cost_reduction_of_customer_table,
          style: PDF_FILED_KEYS.TABLE_HEAD,
        },
        {
          text: this.prepareAnnualCostsReduction(annualCostsReduction, this.getStartYear(tender)),
          style: PDF_FILED_KEYS.TABLE_DATA,
        },
      ]);
    }

    return PDFTablesHandler.resolveTableBug(
      {
        table: {
          headerRows: 0,
          dontBreakRows: false,
          widths: [PDF_HELPER_CONST.ROW_WIDTH_250, PDF_HELPER_CONST.ROW_ALL_WIDTH],
          body,
        },
        margin: MARGIN_TOP_10__BOTTOM_15,
      },
      {
        style: PDF_FILED_KEYS.TITLE_MEDIUM_BOLD,
        text: TENDER_OFFER.information_about_energy_service_contract,
      }
    );
  }

  // TODO to utils
  private getStartYear(tender: TenderOfferType): number {
    const { tenderID } = tender;

    if (!tenderID) {
      return 0;
    }

    const year = tenderID.split("-").find(el => el.length === this.NUMBER_LENGTH_OF_YEAR);
    return year ? parseInt(year, 10) : 0;
  }

  // TODO to utils
  private prepareAnnualCostsReduction(annualCostsReduction: number[], startYear: number): string {
    if (annualCostsReduction.length === 0) {
      return STRING.DASH;
    }
    return annualCostsReduction
      .map(cost => `${startYear++} ${STRING.MINUS} ${UnitHelper.currencyFormatting(cost)}`)
      .join(STRING.DELIMITER.NEW_LINE);
  }

  private buildParametersTable(
    parameters: BidParametersType[] | undefined,
    features: FeatureType[] | undefined
  ): Record<string, any> {
    if (!parameters || parameters.length === 0 || !features || features.length === 0) {
      return [PDF_HELPER_CONST.EMPTY_FIELD];
    }

    const body: Record<string, any>[][] = [];
    parameters.forEach((parameter: BidParametersType) => {
      const feature = features.find((feature: FeatureType) => feature.code === parameter.code);
      if (!feature) {
        return;
      }
      const titleEnum = feature.enum.find((enumItem: EnumType) => enumItem.value === parameter.value);
      const title = titleEnum ? titleEnum.title : STRING.DASH;
      body.push([
        {
          text: this.getField(feature, "description", STRING.DASH),
          style: PDF_FILED_KEYS.TABLE_HEAD,
        },
        {
          text: title,
          style: PDF_FILED_KEYS.TABLE_DATA,
        },
      ]);
    });

    return PDFTablesHandler.resolveTableBug(
      {
        table: {
          headerRows: 0,
          dontBreakRows: false,
          widths: [PDF_HELPER_CONST.ROW_WIDTH_250, PDF_HELPER_CONST.ROW_ALL_WIDTH],
          body,
        },
        margin: MARGIN_TOP_10__BOTTOM_15,
      },
      {
        style: PDF_FILED_KEYS.TITLE_MEDIUM_BOLD,
        text: TENDER_OFFER.non_price_criteria,
      }
    );
  }

  private getTenderDocumentsTable(bidType: BidType, lot: LotValueType | undefined = undefined): Record<string, any> {
    const { documents, financialDocuments, eligibilityDocuments, qualificationDocuments } = bidType;
    const allDocuments = [
      ...(documents ?? []),
      ...(financialDocuments ?? []),
      ...(eligibilityDocuments ?? []),
      ...(qualificationDocuments ?? []),
    ]
      .filter(document => {
        if (lot && lot.hasOwnProperty("id")) {
          return (
            document.documentOf === "lot" && document.title !== SIGNATURE_FILE_NAME && document.relatedItem === lot.id
          );
        }
        return document.documentOf === "tender" && document.title !== SIGNATURE_FILE_NAME;
      })
      .map(document => ({
        text: `${StringHandler.cutLongString(this.getField(document, "title", STRING.DASH), this.MAX_TITLE_LENGTH)}\n`,
        link: this.getField(document, "url", STRING.EMPTY),
        style: PDF_FILED_KEYS.TABLE_DATA,
      }));

    if (allDocuments.length === 0) {
      return [PDF_HELPER_CONST.EMPTY_FIELD];
    }
    const body: Record<string, any>[] = [];
    body.push([
      {
        text: TENDER_OFFER.documents,
        style: PDF_FILED_KEYS.TABLE_HEAD,
      },
      {
        text: allDocuments,
        style: PDF_FILED_KEYS.TABLE_DATA_BLUE,
      },
    ]);

    return PDFTablesHandler.resolveTableBug(
      {
        table: {
          headerRows: 0,
          dontBreakRows: false,
          widths: [PDF_HELPER_CONST.ROW_WIDTH_245, PDF_HELPER_CONST.ROW_WIDTH_245],
          body,
        },
        margin: MARGIN_TOP_10__BOTTOM_15,
      },
      {
        style: PDF_FILED_KEYS.TITLE_MEDIUM_BOLD,
        text: TENDER_OFFER.tender_documents,
      }
    );
  }

  private lotResolvesTable(tender: TenderOfferType, bidType: BidType): Record<string, any>[] {
    const { lotValues } = bidType;
    const { lots, criteria } = tender;

    if (!lotValues?.length || !lots?.length) {
      return [PDF_HELPER_CONST.EMPTY_FIELD];
    }

    return lotValues.map(lotValue => {
      const lot = lots.find(lot => lot.id === lotValue.relatedLot);

      if (!lot) {
        return [PDF_HELPER_CONST.EMPTY_FIELD];
      }

      const criterionList = criteria?.filter(criterion => criterion.relatedItem === lot.id);
      return this.createBidLotTables(lot, lotValue, bidType, criterionList, tender);
    });
  }

  private createBidLotTables(
    lot: LotValueType,
    lotValueBid: LotValueType,
    bid: BidType,
    criterionList: CriterionType[] | undefined,
    tender: TenderOfferType
  ): Record<string, any>[] {
    const mainInfoBuilder = new MainInformationBuilder(lot, lotValueBid, this.dictionaries);
    const criterionTables = criterionLotTablesConfig.map(criterionData =>
      this.createCriterionTable(criterionData, criterionList || [], bid)
    );

    return [
      {
        style: PDF_FILED_KEYS.TITLE_LARGE_TENDER_OFFER,
        text: `Лот - ${lot.title}`,
      },
      ...mainInfoBuilder.setValue.setWeightedValue.setSubcontractingDetails.getResult,
      this.escoTable(tender, bid, lotValueBid),
      ...criterionTables,
      this.resolveSpecificationTable(tender, bid, lot),
      this.getTenderDocumentsTable(bid, lot),
    ];
  }

  private _getPrice(
    value: BidsValueType,
    path: "amount" | "amountPerformance" = "amount",
    nonTaxText: string | null = null
  ): string {
    const { [path]: amountValue, valueAddedTaxIncluded, currency } = value;

    if (!isNumber(amountValue)) {
      return STRING.DASH;
    }

    return [
      UnitHelper.currencyFormatting(amountValue),
      currency,
      valueAddedTaxIncluded ? TENDER_OFFER.with_tax : nonTaxText,
    ]
      .filter(item => item !== null && item !== undefined)
      .join(STRING.WHITESPACE);
  }
}
