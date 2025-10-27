import type { SignerType } from "@prozorro/prozorro-eds";
import { AbstractDocumentStrategy } from "@/services/PDF/document/AbstractDocumentStrategy";
import { PDF_FILED_KEYS } from "@/constants/pdf/pdfFieldKeys";
import { ANNOUNCEMENT_PAGE_MARGIN } from "@/config/pdf/announcementConstants";
import * as CONCLUSION_OF_MONITORING_CONST from "@/config/pdf/conclusionOfMonitoringConstants";
import { MARGIN_TOP_10__BOTTOM_15, MARGIN_TOP_3 } from "@/config/pdf/conclusionOfMonitoringConstants";
import { PROTOCOL_ON_EXTENSION_OF_REVIEW_PERIOD } from "@/config/pdf/texts/PROTOCOL_ON_EXTENSION_OF_REVIEW_PERIOD";
import * as PDF_HELPER_CONST from "@/constants/pdf/pdfHelperConstants";
import type { AwardType } from "@/types/Tender/AwardType";
import { Assert } from "@/widgets/ErrorExceptionCore/Assert";
import { STRING } from "@/constants/string";
import { DictionaryHelper } from "@/services/Common/DictionaryHelper";
import { AwardHelper } from "@/services/Common/AwardHelper";
import type { OrganizationType } from "@/types/Tender/OrganizationType";
import { StringHandler } from "@/utils/StringHandler";
import { ERROR_MESSAGES } from "@/widgets/ErrorExceptionCore/configs/messages";
import type { PdfDocumentConfigType } from "@/types/pdf/PdfDocumentConfigType";

export class ProtocolOnExtensionOfReviewPeriodDataMaker extends AbstractDocumentStrategy {
  private readonly dictionaryHelper: DictionaryHelper = new DictionaryHelper(this);
  private readonly awardHelper = new AwardHelper(this);

  public create(
    tender: Record<string, any>,
    _config: PdfDocumentConfigType,
    _signers: SignerType[],
    dictionaries: Map<string, Record<string, any>>,
    awardType?: AwardType
  ): Record<string, any>[] {
    if (!awardType) {
      return [];
    }

    const { awards, procuringEntity } = tender;
    let award = null;

    if (Array.isArray(awards)) {
      award = awards.find((award: AwardType) => award.id === awardType.id);
    } else if (tender.hasOwnProperty("id")) {
      award = tender;
    }

    Assert.isDefined(award, ERROR_MESSAGES.VALIDATION_FAILED.awardNotFound);

    const customerCategory = this.getCustomerCategory(
      procuringEntity,
      dictionaries.get("organisation"),
      PROTOCOL_ON_EXTENSION_OF_REVIEW_PERIOD.customer_category
    );
    const tenderId: string = this.emptyChecker.isNotEmptyString(this.getField(tender, "tenderID"))
      ? this.getField(tender, "tenderID")
      : STRING.DASH;
    const [extensionMilestone] = award.milestones?.filter(
      (item: { code: string }) => item.code === "extensionPeriod"
    ) || [STRING.EMPTY];
    return [
      {
        style: PDF_FILED_KEYS.HEADING_TITLE,
        text: PROTOCOL_ON_EXTENSION_OF_REVIEW_PERIOD.title,
      },
      {
        margin: CONCLUSION_OF_MONITORING_CONST.MARGIN_TOP_3,
        text: PROTOCOL_ON_EXTENSION_OF_REVIEW_PERIOD.subtitle,
        style: PDF_FILED_KEYS.TITLE_MEDIUM,
      },
      {
        text: tenderId.concat("\n\n"),
        style: PDF_FILED_KEYS.TITLE_MEDIUM,
      },
      this.showWithDefault(
        this.getField(procuringEntity, "identifier.legalName") || this.getField(procuringEntity, "name"),
        PROTOCOL_ON_EXTENSION_OF_REVIEW_PERIOD.customer_info
      ),
      customerCategory,
      this.showWithDefault(
        this.getField(procuringEntity, "identifier.id"),
        PROTOCOL_ON_EXTENSION_OF_REVIEW_PERIOD.customer_edrpou
      ),

      this.showWithDefault(
        StringHandler.customerLocation(this.getField(procuringEntity, "address")),
        PROTOCOL_ON_EXTENSION_OF_REVIEW_PERIOD.customer_location,
        Boolean(this.getField(procuringEntity, "address"))
      ),
      this.dictionaryHelper.getTenderProcurementMethodType(
        this.getField(tender, "procurementMethodType"),
        dictionaries.get("tender_procurement_method_type"),
        PROTOCOL_ON_EXTENSION_OF_REVIEW_PERIOD.type_of_purchase
      ),
      this.showWithDefault(
        this.getField(tender, "title"),
        PROTOCOL_ON_EXTENSION_OF_REVIEW_PERIOD.procuring_entity_title
      ),

      ...this.createAwardTables(award, tender),
      this.showWithDefault(
        extensionMilestone?.description,
        PROTOCOL_ON_EXTENSION_OF_REVIEW_PERIOD.grounds_for_extension_tender
      ),
      this.showWithDefault(
        PROTOCOL_ON_EXTENSION_OF_REVIEW_PERIOD.has_been_resolved_text,
        PROTOCOL_ON_EXTENSION_OF_REVIEW_PERIOD.has_been_resolved
      ),
    ];
  }

