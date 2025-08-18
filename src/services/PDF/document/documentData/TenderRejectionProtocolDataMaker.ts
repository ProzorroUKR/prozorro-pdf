import { AbstractDocumentStrategy } from "@/services/PDF/document/AbstractDocumentStrategy";
import { PDF_FILED_KEYS } from "@/constants/pdf/pdfFieldKeys";
import { ANNOUNCEMENT_PAGE_MARGIN } from "@/config/pdf/announcementConstants";
import * as CONCLUSION_OF_MONITORING_CONST from "@/config/pdf/conclusionOfMonitoringConstants";
import { MARGIN_TOP_10__BOTTOM_15, MARGIN_TOP_3 } from "@/config/pdf/conclusionOfMonitoringConstants";
import { TENDER_REJECTION_PROTOCOL } from "@/config/pdf/texts/TENDER_REJECTION_PROTOCOL";
import * as PDF_HELPER_CONST from "@/constants/pdf/pdfHelperConstants";
import type { SignerType } from "types/sign/SignerType";
import type { AnnouncementItem } from "@/types/Announcement/AnnouncementTypes";
import type { AwardType } from "@/types/Tender/AwardType";
import { Assert } from "@/widgets/ErrorExceptionCore/Assert";
import { STRING } from "@/constants/string";
import { DictionaryHelper } from "@/services/Common/DictionaryHelper";
import { AwardHelper } from "@/services/Common/AwardHelper";
import { DeliveryHelper } from "@/services/Common/DeliveryHelper";
import { UnitHelper } from "@/services/Common/UnitHelper";
import { StringHandler } from "@/utils/StringHandler";
import { ERROR_MESSAGES } from "@/widgets/ErrorExceptionCore/configs/messages";
import type { PdfDocumentConfigType } from "@/types/pdf/PdfDocumentConfigType";

export class TenderRejectionProtocolDataMaker extends AbstractDocumentStrategy {
  private readonly dictionaryHelper: DictionaryHelper = new DictionaryHelper(this);
  private readonly awardHelper: AwardHelper = new AwardHelper(this);
  private readonly deliveryHelper: DeliveryHelper = new DeliveryHelper(this);
  private readonly unitHelper: UnitHelper = new UnitHelper(this);
  // Fix title field
  private isTenderLoaded = false;

  public create(
    tender: Record<string, any>,
    _config: PdfDocumentConfigType,
    _signers: SignerType[],
    dictionaries: Map<string, Record<string, any>>,
    originalAward?: AwardType
  ): Record<string, any>[] {
    if (!originalAward) {
      return [];
    }

    const { awards, procuringEntity } = tender;

    let award = null;

    if (Array.isArray(awards)) {
      award = awards.find((award: AwardType) => award.id === originalAward.id);
      this.isTenderLoaded = true;
    } else if (tender.hasOwnProperty("id")) {
      award = tender;
    }

    Assert.isDefined(award, ERROR_MESSAGES.VALIDATION_FAILED.awardNotFound);

    const { suppliers } = award;

    Assert.isDefined(suppliers, ERROR_MESSAGES.VALIDATION_FAILED.suppliersIsNotDefined);

    const [supplier] = suppliers;
    const customerCategory = this.getCustomerCategory(
      procuringEntity,
      dictionaries.get("organisation"),
      TENDER_REJECTION_PROTOCOL.customer_category
    );
    const tenderId: string = this.emptyChecker.isNotEmptyString(this.getField(tender, "tenderID"))
      ? this.getField(tender, "tenderID")
      : STRING.DASH;

    return [
      {
        style: PDF_FILED_KEYS.HEADING_TITLE,
        text: TENDER_REJECTION_PROTOCOL.title,
      },
      {
        margin: CONCLUSION_OF_MONITORING_CONST.MARGIN_TOP_3,
        text: TENDER_REJECTION_PROTOCOL.subtitle,
        style: PDF_FILED_KEYS.TITLE_MEDIUM,
      },
      {
        text: tenderId.concat("\n\n"),
        style: PDF_FILED_KEYS.TITLE_MEDIUM,
      },
      this.showWithDefault(
        this.getField(procuringEntity, "identifier.legalName") || this.getField(procuringEntity, "name"),
        TENDER_REJECTION_PROTOCOL.customer_info
      ),
      customerCategory,
      this.showWithDefault(this.getField(procuringEntity, "identifier.id"), TENDER_REJECTION_PROTOCOL.customer_edrpou),

      this.showWithDefault(
        StringHandler.customerLocation(this.getField(procuringEntity, "address"), STRING.DASH),
        TENDER_REJECTION_PROTOCOL.customer_location,
        Boolean(this.getField(procuringEntity, "address"))
      ),
      this.dictionaryHelper.getTenderProcurementMethodType(
        this.getField(tender, "procurementMethodType"),
        dictionaries.get("tender_procurement_method_type"),
        TENDER_REJECTION_PROTOCOL.type_of_purchase
      ),
      this.showWithDefault(
        this.getField(tender, "title"),
        TENDER_REJECTION_PROTOCOL.procuring_entity_title,
        this.isTenderLoaded
      ),
      ...this.resolveTables(tender, award, dictionaries),
      this.showWithDefault(
        this.getField(supplier, "identifier.legalName") || this.getField(supplier, "name"),
        TENDER_REJECTION_PROTOCOL.participants_name
      ),
      this.showWithDefault(
        `${this.getField(supplier, "identifier.id")} (${this.getField(supplier, "identifier.scheme")})`,
        TENDER_REJECTION_PROTOCOL.id_code
      ),
      this.showIfAvailable(
        this.awardHelper.showAwardWithTax(award, "value", TENDER_REJECTION_PROTOCOL.with_tax),
        TENDER_REJECTION_PROTOCOL.awards_value_amount
      ),
      this.showIfAvailable(
        this.awardHelper.showAwardWithTax(award, "weightedValue", TENDER_REJECTION_PROTOCOL.with_tax),
        TENDER_REJECTION_PROTOCOL.awards_weighted_value
      ),
      this.awardHelper.showAwardPerformance(
        this.getField(award, "value"),
        TENDER_REJECTION_PROTOCOL.awards_amount_performance_value,
        TENDER_REJECTION_PROTOCOL.with_tax,
        false
      ),
      this.showWithDefault(this.getField(award, "title"), TENDER_REJECTION_PROTOCOL.grounds_for_rejecting_tender),
      this.showWithDefault(
        this.getField(award, "description"),
        TENDER_REJECTION_PROTOCOL.description_grounds_for_rejecting_tender
      ),
      this.showWithDefault(
        TENDER_REJECTION_PROTOCOL.has_been_resolved_text,
        TENDER_REJECTION_PROTOCOL.has_been_resolved
      ),
    ];
  }

