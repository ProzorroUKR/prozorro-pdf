import { AbstractDocumentStrategy } from "@/services/PDF/document/AbstractDocumentStrategy";
import { PDF_FILED_KEYS } from "@/constants/pdf/pdfFieldKeys";
import { ANNOUNCEMENT_PAGE_MARGIN } from "@/config/pdf/announcementConstants";
import * as CONCLUSION_OF_MONITORING_CONST from "@/config/pdf/conclusionOfMonitoringConstants";
import { DETERMINING_WINNER_OF_PROCUREMENT } from "@/config/pdf/texts/DETERMINING_WINNER_OF_PROCUREMENT";
import * as PDF_HELPER_CONST from "@/constants/pdf/pdfHelperConstants";
import type { SignerType } from "@/types/sign/SignerType";
import type { AnnouncementItem } from "@/types/Announcement/AnnouncementTypes";
import type { AwardType } from "@/types/Tender/AwardType";
import { MARGIN_TOP_10__BOTTOM_15, MARGIN_TOP_3 } from "@/config/pdf/determiningWinnerOfProcurementConstants";
import { STRING } from "@/constants/string";
import { Assert } from "@/widgets/ErrorExceptionCore/Assert";
import { DictionaryHelper } from "@/services/Common/DictionaryHelper";
import { AwardHelper } from "@/services/Common/AwardHelper";
import { UnitHelper } from "@/services/Common/UnitHelper";
import { DeliveryHelper } from "@/services/Common/DeliveryHelper";
import { StringHandler } from "@/utils/StringHandler";
import { ERROR_MESSAGES } from "@/widgets/ErrorExceptionCore/configs/messages";
import type { PdfDocumentConfigType } from "@/types/pdf/PdfDocumentConfigType";

export class DeterminingWinnerOfProcurementDataMaker extends AbstractDocumentStrategy {
  protected readonly dictionaryHelper: DictionaryHelper = new DictionaryHelper(this);
  protected readonly awardHelper: AwardHelper = new AwardHelper(this);
  protected readonly unitHelper: UnitHelper = new UnitHelper(this);
  protected readonly deliveryHelper: DeliveryHelper = new DeliveryHelper(this);

  create(
    tender: Record<any, any>,
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
    } else if (tender.hasOwnProperty("id")) {
      award = tender;
    }

    Assert.isDefined(award, ERROR_MESSAGES.VALIDATION_FAILED.awardNotFound);

    const { suppliers, lotID } = award;

    Assert.isDefined(suppliers, ERROR_MESSAGES.VALIDATION_FAILED.participantsIsNotDefined);

