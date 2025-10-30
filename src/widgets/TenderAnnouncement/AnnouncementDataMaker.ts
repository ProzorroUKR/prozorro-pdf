import type { SignerType } from "@prozorro/prozorro-eds";
import { PDF_FILED_KEYS } from "@/constants/pdf/pdfFieldKeys";
import * as PDF_HELPER_CONST from "@/constants/pdf/pdfHelperConstants";
import { MILESTONE_EVENT } from "@/widgets/TenderAnnouncement/constants/milestone";
import { PAYMENT_TYPE } from "@/widgets/TenderAnnouncement/constants/paymentType";
import { DURATION_TYPE } from "@/widgets/TenderAnnouncement/constants/durationType";
import { AbstractDocumentStrategy } from "@/services/PDF/document/AbstractDocumentStrategy";
import { ANNOUNCEMENT_PAGE_MARGIN } from "@/config/pdf/announcementConstants";
import { DateHandler } from "@/utils/DateHandler";
import { ANNOUNCEMENT_TEXTS_LIST } from "@/config/pdf/texts/ANNOUNCEMENT";
import { UnitHelper } from "@/services/Common/UnitHelper";
import { StringHandler } from "@/utils/StringHandler";
import { CriteriaHandler } from "./services/CriteriaHandler";
import { PDFTablesHandler } from "@/services/PDF/Formatting/PDFTablesHandler";
import { CriterionValues } from "@/constants/tender/criterion.enum";
import { AnnouncementMainInformationBuilder } from "./services/AnnouncementMainInformation.builder";
import { ESCO_TYPE } from "@/constants/string";
import type { PdfDocumentConfigType } from "@/types/pdf/PdfDocumentConfigType";
import type { AnnouncementItem, Milestone } from "@/types/Announcement/AnnouncementTypes";
import {
  closeFrame,
  noAuction,
  noSecurement,
  procurementMethodTypes,
} from "@/widgets/TenderAnnouncement/constants/conditions";
import { ClassificationHandler } from "@/utils/ClassificationHandler.ts";

const nbuRateConverter = 100;

export class AnnouncementDataMaker extends AbstractDocumentStrategy {
  create(
    tender: Record<any, any>,
    _config: PdfDocumentConfigType,
    _signers: SignerType[],
    dictionaries: Map<string, Record<string, any>>
  ): Record<string, any>[] {
    const hasLots = Boolean(tender?.lots?.length);
    const builder = new AnnouncementMainInformationBuilder(tender, dictionaries);

    return [
      builder.setTitle.setSubTitle.setTenderId.setName.setCustomerCategory.setIdentifier.setAddress.setContactPoint
        .setMainProcurementCategory.setTenderTitle.setClassificationId.getResult,
      hasLots
        ? this.displayUnderHeaderLots(tender, tender.lots, dictionaries)
        : this.displayUnderHeader(tender, dictionaries),
    ];
  }

  getPageMargins(): number[] {
    return ANNOUNCEMENT_PAGE_MARGIN;
  }

