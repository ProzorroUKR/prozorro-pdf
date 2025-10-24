import { AbstractDocumentStrategy } from "@/services/PDF/document/AbstractDocumentStrategy";
import { PDF_FILED_KEYS } from "@/constants/pdf/pdfFieldKeys";
import { ANNOUNCEMENT_PAGE_MARGIN } from "@/config/pdf/announcementConstants";
import { MARGIN_TOP_3, MARGIN_TOP_5__BOTTOM_5__LEFT_MINUS_5 } from "@/config/pdf/conclusionOfMonitoringConstants";
import { ANNOUNCEMENT_TEXTS_LIST } from "@/config/pdf/texts/ANNUAL_PROCUREMENT_PLAN";
import * as PDF_HELPER_CONST from "@/constants/pdf/pdfHelperConstants";
import type { SignerType } from "types/sign/SignerType";
import type {
  AnnouncementItem,
  AnnouncementItemAdditionalClassification,
} from "@/types/Announcement/AnnouncementTypes";
import {
  additionalClassifications,
  additionalClassificationsResolves,
} from "@/constants/AnnualProcurementPlan/additionalClassifications";
import { STRING } from "@/constants/string";
import { DateHandler } from "@/utils/DateHandler";
import { DictionaryHelper } from "@/services/Common/DictionaryHelper";
import { UnitHelper } from "@/services/Common/UnitHelper";
import { StringHandler } from "@/utils/StringHandler";
import type { PdfDocumentConfigType } from "@/types/pdf/PdfDocumentConfigType";
import { DictionaryCollector } from "@/services/DictionaryCollector/DictionaryCollector";

export class AnnualProcurementPlanDataMaker extends AbstractDocumentStrategy {
  private readonly dictionaryHelper = new DictionaryHelper(this);