  getPageMargins(): number[] {
    return ANNOUNCEMENT_PAGE_MARGIN;
  }

  private createAwardTables(award: AwardType, tender: Record<string, any>): Record<string, any>[] {
    const resultOutputTable: Record<string, any>[] = [];
    const { suppliers } = award;

    Assert.isDefined(suppliers, ERROR_MESSAGES.VALIDATION_FAILED.suppliersIsNotDefined);

    const [supplier] = suppliers;

    if (award.hasOwnProperty("lotID") && STRING.EMPTY !== this.getField(award, "lotID", STRING.EMPTY)) {
      const { lots } = tender;
      const lot = lots?.find((lotItem: Record<string, any>) => lotItem.id === award.lotID);
      let title = STRING.DASH;
      if (lot) {
        title = this.getField(lot, "title");
      }
      const fullTitle = `Лот — ${title}`;
      resultOutputTable.push({
        text: fullTitle,
        style: PDF_FILED_KEYS.TITLE_MEDIUM_BOLD,
        margin: MARGIN_TOP_3,
      });
    }
    const headerMap = [
      PROTOCOL_ON_EXTENSION_OF_REVIEW_PERIOD.participants_name_table,
      PROTOCOL_ON_EXTENSION_OF_REVIEW_PERIOD.awards_value_amount_table,
      PROTOCOL_ON_EXTENSION_OF_REVIEW_PERIOD.awards_weighted_value_table,
      PROTOCOL_ON_EXTENSION_OF_REVIEW_PERIOD.awards_amount_performance_value_table,
    ];

    const bodyMap: string[] = [
      this.getParticipantsName(supplier),
      this.awardHelper.showAwardWithTax(award, "value", PROTOCOL_ON_EXTENSION_OF_REVIEW_PERIOD.with_tax),
      this.awardHelper.showAwardWithTax(award, "weightedValue", PROTOCOL_ON_EXTENSION_OF_REVIEW_PERIOD.with_tax),
      this.awardHelper.showAwardWithTax(award, "amountPerformance", PROTOCOL_ON_EXTENSION_OF_REVIEW_PERIOD.with_tax),
    ];

    const preparedBody: ({ key: number; text: string; style: string } | null)[] = bodyMap
      .map((value, index) => {
        if (!value) {
          return null;
        }
        return [
          {
            key: index,
            text: value,
            style: PDF_FILED_KEYS.TABLE_DATA,
          },
        ];
      })
      .filter(Boolean)
      .flat();

    const header = headerMap
      .map((value, index) => {
        const find = preparedBody?.find(item => item?.key === index);
        if (find) {
          return {
            key: index,
            text: value,
            style: PDF_FILED_KEYS.TABLE_HEAD,
          };
        }
        return null;
      })
      .filter(Boolean);

    const body = [[...header], [...preparedBody]];
    const width = [
      PDF_HELPER_CONST.ROW_AUTO_WIDTH,
      ...Array(preparedBody.length - 1).fill(PDF_HELPER_CONST.ROW_WIDTH_95),
    ];
    resultOutputTable.push({
      table: {
        headerRows: 0,
        dontBreakRows: true,
        widths: width,
        body,
      },
      margin: MARGIN_TOP_10__BOTTOM_15,
    });

    return resultOutputTable;
  }

  private getParticipantsName(supplier: OrganizationType): string {
    const name = this.getField(supplier, "identifier.legalName") || this.getField(supplier, "name");
    const scheme = this.getField(supplier, "identifier.scheme") || STRING.EMPTY;
    return (
      `${name} \n ${this.getField(supplier, "identifier.id")} ${scheme ? `(${scheme})` : ""}`.trim() || STRING.DASH
    );
  }
}