  private displayUnderHeader(
    {
      items,
      minimalStep,
      tenderPeriod,
      auctionPeriod,
      agreementDuration,
      maxAwardsCount,
      milestones,
      value,
      guarantee,
      procurementMethodType,
      plans,
      features,
      criteria = [],
      awardPeriod,
      lots,
      NBUdiscountRate,
      minimalStepPercentage,
      yearlyPaymentsPercentageRange,
      fundingKind,
    }: Record<string, any>,
    dictionaries: Map<string, Record<string, any>>
  ): Record<string, any>[] {
    const isEsco = procurementMethodType === ESCO_TYPE;
    const hasMilestones = Array.isArray(milestones) && milestones?.length;

    return [
      isEsco
        ? this.createEscoItemTable(items, minimalStepPercentage, yearlyPaymentsPercentageRange, fundingKind)
        : this.createItemTable(items),

      hasMilestones
        ? PDFTablesHandler.createTableLayout([
            PDFTablesHandler.createTableRow({
              head: ANNOUNCEMENT_TEXTS_LIST.contract_terms,
              data: "",
            }),
          ])
        : PDF_HELPER_CONST.EMPTY_FIELD,

      hasMilestones ? this.createPaymentTable(milestones) : PDF_HELPER_CONST.EMPTY_FIELD,

      this.showIfAvailable(this.getField(plans, "[0].id"), ANNOUNCEMENT_TEXTS_LIST.plans, Array.isArray(plans)),
      this.showIfAvailable(
        `${UnitHelper.currencyFormatting(this.getField(value, "amount"))} ${this.getField(value, "currency")}`,
        ANNOUNCEMENT_TEXTS_LIST.expected_price,
        !isEsco
      ),
      this.showIfAvailable(
        `${UnitHelper.currencyFormatting(this.getField(minimalStep, "amount"))} ${this.getField(minimalStep, "currency")}`,
        ANNOUNCEMENT_TEXTS_LIST.minimal_step,
        !isEsco
      ),
      this.showIfAvailable(
        features ? ANNOUNCEMENT_TEXTS_LIST.feature : ANNOUNCEMENT_TEXTS_LIST.missing_she,
        ANNOUNCEMENT_TEXTS_LIST.formula,
        !isEsco
      ),
      this.showIfAvailable(`${NBUdiscountRate * nbuRateConverter}%`, ANNOUNCEMENT_TEXTS_LIST.nbu_discount_rate, isEsco),
      PDFTablesHandler.createTableLayout([
        PDFTablesHandler.createTableRow({
          head: ANNOUNCEMENT_TEXTS_LIST.deadline,
          data: this.getDecisionDatePublished(this.getField(tenderPeriod, "endDate"), true, true),
        }),
      ]),
      CriteriaHandler.getCriterionLanguage(criteria, dictionaries),
      this.showIfAvailable(
        `${UnitHelper.currencyFormatting(this.getField(guarantee, "amount") || "0")} ${this.getField(guarantee, "currency")}`,
        ANNOUNCEMENT_TEXTS_LIST.securement,
        !noSecurement.includes(procurementMethodType) && !isEsco
      ),
      this.showIfAvailable(
        this.getField<string | number>(guarantee, "amount").toString().length > 0
          ? ANNOUNCEMENT_TEXTS_LIST.e_guarantee
          : ANNOUNCEMENT_TEXTS_LIST.missing_he,
        ANNOUNCEMENT_TEXTS_LIST.securement_type,
        !isEsco
      ),
      PDFTablesHandler.createTableLayout([
        PDFTablesHandler.createTableRow({
          head: ANNOUNCEMENT_TEXTS_LIST.disclosure_date,
          data: this.getDecisionDatePublished(
            this.getTenderPeriod(awardPeriod, tenderPeriod, procurementMethodType),
            true,
            true
          ),
        }),
      ]),
      this.getSecurementAmount(criteria, lots, guarantee, procurementMethodType),
      this.showIfAvailable(
        this.getOnlineAuction(lots, auctionPeriod),
        ANNOUNCEMENT_TEXTS_LIST.auction_date,
        !noAuction.includes(procurementMethodType) && lots
      ),
      closeFrame.includes(procurementMethodType)
        ? PDFTablesHandler.createTableLayout([
            PDFTablesHandler.createTableRow({
              head: ANNOUNCEMENT_TEXTS_LIST.frame_contact_period,
              data: DateHandler.dateIntervalDecode(agreementDuration) || ANNOUNCEMENT_TEXTS_LIST.missing_he,
            }),
            PDFTablesHandler.createTableRow({
              head: ANNOUNCEMENT_TEXTS_LIST.frame_contact_amount,
              data: maxAwardsCount || ANNOUNCEMENT_TEXTS_LIST.missing_she,
            }),
          ])
        : PDF_HELPER_CONST.EMPTY_FIELD,
      CriteriaHandler.getCriterionSecuringOffer(criteria, dictionaries),
      CriteriaHandler.getCriterionSecurityContract(criteria, dictionaries),
    ];
  }