  async create(
    {
      items,
      planID,
      buyers: [buyer],
      procuringEntity,
      budget,
      classification,
      tender: tenderData,
      additionalClassifications: additionalClassificationsData,
      rationale,
    }: Record<any, any>,
    _config: PdfDocumentConfigType,
    _signers: SignerType[],
    dictionaries: Map<string, Record<string, any>>
  ): Promise<Record<string, any>[]> {
    const customerCategory = this.getCustomerCategory(
      buyer,
      dictionaries.get("organisation"),
      ANNOUNCEMENT_TEXTS_LIST.customer_category
    );
    const buyerCategory = this.getCustomerCategory(
      procuringEntity,
      dictionaries.get("organisation"),
      ANNOUNCEMENT_TEXTS_LIST.customer_organization_category
    );
    const katottgIdsList: string[] =
      budget?.breakdown
        ?.map(({ address }: any) => address)
        .filter(Boolean)
        .map(({ addressDetails }: any) => addressDetails)
        .filter(Boolean)
        .flat()
        .map(({ id }: any) => id)
        .filter(Boolean) || [];

    if (katottgIdsList.length > 0) {
      const dictionary = new Map<string, string>().set("katottg", "katottg");

      const responce = await new DictionaryCollector(this.envVars.staticDataUrl).loadByDictionary(dictionary, {
        katottg: [...new Set(katottgIdsList)], // remove duplicates
      });

      responce.forEach((value: any, key: string) => {
        dictionaries.set(key, value);
      });
    }

    return [
      {
        style: PDF_FILED_KEYS.HEADING_TITLE,
        text: ANNOUNCEMENT_TEXTS_LIST.title,
      },
      {
        margin: MARGIN_TOP_3,
        text: ANNOUNCEMENT_TEXTS_LIST.subtitle,
        style: PDF_FILED_KEYS.TITLE_MEDIUM,
      },
      {
        text: (planID || STRING.DASH).concat("\n\n"),
        style: PDF_FILED_KEYS.TITLE_MEDIUM,
      },
      this.showWithDefault(
        this.getField(buyer, "identifier.legalName") || this.getField(buyer, "name"),
        ANNOUNCEMENT_TEXTS_LIST.customer_info
      ),
      customerCategory,
      this.showWithDefault(this.getField(buyer, "identifier.id"), ANNOUNCEMENT_TEXTS_LIST.customer_edrpou),
      this.showWithDefault(
        StringHandler.customerLocation(this.getField(buyer, "address")),
        ANNOUNCEMENT_TEXTS_LIST.customer_location,
        Boolean(this.getField(buyer, "address"))
      ),
      this.showWithDefault(
        this.getField(procuringEntity, "identifier.legalName") || this.getField(procuringEntity, "name") || STRING.DASH,
        ANNOUNCEMENT_TEXTS_LIST.customer_organization_name
      ),
      buyerCategory,
      this.showWithDefault(
        this.getField(procuringEntity, "identifier.id"),
        ANNOUNCEMENT_TEXTS_LIST.customer_organization_edr_id
      ),
      this.showWithDefault(
        StringHandler.customerLocation(this.getField(procuringEntity, "address")),
        ANNOUNCEMENT_TEXTS_LIST.customer_organization_location,
        Boolean(this.getField(procuringEntity, "address"))
      ),
      this.dictionaryHelper.getTenderProcurementMethodType(
        this.getField(tenderData, "procurementMethodType", STRING.EMPTY),
        dictionaries.get("tender_procurement_method_type"),
        ANNOUNCEMENT_TEXTS_LIST.type_of_purchase
      ),
      this.showWithDefault(this.getField(budget, "description"), ANNOUNCEMENT_TEXTS_LIST.procurement_type),
      this.showWithDefault(
        this.dictionaryHelper.getClassificationField(classification, dictionaries.get("classifier_dk")),
        ANNOUNCEMENT_TEXTS_LIST.procuring_entity_code
      ),
      this.showWithDefault(
        `${this.getItemAdditionalClassification(
          this.typeChecker.isArray(additionalClassificationsData) ? additionalClassificationsData : [],
          dictionaries,
          STRING.DASH
        )}`,
        ANNOUNCEMENT_TEXTS_LIST.classifiers_names
      ),
      this.showWithDefault(
        `${UnitHelper.currencyFormatting(this.getField(budget, "amount") || "0")} ${this.getField(budget, "currency")}`,
        ANNOUNCEMENT_TEXTS_LIST.expected_price
      ),
      this.showWithDefault(
        DateHandler.prepareDate(this.getField(tenderData, "tenderPeriod.startDate")),
        ANNOUNCEMENT_TEXTS_LIST.tender_start_date
      ),
      this.showWithDefault(
        this.getField(budget, "project.name") || STRING.DASH,
        ANNOUNCEMENT_TEXTS_LIST.budget_project
      ),
      this.createItemTable(items, dictionaries),
      this.createBudgetBreakdownTable(budget.breakdown, dictionaries),
      this.showWithDefault(
        this.getField(rationale, "description"),
        ANNOUNCEMENT_TEXTS_LIST.reasons_for_purchase_by_customer
      ),
      this.showIfAvailable(ANNOUNCEMENT_TEXTS_LIST.has_been_resolved_text, ANNOUNCEMENT_TEXTS_LIST.has_been_resolved),
    ];
  }

  getPageMargins(): number[] {
    return ANNOUNCEMENT_PAGE_MARGIN;
  }

  pageBreakBefore(): (
    currentNode?: Record<string, any>,
    followingNodesOnPage?: Record<string, any>,
    nodesOnNextPage?: Record<string, any>,
    previousNodesOnPage?: Record<string, any>
  ) => boolean | undefined {
    return (currentNode: Record<string, any> | undefined) => currentNode?.headlineLevel === 1;
  }

