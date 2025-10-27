import { AbstractDocumentStrategy } from "@/services/PDF/document/AbstractDocumentStrategy";
import { PDF_FILED_KEYS } from "@/constants/pdf/pdfFieldKeys";
import * as CONCLUSION_OF_MONITORING_CONST from "@/config/pdf/conclusionOfMonitoringConstants";
import { PROTOCOL_CONSIDERATION_TENDER_OFFERS } from "@/config/pdf/texts/PROTOCOL_CONSIDERATION_TENDER_OFFERS";
import * as PDF_HELPER_CONST from "@/constants/pdf/pdfHelperConstants";
import type { SignerType } from "@/types/sign/SignerType";
import { MARGIN_TOP_10__BOTTOM_15, MARGIN_TOP_3 } from "@/config/pdf/protocolConsiderationTenderOffersConstants";
import { STRING } from "@/constants/string";
import { QualificationsStatusType } from "@/types/ProtocolConsiderationTenderOffers/Qualifications";
import type { QualificationsType } from "@/types/ProtocolConsiderationTenderOffers/Qualifications";
import { DictionaryHelper } from "@/services/Common/DictionaryHelper";
import type { LotsType, ProtocolConsiderationTenderOffers } from "@/types/ProtocolConsiderationTenderOffers/Tender";
import type { DocumentType } from "@/types/Tender/DocumentType";
import { StringHandler } from "@/utils/StringHandler";
import { ANNOUNCEMENT_PAGE_MARGIN } from "@/config/pdf/announcementConstants";
import type { PdfDocumentConfigType } from "@/types/pdf/PdfDocumentConfigType";

export class ProtocolConsiderationTenderOffersDataMaker extends AbstractDocumentStrategy {
  private readonly dictionaryHelper: DictionaryHelper = new DictionaryHelper(this);

  create(
    tender: ProtocolConsiderationTenderOffers,
    _config: PdfDocumentConfigType,
    _signers: SignerType[],
    dictionaries: Map<string, Record<string, any>>,
    document?: DocumentType
  ): Record<string, any>[] {
    if (!document) {
      return [];
    }

    const { procuringEntity } = tender;
    const customerCategory = this.getCustomerCategory(
      procuringEntity,
      dictionaries.get("organisation"),
      PROTOCOL_CONSIDERATION_TENDER_OFFERS.customer_category
    );
    const tenderId = this.emptyChecker.isNotEmptyString(this.getField(tender, "tenderID"))
      ? this.getField(tender, "tenderID", "")
      : STRING.DASH;

    return [
      {
        style: PDF_FILED_KEYS.HEADING_TITLE,
        text: PROTOCOL_CONSIDERATION_TENDER_OFFERS.title,
      },
      {
        margin: CONCLUSION_OF_MONITORING_CONST.MARGIN_TOP_3,
        text: PROTOCOL_CONSIDERATION_TENDER_OFFERS.subtitle,
        style: PDF_FILED_KEYS.TITLE_MEDIUM,
      },
      {
        text: tenderId.concat("\n\n"),
        style: PDF_FILED_KEYS.TITLE_MEDIUM,
      },
      this.showWithDefault(
        this.getField(procuringEntity, "identifier.legalName") || this.getField(procuringEntity, "name"),
        PROTOCOL_CONSIDERATION_TENDER_OFFERS.customer_info
      ),
      customerCategory,
      this.showWithDefault(
        this.getField(procuringEntity, "identifier.id"),
        PROTOCOL_CONSIDERATION_TENDER_OFFERS.customer_edrpou
      ),

      this.showWithDefault(
        StringHandler.customerLocation(this.getField(procuringEntity, "address")),
        PROTOCOL_CONSIDERATION_TENDER_OFFERS.customer_location,
        Boolean(this.getField(procuringEntity, "address"))
      ),
      this.dictionaryHelper.getTenderProcurementMethodType(
        this.getField(tender, "procurementMethodType", STRING.EMPTY),
        dictionaries.get("tender_procurement_method_type"),
        PROTOCOL_CONSIDERATION_TENDER_OFFERS.type_of_purchase
      ),
      this.showWithDefault(this.getField(tender, "title"), PROTOCOL_CONSIDERATION_TENDER_OFFERS.procuring_entity_title),
      ...this.resolveTables(tender),
      this.showWithDefault(
        PROTOCOL_CONSIDERATION_TENDER_OFFERS.has_been_resolved_text,
        PROTOCOL_CONSIDERATION_TENDER_OFFERS.has_been_resolved
      ),
    ];
  }

  getPageMargins(): number[] {
    return ANNOUNCEMENT_PAGE_MARGIN;
  }

  private resolveTables(tender: ProtocolConsiderationTenderOffers): Record<string, any>[] {
    const { lots, qualifications } = tender;
    return Array.isArray(lots) && lots.length
      ? this.prepareLotsTable(tender, qualifications, lots)
      : this.createItemTable(tender, qualifications, null);
  }