  private createItemTable(items: Array<AnnouncementItem>): Record<string, any> {
    const hasItems = Array.isArray(items) && items?.length;

    if (!hasItems) {
      return PDF_HELPER_CONST.EMPTY_FIELD;
    }

    const header = [
      {
        text: ANNOUNCEMENT_TEXTS_LIST.procuring_entity_name,
        style: PDF_FILED_KEYS.TABLE_HEAD,
      },
      {
        text: ANNOUNCEMENT_TEXTS_LIST.procuring_entity_code,
        style: PDF_FILED_KEYS.TABLE_HEAD,
      },
      {
        text: ANNOUNCEMENT_TEXTS_LIST.procurement_amount,
        style: PDF_FILED_KEYS.TABLE_HEAD,
      },
      {
        text: ANNOUNCEMENT_TEXTS_LIST.procurement_destination,
        style: PDF_FILED_KEYS.TABLE_HEAD,
      },
      {
        text: ANNOUNCEMENT_TEXTS_LIST.delivery_period,
        style: PDF_FILED_KEYS.TABLE_HEAD,
      },
    ];

    const body: { text: string }[][] = [];

    body.push(header);

    items.forEach(item => {
      body.push([
        { text: this.getField(item, "description") },
        {
          text: ClassificationHandler.format(item.classification, item.additionalClassifications).join("\n"),
        },
        { text: `${this.getField(item, "quantity")} ${this.getField(item, "unit.name")}` },
        { text: StringHandler.customerLocation(this.getField(item, "deliveryAddress")) },
        {
          text:
            (this.getField(item, "deliveryDate.startDate")
              ? `від ${this.getDecisionDatePublished(this.getField(item, "deliveryDate.startDate"), false, true)}`
              : "") + `до ${this.getDecisionDatePublished(this.getField(item, "deliveryDate.endDate"), false, true)}`,
        },
      ]);
    });

    return {
      headerRows: 1,
      alignment: "left",
      table: {
        dontBreakRows: true,
        widths: [
          PDF_HELPER_CONST.ROW_WIDTH_110,
          PDF_HELPER_CONST.ROW_WIDTH_100,
          PDF_HELPER_CONST.ROW_WIDTH_70,
          PDF_HELPER_CONST.ROW_WIDTH_100,
          PDF_HELPER_CONST.ROW_WIDTH_90,
        ],
        body,
      },
    };
  }