  getPageMargins(): number[] {
    return ANNOUNCEMENT_PAGE_MARGIN;
  }

  private resolveTables(
    tender: Record<string, any>,
    award: AwardType,
    dictionaries: Map<string, Record<string, any>>
  ): Record<string, any>[] {
    const { lots, items } = tender;
    return award.hasOwnProperty("lotID") && Array.isArray(lots)
      ? this.prepareLotsTable(tender, lots, award, dictionaries)
      : this.createItemTable(items, dictionaries, null);
  }

  private prepareLotsTable(
    tender: Record<string, any>,
    lots: Record<string, any>[],
    award: AwardType,
    dictionaries: Map<string, Record<string, any>>
  ): Record<string, any>[] {
    const res: Record<string, any>[] = [];
    if (!Array.isArray(lots) || !award.hasOwnProperty("lotID")) {
      return res;
    }
    const lot = lots.find(lot => lot.id === award.lotID);
    if (!lot) {
      return res;
    }
    const title = `Лот — ${lot.title}`;
    const { items } = tender;
    const selectedLotItems = Array.isArray(items)
      ? items.filter((item: { relatedLot: string }) => item.relatedLot === lot.id)
      : [];

    res.push(this.createItemTable(selectedLotItems, dictionaries, title));
    return res;
  }

  private createItemTable(
    items: AnnouncementItem[],
    dictionaries: Map<string, Record<string, any>>,
    title: string | null
  ): Record<string, any>[] {
    if (!Array.isArray(items) || items.length === 0) {
      return [PDF_HELPER_CONST.EMPTY_FIELD];
    }
    const resultOutputCollection: Record<string, any>[] = [];
    if (title) {
      resultOutputCollection.push({
        text: title,
        style: PDF_FILED_KEYS.TITLE_MEDIUM_BOLD,
        margin: MARGIN_TOP_3,
      });
    }
    const header = [
      {
        text: TENDER_REJECTION_PROTOCOL.name_of_the_nomenclature_item_of_the_procurement,
        style: PDF_FILED_KEYS.TABLE_HEAD,
      },
      {
        text: TENDER_REJECTION_PROTOCOL.purchase_dictionary_code,
        style: PDF_FILED_KEYS.TABLE_HEAD,
      },
      {
        text: TENDER_REJECTION_PROTOCOL.procurement_amount,
        style: PDF_FILED_KEYS.TABLE_HEAD,
      },
      {
        text: TENDER_REJECTION_PROTOCOL.procurement_destination,
        style: PDF_FILED_KEYS.TABLE_HEAD,
      },
      {
        text: TENDER_REJECTION_PROTOCOL.delivery_period,
        style: PDF_FILED_KEYS.TABLE_HEAD,
      },
    ];
    const body: Record<string, any>[][] = [];
    body.push(header);
    items.forEach(item =>
      body.push([
        {
          text: this.getField(item, "description", STRING.DASH),
          style: PDF_FILED_KEYS.TABLE_DATA,
        },
        {
          text: this.dictionaryHelper.getClassificationField(
            this.getField(item, "classification"),
            dictionaries.get("classifier_dk")
          ),
          style: PDF_FILED_KEYS.TABLE_DATA,
        },
        {
          text: `${this.getQuantity(item, "quantity")} ${this.unitHelper.prepareUnitName(item, dictionaries.get("units"))}`,
          style: PDF_FILED_KEYS.TABLE_DATA,
        },
        {
          text: `${StringHandler.customerLocation(this.getField(item, "deliveryAddress"), STRING.DASH)}`,
          style: PDF_FILED_KEYS.TABLE_DATA,
        },
        {
          text: `${this.deliveryHelper.prepareDeliveryDate(item)}`,
          style: PDF_FILED_KEYS.TABLE_DATA,
        },
      ])
    );
    resultOutputCollection.push({
      table: {
        headerRows: 0,
        dontBreakRows: false,
        widths: [
          PDF_HELPER_CONST.ROW_AUTO_WIDTH,
          PDF_HELPER_CONST.ROW_AUTO_WIDTH,
          PDF_HELPER_CONST.ROW_AUTO_WIDTH,
          PDF_HELPER_CONST.ROW_AUTO_WIDTH,
          PDF_HELPER_CONST.ROW_AUTO_WIDTH,
        ],
        body,
      },
      margin: MARGIN_TOP_10__BOTTOM_15,
    });

    return resultOutputCollection;
  }
}
