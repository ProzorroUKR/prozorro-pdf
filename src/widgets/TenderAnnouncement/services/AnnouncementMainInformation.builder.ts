import { get } from "lodash";
import { PDF_FILED_KEYS } from "@/constants/pdf/pdfFieldKeys";
import { ESCO_TYPE, STRING } from "@/constants/string";
import { PDFTablesHandler } from "@/services/PDF/Formatting/PDFTablesHandler";
import { StringHandler } from "@/utils/StringHandler";
import { ContactPointFormatter, CONTRACT_POINT_TYPE } from "@/utils/ObjectToString/ContactPointFormatter";
import { ANNOUNCEMENT_TEXTS_LIST } from "@/config/pdf/texts/ANNOUNCEMENT";
import { PROCUREMENT_METHOD_TYPE } from "@/widgets/TenderAnnouncement/constants/procurementMethodType";
import * as CONCLUSION_OF_MONITORING_CONST from "@/config/pdf/conclusionOfMonitoringConstants";
import { PROCUREMENT_METHOD } from "@/widgets/TenderAnnouncement/constants/procurementMethod";
import { procurementMethodTypeEU } from "@/widgets/TenderAnnouncement/constants/conditions";
import { PROCUREMENT_CATEGORY } from "@/widgets/TenderAnnouncement/constants/procurementCategory";
import { CLASSIFIED_ID_CHARACTERS } from "@/constants/pdf/pdfHelperConstants";

export interface IAnnouncementMainInformationBuilder {
  getResult: Record<string, any>[];
  setTitle: IAnnouncementMainInformationBuilder;
  setSubTitle: IAnnouncementMainInformationBuilder;
  setTenderId: IAnnouncementMainInformationBuilder;
  setName: IAnnouncementMainInformationBuilder;
  setCustomerCategory: IAnnouncementMainInformationBuilder;
  setIdentifier: IAnnouncementMainInformationBuilder;
  setAddress: IAnnouncementMainInformationBuilder;
  setContactPoint: IAnnouncementMainInformationBuilder;
  setMainProcurementCategory: IAnnouncementMainInformationBuilder;
  setTenderTitle: IAnnouncementMainInformationBuilder;
  setClassificationId: IAnnouncementMainInformationBuilder;
}

export class AnnouncementMainInformationBuilder implements IAnnouncementMainInformationBuilder {
  private readonly _data: Record<string, any>[] = [];

  constructor(
    private readonly tender: Record<string, any>,
    private readonly dictionaries: Map<string, Record<string, any>>
  ) {}

  get getResult(): Record<string, any>[] {
    return this._data;
  }

  get setTitle(): IAnnouncementMainInformationBuilder {
    this._data.push({
      text: ANNOUNCEMENT_TEXTS_LIST.title,
      style: PDF_FILED_KEYS.HEADING_TITLE,
    });
    return this;
  }

  get setSubTitle(): IAnnouncementMainInformationBuilder {
    const { procurementMethod, procurementMethodType } = this.tender;
    const subTitle = this._getField(PROCUREMENT_METHOD_TYPE, `${procurementMethod}.${procurementMethodType}`);

    this._data.push({
      margin: CONCLUSION_OF_MONITORING_CONST.MARGIN_TOP_3,
      text: subTitle || this._getField(PROCUREMENT_METHOD, procurementMethod),
      style: PDF_FILED_KEYS.TITLE_MEDIUM,
    });
    return this;
  }

  get setTenderId(): IAnnouncementMainInformationBuilder {
    const tenderId = this._getField<string>(this.tender, "tenderID") || STRING.DASH;
    this._data.push({
      text: tenderId.concat("\n\n"),
      style: PDF_FILED_KEYS.TITLE_MEDIUM,
    });
    return this;
  }

  get setName(): IAnnouncementMainInformationBuilder {
    const name =
      this._getField<string>(this.tender, "procuringEntity.identifier.legalName") ||
      this._getField<string>(this.tender, "procuringEntity.name");
    this._addRow(ANNOUNCEMENT_TEXTS_LIST.customer_info, name);

    if (this._isEuProcMethodType()) {
      this._addRow(ANNOUNCEMENT_TEXTS_LIST.purchasing_body, name);
    }

    return this;
  }

  get setCustomerCategory(): IAnnouncementMainInformationBuilder {
    const dictionary = this.dictionaries.get("organisation") || {};
    const value = this._getField<Record<any, any>>(dictionary, this.tender?.procuringEntity?.kind);

    this._addRow(ANNOUNCEMENT_TEXTS_LIST.customer_category, value?.title);

    if (this._isEuProcMethodType()) {
      this._addRow(ANNOUNCEMENT_TEXTS_LIST.kind, value?.title);
    }

    return this;
  }