  private createEscoItemTable(
    items: Array<AnnouncementItem>,
    minimalStepPercentage: string,
    yearlyPaymentsPercentageRange: string,
    fundingKind: string
  ): Record<string, any> {
    if (!Array.isArray(items)) {
      return PDF_HELPER_CONST.EMPTY_FIELD;
    }

    const header = [
      {
        text: ANNOUNCEMENT_TEXTS_LIST.esco_concrete_name,
        style: PDF_FILED_KEYS.TABLE_HEAD_ESCO,
      },
      {
        text: ANNOUNCEMENT_TEXTS_LIST.esco_classification_codes,
        style: PDF_FILED_KEYS.TABLE_HEAD_ESCO,
      },
      {
        text: ANNOUNCEMENT_TEXTS_LIST.procurement_destination,
        style: PDF_FILED_KEYS.TABLE_HEAD_ESCO,
      },
      {
        text: ANNOUNCEMENT_TEXTS_LIST.minimal_efectivity_step,
        style: PDF_FILED_KEYS.TABLE_HEAD_ESCO,
      },
      {
        text: ANNOUNCEMENT_TEXTS_LIST.other_criterias,
        style: PDF_FILED_KEYS.TABLE_HEAD_ESCO,
      },
      {
        text: ANNOUNCEMENT_TEXTS_LIST.esco_financing,
        style: PDF_FILED_KEYS.TABLE_HEAD_ESCO,
      },
      {
        text: ANNOUNCEMENT_TEXTS_LIST.max_fixed_percent,
        style: PDF_FILED_KEYS.TABLE_HEAD_ESCO,
      },
    ];
    const body: { text: string; style: string }[][] = [];
    body.push(header);
    let fundingKindCell = "";
    switch (fundingKind) {
      case "other":
        fundingKindCell = ANNOUNCEMENT_TEXTS_LIST.esco_funding_other;
        break;
      case "budget":
        fundingKindCell = ANNOUNCEMENT_TEXTS_LIST.esco_funding_budget;
        break;
    }
    items.forEach(item =>
      body.push([
        {
          text: this.getField(item, "description"),
          style: PDF_FILED_KEYS.TABLE_DATA_ESCO,
        },
        {
          text: ClassificationHandler.format(item.classification, item.additionalClassifications).join("\n"),
          style: PDF_FILED_KEYS.TABLE_DATA_ESCO,
        },
        {
          text: StringHandler.customerLocation(this.getField(item, "deliveryAddress")),
          style: PDF_FILED_KEYS.TABLE_DATA_ESCO,
        },
        {
          text: String(Number(minimalStepPercentage) * nbuRateConverter),
          style: PDF_FILED_KEYS.TABLE_DATA_ESCO,
        },
        {
          text: "",
          style: PDF_FILED_KEYS.TABLE_DATA_ESCO,
        },
        {
          text: fundingKindCell,
          style: PDF_FILED_KEYS.TABLE_DATA_ESCO,
        },
        {
          text: yearlyPaymentsPercentageRange,
          style: PDF_FILED_KEYS.TABLE_DATA_ESCO,
        },
      ])
    );
    return {
      headerRows: 1,
      table: {
        widths: [
          PDF_HELPER_CONST.ROW_WIDTH_65,
          PDF_HELPER_CONST.ROW_WIDTH_65,
          PDF_HELPER_CONST.ROW_WIDTH_65,
          PDF_HELPER_CONST.ROW_WIDTH_75,
          PDF_HELPER_CONST.ROW_WIDTH_70,
          PDF_HELPER_CONST.ROW_WIDTH_65,
          PDF_HELPER_CONST.ROW_WIDTH_65,
        ],
        body,
      },
    };
  }

  private createPaymentTable(milestones: Array<Milestone>): Record<string, any> {
    const header = [
      {
        text: ANNOUNCEMENT_TEXTS_LIST.contract_terms_event,
        style: PDF_FILED_KEYS.TABLE_HEAD,
      },
      {
        text: ANNOUNCEMENT_TEXTS_LIST.contract_terms_description,
        style: PDF_FILED_KEYS.TABLE_HEAD,
      },
      {
        text: ANNOUNCEMENT_TEXTS_LIST.contract_terms_paymentType,
        style: PDF_FILED_KEYS.TABLE_HEAD,
      },
      {
        text: ANNOUNCEMENT_TEXTS_LIST.contract_terms_period,
        style: PDF_FILED_KEYS.TABLE_HEAD,
      },
      {
        text: ANNOUNCEMENT_TEXTS_LIST.contract_terms_daysType,
        style: PDF_FILED_KEYS.TABLE_HEAD,
      },
      {
        text: ANNOUNCEMENT_TEXTS_LIST.contract_terms_payment,
        style: PDF_FILED_KEYS.TABLE_HEAD,
      },
    ];

    const body: { text: string }[][] = [];
    body.push(header);

    milestones.forEach((milestone: Record<string, any>) =>
      body.push([
        {
          text: this.getField(MILESTONE_EVENT, this.getField(milestone, "title")),
        },
        {
          text: this.getField(milestone, "description"),
        },
        {
          text: this.getField(PAYMENT_TYPE, this.getField(milestone, "code")),
        },
        {
          text: this.getField(milestone, "duration.days"),
        },
        {
          text: this.getField(DURATION_TYPE, this.getField(milestone, "duration.type")),
        },
        {
          text: this.getField(milestone, "percentage"),
        },
      ])
    );
    return {
      table: {
        widths: [
          PDF_HELPER_CONST.ROW_WIDTH_70,
          PDF_HELPER_CONST.ROW_WIDTH_150,
          PDF_HELPER_CONST.ROW_WIDTH_90,
          PDF_HELPER_CONST.ROW_WIDTH_50,
          PDF_HELPER_CONST.ROW_WIDTH_50,
          PDF_HELPER_CONST.ROW_WIDTH_50,
        ],
        body,
      },
    };
  }