  private prepareLotsTable(
    tender: ProtocolConsiderationTenderOffers,
    qualifications: QualificationsType[],
    lots: LotsType[]
  ): Record<string, any>[] {
    const res: Record<string, any>[] = [];
    lots.map(lot => {
      const qualificationsItems = qualifications.filter(
        qualification => this.getField(qualification, "lotID") === this.getField(lot, "id")
      );
      if (qualificationsItems.length > 0) {
        res.push(this.createItemTable(tender, qualificationsItems, this.getField(lot, "title", STRING.EMPTY)));
      }
    });
    return res;
  }

  private createItemTable(
    tender: ProtocolConsiderationTenderOffers,
    qualifications: QualificationsType[],
    title: string | null
  ): Record<string, any>[] {
    if (!Array.isArray(qualifications)) {
      return [PDF_HELPER_CONST.EMPTY_FIELD];
    }
    const resultOutputCollection: Record<string, any>[] = [];
    title = title
      ? `${PROTOCOL_CONSIDERATION_TENDER_OFFERS.list_tender_offers_for_lot} ${STRING.DASH} ${title}`
      : PROTOCOL_CONSIDERATION_TENDER_OFFERS.list_tender_offers;
    resultOutputCollection.push({
      text: title,
      style: PDF_FILED_KEYS.TITLE_MEDIUM_BOLD,
      margin: MARGIN_TOP_3,
    });
    const header = [
      {
        text: PROTOCOL_CONSIDERATION_TENDER_OFFERS.name_of_the_nomenclature_item_of_the_procurement,
        style: PDF_FILED_KEYS.TABLE_HEAD,
      },
      {
        text: PROTOCOL_CONSIDERATION_TENDER_OFFERS.result_of_consideration_of_tender_offer,
        style: PDF_FILED_KEYS.TABLE_HEAD,
      },
      {
        text: PROTOCOL_CONSIDERATION_TENDER_OFFERS.grounds_for_rejecting_tender,
        style: PDF_FILED_KEYS.TABLE_HEAD,
      },
    ];
    const body: Record<string, any>[][] = [];
    body.push(header);
    qualifications.forEach(item =>
      body.push([
        {
          text: this.resolveBidsData(tender, item),
          style: PDF_FILED_KEYS.TABLE_DATA,
        },
        {
          text: this.resolveQualificationsStatus(this.getField(item, "status")),
          style: PDF_FILED_KEYS.TABLE_DATA,
        },
        {
          text: this.prepareGroundsRorRejecting(item),
          style: PDF_FILED_KEYS.TABLE_DATA,
        },
      ])
    );
    resultOutputCollection.push({
      table: {
        headerRows: 0,
        dontBreakRows: false,
        widths: [PDF_HELPER_CONST.ROW_AUTO_WIDTH, PDF_HELPER_CONST.ROW_AUTO_WIDTH, PDF_HELPER_CONST.ROW_AUTO_WIDTH],
        body,
      },
      margin: MARGIN_TOP_10__BOTTOM_15,
    });
    return resultOutputCollection;
  }

  private resolveBidsData(tender: ProtocolConsiderationTenderOffers, qualification: QualificationsType): string {
    const { bids } = tender;
    if (!Array.isArray(bids) || !qualification.hasOwnProperty("bidID")) {
      return STRING.DASH;
    }
    const bid = bids.find(bid => this.getField(bid, "id") === this.getField(qualification, "bidID"));
    return bid
      ? this.getField(bid, "tenderers.0.identifier.legalName", "") || this.getField(bid, "tenderers.0.name", "")
      : STRING.DASH;
  }

  private prepareGroundsRorRejecting(qualification: QualificationsType): string {
    const title = this.getField(qualification, "title", "");
    const description = this.getField(qualification, "description", "");
    return this.emptyChecker.isEmptyString(title) && this.emptyChecker.isEmptyString(description)
      ? STRING.DASH
      : `${title}\n\n${description}`;
  }

  private resolveQualificationsStatus(
    status: (typeof QualificationsStatusType)[keyof typeof QualificationsStatusType]
  ): string {
    switch (status) {
      case QualificationsStatusType.ACTIVE:
        return PROTOCOL_CONSIDERATION_TENDER_OFFERS.qualifications_status_admitted_to_auction;
      case QualificationsStatusType.UNSUCCESSFUL:
        return PROTOCOL_CONSIDERATION_TENDER_OFFERS.qualifications_status_rejected;
      case QualificationsStatusType.PENDING:
        return PROTOCOL_CONSIDERATION_TENDER_OFFERS.qualifications_status_decision_is_awaited;
      case QualificationsStatusType.CANCELLED:
        return PROTOCOL_CONSIDERATION_TENDER_OFFERS.qualifications_status_decision_is_overturned;
      default:
        return STRING.DASH;
    }
  }
}