  private createBudgetBreakdownTable(
    breakdown: Array<Record<string, any>>,
    dictionaries: Map<string, Record<string, any>>
  ): Record<string, any> {
    if (!Array.isArray(breakdown)) {
      return PDF_HELPER_CONST.EMPTY_FIELD;
    }

    const header = [
      {
        text: ANNOUNCEMENT_TEXTS_LIST.source_funding,
        style: PDF_FILED_KEYS.TABLE_HEAD,
      },
      {
        text: ANNOUNCEMENT_TEXTS_LIST.description,
        style: PDF_FILED_KEYS.TABLE_HEAD,
      },
      {
        text: ANNOUNCEMENT_TEXTS_LIST.classification,
        style: PDF_FILED_KEYS.TABLE_HEAD,
      },
      {
        text: ANNOUNCEMENT_TEXTS_LIST.address,
        style: PDF_FILED_KEYS.TABLE_HEAD,
      },
      {
        text: ANNOUNCEMENT_TEXTS_LIST.budget_breakdown_sum,
        style: PDF_FILED_KEYS.TABLE_HEAD,
      },
    ];

    const body: Record<string, any>[][] = [];
    body.push(header);

    breakdown.forEach(item =>
      body.push([
        {
          text:
            this.getField(
              dictionaries.get("budget_source") || {},
              `${this.getField(item, "title")}.title`,
              STRING.DASH
            ) ?? STRING.DASH,
          style: PDF_FILED_KEYS.TABLE_DATA,
        },
        {
          text: this.getField(item, "description", STRING.DASH).trim(),
          style: PDF_FILED_KEYS.TABLE_DATA,
        },
        {
          text: this.getClassification(item?.classification || {}),
          style: PDF_FILED_KEYS.TABLE_DATA,
        },
        {
          text: this.getAddress(item?.address || {}, dictionaries),
          style: PDF_FILED_KEYS.TABLE_DATA,
        },
        {
          text:
            `${UnitHelper.currencyFormatting(this.getField(item, "value.amount") || "0")} ${this.getField(item, "value.currency")}`.trim() ??
            STRING.DASH,
          style: PDF_FILED_KEYS.TABLE_DATA,
        },
      ])
    );
    return this.resolveTableBug(
      {
        table: {
          unbreakable: true,
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
        margin: MARGIN_TOP_5__BOTTOM_5__LEFT_MINUS_5,
      },
      {
        text: STRING.EMPTY,
        style: PDF_FILED_KEYS.TABLE_HEAD,
      }
    );
  }

  private createItemTable(
    items: Array<AnnouncementItem>,
    dictionaries: Map<string, Record<string, any>>
  ): Record<string, any> {
    if (!Array.isArray(items)) {
      return PDF_HELPER_CONST.EMPTY_FIELD;
    }

    const header = [
      {
        text: ANNOUNCEMENT_TEXTS_LIST.procuring_entity_name,
        style: PDF_FILED_KEYS.TABLE_HEAD,
      },
      {
        text: ANNOUNCEMENT_TEXTS_LIST.procuring_entity_code_table,
        style: PDF_FILED_KEYS.TABLE_HEAD,
      },
      {
        text: ANNOUNCEMENT_TEXTS_LIST.classifiers_names_table,
        style: PDF_FILED_KEYS.TABLE_HEAD,
      },
      {
        text: ANNOUNCEMENT_TEXTS_LIST.procurement_amount,
        style: PDF_FILED_KEYS.TABLE_HEAD,
      },
    ];

    const body: Record<string, any>[][] = [];
    body.push(header);

    items.forEach(item =>
      body.push([
        {
          text: this.emptyChecker.isEmptyString(this.getField(item, "description", STRING.EMPTY).trim())
            ? STRING.DASH
            : this.getField(item, "description"),
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
          text: `${this.getItemAdditionalClassification(this.getField(item, "additionalClassifications"), dictionaries)}`,
          style: PDF_FILED_KEYS.TABLE_DATA,
        },
        {
          text: `${this.getQuantity(item, "quantity")} ${this.prepareUnitName(item, dictionaries.get("units"))}`,
          style: PDF_FILED_KEYS.TABLE_DATA,
        },
      ])
    );

    return this.resolveTableBug(
      {
        pageBreak: "before",
        table: {
          headerRows: 0,
          dontBreakRows: false,
          widths: [
            PDF_HELPER_CONST.ROW_AUTO_WIDTH,
            PDF_HELPER_CONST.ROW_AUTO_WIDTH,
            PDF_HELPER_CONST.ROW_AUTO_WIDTH,
            PDF_HELPER_CONST.ROW_AUTO_WIDTH,
          ],
          body,
        },
        margin: MARGIN_TOP_5__BOTTOM_5__LEFT_MINUS_5,
      },
      {
        text: STRING.EMPTY,
        style: PDF_FILED_KEYS.TABLE_HEAD,
      }
    );
  }

  private getItemAdditionalClassification(
    classifications: Array<AnnouncementItemAdditionalClassification>,
    dictionaries: Map<string, Record<string, any>>,
    defaultValue = STRING.DASH
  ): string {
    if (undefined === classifications || (Array.isArray(classifications) && classifications.length === 0)) {
      return defaultValue;
    }
    if (!Array.isArray(classifications)) {
      return defaultValue;
    }
    const classificationsData: string[] = classifications.map(
      (item: AnnouncementItemAdditionalClassification): string => {
        if (this.emptyChecker.isEmptyString(item.scheme)) {
          return STRING.EMPTY;
        }
        if (additionalClassifications.hasOwnProperty(`${item.scheme}`)) {
          let text = additionalClassifications[item.scheme];
          const { dictionary } = additionalClassificationsResolves[item.scheme];
          const id = this.emptyChecker.isNotEmptyString(item.id) ? item.id : STRING.DASH;
          let description = this.emptyChecker.isNotEmptyString(item.description) ? item.description : STRING.EMPTY;
          if (this.emptyChecker.isEmptyString(item.id) && this.emptyChecker.isEmptyString(item.description)) {
            return STRING.EMPTY;
          }
          if (
            this.emptyChecker.isNotEmptyString(id) &&
            this.emptyChecker.isEmptyString(description) &&
            dictionary !== null
          ) {
            const dictionaryData = dictionaries.get(dictionary);
            if (dictionaryData === undefined) {
              description = STRING.DASH;
            } else {
              description = dictionaryData.hasOwnProperty(id) ? dictionaryData[id] : STRING.DASH;
            }
          }
          text = additionalClassificationsResolves[item.scheme].format
            .replace(":classification", text)
            .replace(":id", id)
            .replace(":dash", STRING.DASH)
            .replace(":description", description);

          return this.emptyChecker.isNotEmptyString(text.trim()) ? text : STRING.EMPTY;
        }
        return STRING.EMPTY;
      }
    );
    const displayText = classificationsData
      .filter((item: string) => this.emptyChecker.isNotEmptyString(item))
      .join(",\n");
    return this.emptyChecker.isNotEmptyString(displayText) ? displayText : defaultValue;
  }

  private prepareUnitName(item: AnnouncementItem, recommendedDictionary: Record<string, any> | undefined): string {
    if (!this.emptyChecker.isEmptyString(this.getField(item, "unit.name"))) {
      return this.getField(item, "unit.name");
    }
    if (recommendedDictionary === undefined) {
      return STRING.DASH;
    }
    const unitCode = `${this.getField(item, "unit.code", STRING.EMPTY)}.name`;
    const unitDictionaryName = this.getField(recommendedDictionary, unitCode, STRING.EMPTY);
    return this.emptyChecker.isEmptyString(unitDictionaryName) ? STRING.DASH : unitDictionaryName;
  }

  private getClassification(classification: Record<any, any>): string {
    const hasValue = Object.values(classification).some(value => Boolean(value));

    if (!hasValue) {
      return STRING.DASH;
    }

    const shema = classification.scheme ? `${classification.scheme}: ` : "";
    const id = classification.id ? `${classification.id} – ` : "";
    return `${shema}${id}${classification.description || ""}`;
  }

  private getAddress(
    { addressDetails, countryName }: Record<any, any>,
    dictionaries: Map<string, Record<string, any>>
  ): string {
    if (!addressDetails?.length && !countryName) {
      return STRING.DASH;
    }

    const katottgDictionary = dictionaries.get("katottg") || {};
    const katottgCategoriesDictionary = dictionaries.get("katottg_categories") || {};

    const values = (addressDetails || []).map(({ id, description }: Record<any, any>) => {
      const { category } = katottgDictionary[id] || {};
      const { name } = katottgCategoriesDictionary[category] || {};
      return [name, description].filter(Boolean).join(STRING.WHITESPACE);
    });

    return [countryName, ...values].filter(Boolean).join(STRING.DELIMITER.NEW_LINE);
  }
}