  private getTenderPeriod(
    awardPeriod: Record<string, any>,
    tenderPeriod: Record<string, any>,
    procurementMethodType: string
  ): string {
    if (
      noSecurement.includes(procurementMethodType as procurementMethodTypes) &&
      this.getField(awardPeriod, "startDate")
    ) {
      return this.getField(awardPeriod, "startDate");
    }
    return this.getField(tenderPeriod, "endDate")
      ? this.getField(tenderPeriod, "endDate")
      : ANNOUNCEMENT_TEXTS_LIST.missing_she;
  }

  private getOnlineAuction(lots: Record<string, any>[], auctionPeriod: Record<string, any>): string {
    if (Array.isArray(lots) && lots.length > 0) {
      return this.getField(lots[0], "auctionPeriod.startDate")
        ? this.getDecisionDatePublished(this.getField(lots[0], "auctionPeriod.startDate"), true)
        : ANNOUNCEMENT_TEXTS_LIST.missing_he;
    }
    return this.getField(auctionPeriod, "startDate")
      ? this.getDecisionDatePublished(this.getField(auctionPeriod, "startDate"), true)
      : ANNOUNCEMENT_TEXTS_LIST.missing_he;
  }

  private displayUnderHeaderLots(
    file: Record<string, any>,
    lots: Record<string, any>[],
    dictionaries: Map<string, Record<string, any>>
  ): Record<string, any>[] {
    const res: Record<string, any>[] = [];

    lots.map((lot, index) => {
      const { items, milestones, criteria } = file;
      const lotFile: Record<string, any> = { ...file };

      lotFile.items = (items || []).filter((item: { relatedLot: string }) => item.relatedLot === lot.id);
      lotFile.milestones = (milestones || []).filter((item: { relatedLot: string }) => item.relatedLot === lot.id);
      lotFile.value = lot.value;
      lotFile.minimalStep = lot.minimalStep;
      lotFile.auctionPeriod = lot.auctionPeriod;
      lotFile.guarantee = lot.guarantee;
      lotFile.criteria = (criteria || []).filter(
        (criteria: { relatedItem: string; classification: { id: string }; relatesTo: string }) =>
          criteria.relatedItem === lot.id ||
          criteria.classification.id === CriterionValues.BID_LANGUAGE ||
          criteria.relatesTo === "tender"
      );

      res.push({
        text: `Лот ${index + 1} — ${lot.title}`,
        style: PDF_FILED_KEYS.TITLE_LARGE,
      });
      res.push(this.displayUnderHeader(lotFile, dictionaries));
    });
    return res;
  }

  private getSecurementAmount(
    criteria: Record<string, any>[],
    lots: Record<string, any>[],
    guarantee: Record<string, any>,
    procurementMethodType: string
  ): Record<string, any> {
    if (!Array.isArray(criteria)) {
      return PDF_HELPER_CONST.EMPTY_FIELD;
    }

    const guaranteeAmount =
      guarantee && Number(this.getField(guarantee, "amount")) > 0
        ? `${UnitHelper.currencyFormatting(this.getField(guarantee, "amount"))} ${this.getField(guarantee, "currency")}`
        : ANNOUNCEMENT_TEXTS_LIST.missing_he;
    const lotsGuaranteeAmount =
      Number(this.getField(lots, "[0].guarantee.amount")) > 0
        ? `${UnitHelper.currencyFormatting(this.getField(lots, "[0].guarantee.amount"))} ${this.getField(lots, "[0].guarantee.currency")}`
        : ANNOUNCEMENT_TEXTS_LIST.missing_he;
    return this.showIfAvailable(
      Array.isArray(lots) && lots.length > 0 ? lotsGuaranteeAmount : guaranteeAmount,
      ANNOUNCEMENT_TEXTS_LIST.securement_amount,
      Array.isArray(criteria) && noSecurement.includes(procurementMethodType as procurementMethodTypes)
    );
  }
}