    const [supplier] = suppliers;
    const customerCategory = this.getCustomerCategory(
      procuringEntity,
      dictionaries.get("organisation"),
      DETERMINING_WINNER_OF_PROCUREMENT.customer_category
    );
    const tenderId = this.emptyChecker.isNotEmptyString(this.getField(tender, "tenderID"))
      ? this.getField(tender, "tenderID", "")
      : STRING.DASH;
    return [
      {
        style: PDF_FILED_KEYS.HEADING_TITLE,
        text: DETERMINING_WINNER_OF_PROCUREMENT.title,
      },
      {
        margin: CONCLUSION_OF_MONITORING_CONST.MARGIN_TOP_3,
        text: DETERMINING_WINNER_OF_PROCUREMENT.subtitle,
        style: PDF_FILED_KEYS.TITLE_MEDIUM,
      },
      {
        text: tenderId.concat("\n\n"),
        style: PDF_FILED_KEYS.TITLE_MEDIUM,
      },
      this.showWithDefault(
        this.getField(procuringEntity, "identifier.legalName") || this.getField(procuringEntity, "name"),
        DETERMINING_WINNER_OF_PROCUREMENT.customer_info
      ),
      customerCategory,
      this.showWithDefault(
        this.getField(procuringEntity, "identifier.id"),
        DETERMINING_WINNER_OF_PROCUREMENT.customer_edrpou
      ),

      this.showWithDefault(
        StringHandler.customerLocation(this.getField(procuringEntity, "address"), STRING.DASH),
        DETERMINING_WINNER_OF_PROCUREMENT.customer_location,
        Boolean(this.getField(procuringEntity, "address"))
      ),
      this.dictionaryHelper.getTenderProcurementMethodType(
        this.getField(tender, "procurementMethodType"),
        dictionaries.get("tender_procurement_method_type"),
        DETERMINING_WINNER_OF_PROCUREMENT.type_of_purchase
      ),
      this.showWithDefault(this.getField(tender, "title"), DETERMINING_WINNER_OF_PROCUREMENT.procuring_entity_title),
      ...this.resolveTables(tender, dictionaries, lotID),
      this.showWithDefault(
        this.getField(supplier, "identifier.legalName") || this.getField(supplier, "name"),
        DETERMINING_WINNER_OF_PROCUREMENT.participants_name
      ),
      this.showWithDefault(
        `${this.getField(supplier, "identifier.id")} (${this.getField(supplier, "identifier.scheme")})`,
        DETERMINING_WINNER_OF_PROCUREMENT.id_code
      ),
      this.showIfAvailable(
        this.awardHelper.showAwardWithTax(award, "value", DETERMINING_WINNER_OF_PROCUREMENT.with_tax),
        DETERMINING_WINNER_OF_PROCUREMENT.awards_value_amount
      ),
      this.showIfAvailable(
        this.awardHelper.showAwardWithTax(award, "weightedValue", DETERMINING_WINNER_OF_PROCUREMENT.with_tax),
        DETERMINING_WINNER_OF_PROCUREMENT.awards_weighted_value
      ),
      this.awardHelper.showAwardPerformance(
        this.getField(award, "value"),
        DETERMINING_WINNER_OF_PROCUREMENT.awards_amount_performance_value,
        DETERMINING_WINNER_OF_PROCUREMENT.with_tax,
        false
      ),
      this.showWithDefault(
        DETERMINING_WINNER_OF_PROCUREMENT.has_been_resolved_text,
        DETERMINING_WINNER_OF_PROCUREMENT.has_been_resolved
      ),
    ];
  }

  getPageMargins(): number[] {
    return ANNOUNCEMENT_PAGE_MARGIN;
  }

  private resolveTables(
    tender: Record<string, any>,
    dictionaries: Map<string, Record<string, any>>,
    lotID: string | undefined
  ): Record<string, any>[] {
    let awardLot: Record<string, any> | null = null;
    const { lots, items } = tender;
    if (lotID && Array.isArray(lots) && lots.length > 0) {
      awardLot = lots.find((lot: { id: string }) => lot.id === lotID);
    }
    return awardLot
      ? this.prepareLotsTable(tender, [awardLot], dictionaries)
      : this.createItemTable(items, dictionaries, null);
  }

  private prepareLotsTable(
    tender: Record<string, any>,
    lots: Record<string, any>[],
    dictionaries: Map<string, Record<string, any>>
  ): Record<string, any>[] {
    const res: Record<string, any>[] = [];

    lots.map(lot => {
      const title = `Лот — ${lot.title}`;
      const { items } = tender;
      const selectedLotItems = Array.isArray(items)
        ? items.filter((item: { relatedLot: string }) => item.relatedLot === lot.id)
        : [];

      res.push(this.createItemTable(selectedLotItems, dictionaries, title));
    });
    return res;
  }

  private createItemTable(
    items: Array<AnnouncementItem>,
    dictionaries: Map<string, Record<string, any>>,
    title: string | null
  ): Record<string, any>[] {
    if (!Array.isArray(items)) {
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
        text: DETERMINING_WINNER_OF_PROCUREMENT.name_of_the_nomenclature_item_of_the_procurement,
        style: PDF_FILED_KEYS.TABLE_HEAD,
      },
      {
        text: DETERMINING_WINNER_OF_PROCUREMENT.purchase_dictionary_code,
        style: PDF_FILED_KEYS.TABLE_HEAD,
      },
      {
        text: DETERMINING_WINNER_OF_PROCUREMENT.procurement_amount,
        style: PDF_FILED_KEYS.TABLE_HEAD,
      },
      {
        text: DETERMINING_WINNER_OF_PROCUREMENT.procurement_destination,
        style: PDF_FILED_KEYS.TABLE_HEAD,
      },
      {
        text: DETERMINING_WINNER_OF_PROCUREMENT.delivery_period,
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
