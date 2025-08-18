import { AbstractDocumentStrategy } from "@/services/PDF/document/AbstractDocumentStrategy";
import { PDF_FILED_KEYS } from "@/constants/pdf/pdfFieldKeys";
import { ANNOUNCEMENT_PAGE_MARGIN } from "@/config/pdf/announcementConstants";
import * as CONCLUSION_OF_MONITORING_CONST from "@/config/pdf/conclusionOfMonitoringConstants";
import { PURCHASE_CANCELLATION_PROTOCOL } from "@/config/pdf/texts/PURCHASE_CANCELLATION_PROTOCOL";
import * as PDF_HELPER_CONST from "@/constants/pdf/pdfHelperConstants";
import type { SignerType } from "@/types/sign/SignerType";
import type { AnnouncementItem } from "@/types/Announcement/AnnouncementTypes";
import { MARGIN_TOP_10__BOTTOM_15, MARGIN_TOP_3 } from "@/config/pdf/purchaseCancellationProtocolConstants";
import { STRING } from "@/constants/string";
import { CancellationOfStatuses } from "@/types/PurchaseCancellation/PurchaseCancellationTypes";
import type { CancellationType } from "@/types/PurchaseCancellation/PurchaseCancellationTypes";
import { DictionaryHelper } from "@/services/Common/DictionaryHelper";
import { UnitHelper } from "@/services/Common/UnitHelper";
import { DeliveryHelper } from "@/services/Common/DeliveryHelper";
import { StringHandler } from "@/utils/StringHandler";
import { Assert } from "@/widgets/ErrorExceptionCore/Assert";
import { ERROR_MESSAGES } from "@/widgets/ErrorExceptionCore/configs/messages";
import { PDFTablesHandler } from "@/services/PDF/Formatting/PDFTablesHandler";
import type { PdfDocumentConfigType } from "@/types/pdf/PdfDocumentConfigType";

export class PurchaseCancellationProtocolDataMaker extends AbstractDocumentStrategy {
  private readonly unitHelper: UnitHelper = new UnitHelper(this);
  private readonly deliveryHelper: DeliveryHelper = new DeliveryHelper(this);
  private readonly dictionaryHelper: DictionaryHelper = new DictionaryHelper(this);

  public create(
    tender: Record<string, any>,
    _config: PdfDocumentConfigType,
    _signers: SignerType[],
    dictionaries: Map<string, Record<string, any>>,
    originalCancellation?: CancellationType
  ): Record<string, any>[] {
    if (!originalCancellation) {
      return [];
    }

    const { cancellations, procuringEntity, buyers } = tender;

    let cancellation = null;

    if (Array.isArray(cancellations)) {
      cancellation = cancellations.find((c: CancellationType) => c.id === originalCancellation.id);
    } else if (tender.hasOwnProperty("id")) {
      cancellation = tender;
    }

    Assert.isDefined(cancellation, ERROR_MESSAGES.VALIDATION_FAILED.cancellationNotFound);

    const customerCategory = this.getCustomerCategory(
      procuringEntity,
      dictionaries.get("organisation"),
      PURCHASE_CANCELLATION_PROTOCOL.customer_category
    );
    const tenderId = this.emptyChecker.isNotEmptyString(this.getField(tender, "tenderID"))
      ? this.getField(tender, "tenderID", "")
      : STRING.DASH;

    const reason = this.getField(cancellation, "reason", STRING.EMPTY);
    const descriptionGroundsForRejectingTender = PDFTablesHandler.createTableLayout(
      [
        PDFTablesHandler.createTableRow({
          head: PURCHASE_CANCELLATION_PROTOCOL.description_grounds_for_rejecting_tender,
          data: reason.length ? reason : STRING.DASH,
        }),
      ],
      false
    );

    return [
      {
        style: PDF_FILED_KEYS.HEADING_TITLE,
        text: PURCHASE_CANCELLATION_PROTOCOL.title,
      },
      {
        margin: CONCLUSION_OF_MONITORING_CONST.MARGIN_TOP_3,
        text: PURCHASE_CANCELLATION_PROTOCOL.subtitle,
        style: PDF_FILED_KEYS.TITLE_MEDIUM,
      },
      {
        text: tenderId.concat("\n\n"),
        style: PDF_FILED_KEYS.TITLE_MEDIUM,
      },
      this.showWithDefault(
        this.getField(procuringEntity, "identifier.legalName") || this.getField(procuringEntity, "name"),
        PURCHASE_CANCELLATION_PROTOCOL.customer_info
      ),
      customerCategory,
      this.showWithDefault(
        this.getField(procuringEntity, "identifier.id"),
        PURCHASE_CANCELLATION_PROTOCOL.customer_edrpou
      ),

      this.showWithDefault(
        StringHandler.customerLocation(this.getField(procuringEntity, "address")),
        PURCHASE_CANCELLATION_PROTOCOL.customer_location,
        Boolean(this.getField(procuringEntity, "address"))
      ),
      this.dictionaryHelper.getTenderProcurementMethodType(
        this.getField(tender, "procurementMethodType"),
        dictionaries.get("tender_procurement_method_type"),
        PURCHASE_CANCELLATION_PROTOCOL.type_of_purchase
      ),
      this.showWithDefault(this.getField(tender, "title"), PURCHASE_CANCELLATION_PROTOCOL.procuring_entity_title),
      ...this.buyersTables(buyers),
      ...this.resolveTables(tender, cancellation, dictionaries),
      this.getCancellationReasonType(cancellation, dictionaries.get("cancellation_reason_type")),
      descriptionGroundsForRejectingTender,
      this.showWithDefault(
        PURCHASE_CANCELLATION_PROTOCOL.has_been_resolved_text,
        PURCHASE_CANCELLATION_PROTOCOL.has_been_resolved
      ),
    ];
  }