  get setIdentifier(): IAnnouncementMainInformationBuilder {
    const id = this._getField<string>(this.tender, "procuringEntity.identifier.id");
    const title = this._isEsco() ? ANNOUNCEMENT_TEXTS_LIST.esco_edrpou : ANNOUNCEMENT_TEXTS_LIST.customer_edrpou;
    this._addRow(title, id);

    if (this._isEuProcMethodType()) {
      this._addRow(ANNOUNCEMENT_TEXTS_LIST.national_id, id);
    }

    return this;
  }

  get setAddress(): IAnnouncementMainInformationBuilder {
    this._addRow(
      ANNOUNCEMENT_TEXTS_LIST.customer_location,
      StringHandler.customerLocation(this.tender?.procuringEntity?.address || {})
    );
    return this;
  }

  get setContactPoint(): IAnnouncementMainInformationBuilder {
    this._addRow(
      ANNOUNCEMENT_TEXTS_LIST.customer_contact_person,
      ContactPointFormatter.format(this.tender?.procuringEntity?.contactPoint || {}, {
        separator: STRING.COMMA,
        type: CONTRACT_POINT_TYPE.NTE,
      })
    );

    if (this._isEuProcMethodType()) {
      this._addRow(
        ANNOUNCEMENT_TEXTS_LIST.contact_point,
        ContactPointFormatter.format(this.tender?.procuringEntity?.contactPoint || {}, {
          separator: STRING.COMMA,
          type: CONTRACT_POINT_TYPE.NTE,
        })
      );
    }

    return this;
  }

  get setMainProcurementCategory(): IAnnouncementMainInformationBuilder {
    const { mainProcurementCategory } = this.tender;
    const value = this._getField<string | undefined>(PROCUREMENT_CATEGORY, mainProcurementCategory);
    this._addRow(ANNOUNCEMENT_TEXTS_LIST.procurement_category, value);

    if (this._isEuProcMethodType()) {
      this._addRow(ANNOUNCEMENT_TEXTS_LIST.main_procurement_category, value);
    }

    return this;
  }

  get setTenderTitle(): IAnnouncementMainInformationBuilder {
    this._addRow(ANNOUNCEMENT_TEXTS_LIST.procuring_entity_title, this.tender?.title);

    if (this._isEuProcMethodType()) {
      this._addRow(ANNOUNCEMENT_TEXTS_LIST.title_subject, this.tender?.title_en);
    }

    return this;
  }

  // Should refactor
  get setClassificationId(): IAnnouncementMainInformationBuilder {
    const dictionary = this.dictionaries.get("classifier_dk");
    const { items, mainProcurementCategory } = this.tender;

    if (!dictionary || mainProcurementCategory === "works" || !items?.length) {
      return this;
    }

    let classifiedId = this._getField<string>(this.tender, "items[0]classification.id");
    let classifiedKey = this._getField<string>(this.tender, "items[0]classification.id");

    try {
      switch (true) {
        case classifiedId === "99999999-9":
          classifiedKey = "99999999-9";
          classifiedId = dictionary["99999999-9"];
          break;
        case classifiedId.indexOf("336") === 0:
          classifiedKey = "33600000-6";
          classifiedId = dictionary["33600000-6"];
          break;
        default:
          [classifiedKey] = Object.keys(dictionary).filter(item =>
            item.startsWith(classifiedId.slice(0, CLASSIFIED_ID_CHARACTERS).toString())
          );
          classifiedId = dictionary[classifiedKey];
      }
    } catch (e) {
      console.log(e);
    }

    if (classifiedId) {
      this._addRow(
        ANNOUNCEMENT_TEXTS_LIST.purchase_dictionary_code,
        `${ANNOUNCEMENT_TEXTS_LIST.dk_2015}: ${classifiedKey} - ${classifiedId}`
      );
    }

    return this;
  }

  /**
   * Add row if value exists
   */
  private _addRow(title: string, value?: string | null): void {
    if ([undefined, null, ""].includes(value as any)) {
      return;
    }

    this._data.push(
      PDFTablesHandler.createTableLayout([
        PDFTablesHandler.createTableRow({
          head: title,
          data: value as string,
        }),
      ])
    );
  }

  private _isEsco(): boolean {
    return this.tender?.procurementMethodType === ESCO_TYPE;
  }

  private _isEuProcMethodType(): boolean {
    return procurementMethodTypeEU.includes(this.tender?.procurementMethodType);
  }

  private _getField<T>(object: Record<string, any>, path: string, defaultValue: T = "" as any): T {
    return (get(object, path) as T) || defaultValue;
  }
}