  getPageMargins(): number[] {
    return ANNOUNCEMENT_PAGE_MARGIN;
  }

  private resolveTables(
    tender: Record<string, any>,
    cancellation: CancellationType,
    dictionaries: Map<string, Record<string, any>>
  ): Record<string, any>[] {
    const { lots, items } = tender;
    return Array.isArray(lots)
      ? this.prepareLotsTable(tender, lots, cancellation, dictionaries)
      : this.createItemTable(items, cancellation, dictionaries, null);
  }

  private prepareLotsTable(
    tender: Record<string, any>,
    lots: Record<string, any>[],
    cancellation: CancellationType,
    dictionaries: Map<string, Record<string, any>>
  ): Record<string, any>[] {
    const res: Record<string, any>[] = [];
    const { cancellationOf } = cancellation;
    if (!cancellationOf) {
      return res;
    }
    const { items } = tender;
    if (!Array.isArray(items)) {
      return res;
    }
    if (cancellationOf === CancellationOfStatuses.TENDER) {
      /**
       * Якщо cancellationOf==tender і в тендері є lots, то виводяться всі номенклатури тендера згруповані по лотах (items групуємо за умови items:relatedLot==lots:id) і виводяться відповідно заголовки для кожної таблиці лоту.
       */
      lots.forEach(lot => {
        const title = `Лот — ${lot.title}`;
        const selectedLotItems = items.filter((item: { relatedLot: string }) => item.relatedLot === lot.id);
        res.push(this.createItemTable(selectedLotItems, cancellation, dictionaries, title));
      });
      return res;
    }
    /**
     * Якщо cancellationOf==lot, то в таблиці виводяться всі номенклатури лоту, що відміняється (всі items за умови items:relatedLot==cancellations:relatedLot) і виводиться заголовок таблиці з назвою цього лоту (лот за умови cancellations:relatedLot==lots:id).
     */
    const lot = lots.find(lot => lot.id === cancellation?.relatedLot);
    if (!lot) {
      return res;
    }
    const title = `Лот — ${lot.title}`;

    const selectedLotItems =
      cancellationOf === CancellationOfStatuses.LOT
        ? items.filter((item: { relatedLot: string }) => item.relatedLot === cancellation.relatedLot)
        : [];
    res.push(this.createItemTable(selectedLotItems, cancellation, dictionaries, title));

    return res;
  }

  private createItemTable(
    items: Array<AnnouncementItem>,
    cancellation: CancellationType,
    dictionaries: Map<string, Record<string, any>>,
    title: string | null
  ): Record<string, any>[] {
    if (!Array.isArray(items)) {
      return [PDF_HELPER_CONST.EMPTY_FIELD];
    }
    const { cancellationOf } = cancellation;
    /**
     * Якщо cancellationOf==tender і в тендері немає lots, то в таблиці виводяться всі номенклатури тендера (всі items) і заголовок таблиці не виводиться.
     * title === null - це означає, що таблиця не лотова, а загальна по тендеру.
     */
    if (null === title && cancellationOf !== CancellationOfStatuses.TENDER) {
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
        text: PURCHASE_CANCELLATION_PROTOCOL.name_of_the_nomenclature_item_of_the_procurement,
        style: PDF_FILED_KEYS.TABLE_HEAD,
      },
      {
        text: PURCHASE_CANCELLATION_PROTOCOL.purchase_dictionary_code,
        style: PDF_FILED_KEYS.TABLE_HEAD,
      },
      {
        text: PURCHASE_CANCELLATION_PROTOCOL.procurement_amount,
        style: PDF_FILED_KEYS.TABLE_HEAD,
      },
      {
        text: PURCHASE_CANCELLATION_PROTOCOL.procurement_destination,
        style: PDF_FILED_KEYS.TABLE_HEAD,
      },
      {
        text: PURCHASE_CANCELLATION_PROTOCOL.delivery_period,
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

  private buyersTables(buyers: Record<string, any>[] | undefined): Record<string, any>[] {
    if (!Array.isArray(buyers) || buyers.length === 0) {
      return [PDF_HELPER_CONST.EMPTY_FIELD];
    }
    const outputBuyerCollection: Record<string, any>[] = [];
    const header = [
      {
        text: PURCHASE_CANCELLATION_PROTOCOL.customer_category_header_table,
        style: PDF_FILED_KEYS.TABLE_HEAD,
      },
      {
        text: PURCHASE_CANCELLATION_PROTOCOL.customer_edrpou_header_table,
        style: PDF_FILED_KEYS.TABLE_HEAD,
      },
      {
        text: PURCHASE_CANCELLATION_PROTOCOL.customer_location_header_table,
        style: PDF_FILED_KEYS.TABLE_HEAD,
      },
    ];
    const body: Record<string, any>[][] = [];
    body.push(header);
    buyers.forEach(buyer =>
      body.push([
        {
          text: this.getField(buyer, "identifier.legalName") || this.getField(buyer, "name", STRING.DASH),
          style: PDF_FILED_KEYS.TABLE_DATA,
        },
        {
          text: this.getField(buyer, "identifier.id", STRING.DASH),
          style: PDF_FILED_KEYS.TABLE_DATA,
        },
        {
          text: StringHandler.customerLocation(this.getField(buyer, "address"), STRING.DASH),
          style: PDF_FILED_KEYS.TABLE_DATA,
        },
      ])
    );
    outputBuyerCollection.push({
      table: {
        headerRows: 0,
        dontBreakRows: false,
        widths: [PDF_HELPER_CONST.ROW_AUTO_WIDTH, PDF_HELPER_CONST.ROW_AUTO_WIDTH, PDF_HELPER_CONST.ROW_AUTO_WIDTH],
        body,
      },
      margin: MARGIN_TOP_10__BOTTOM_15,
    });

    return outputBuyerCollection;
  }

  private getCancellationReasonType(
    cancellation: Record<string, any>,
    cancellationReasonTypeDictionary: Record<string, any> | undefined
  ): Record<string, any> {
    if (
      cancellationReasonTypeDictionary === undefined ||
      this.emptyChecker.isEmptyObject(cancellationReasonTypeDictionary)
    ) {
      return this.showWithDefault(STRING.DASH, PURCHASE_CANCELLATION_PROTOCOL.grounds_for_rejecting_tender);
    }

    const reason = this.getField(
      cancellationReasonTypeDictionary,
      `${cancellation?.reasonType}.title`,
      STRING.DASH
    ).trim();

    return PDFTablesHandler.createTableLayout([
      PDFTablesHandler.createTableRow({
        head: PURCHASE_CANCELLATION_PROTOCOL.grounds_for_rejecting_tender,
        data: reason,
      }),
    ]);
  }
}
