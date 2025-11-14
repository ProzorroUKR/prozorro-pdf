import { get } from "lodash";
import { PDF_FILED_KEYS } from "@/constants/pdf/pdfFieldKeys";
import { STRING } from "@/constants/string";
import type { TenderOfferType } from "@/types/TenderOffer/Tender";
import { PDFTablesHandler } from "@/services/PDF/Formatting/PDFTablesHandler";
import { StringHandler } from "@/utils/StringHandler";
import type { AwardType } from "@/types/Tender/AwardType";
import { DEVIATION_REPORT_TEXT } from "@/config/pdf/texts/DEVIATION_REPORT_TEXT";
import { MARGIN_TOP_3 } from "@/config/pdf/conclusionOfMonitoringConstants";
import type { QualificationsType } from "@/types/ProtocolConsiderationTenderOffers/Qualifications";
import type { OrganizationType } from "@/types/Tender/OrganizationType";
import type { IdentifierType } from "@/types/Tender/IdentifierType";

export class MainInformationBuilder {
  private readonly _data: Record<string, any>[] = [];

  constructor(
    private readonly tender: TenderOfferType,
    private readonly data: AwardType | QualificationsType,
    private readonly dictionaries: Map<string, Record<string, any>>
  ) {}

  get getResult(): Record<string, any>[] {
    return this._data;
  }

  get setTitle(): MainInformationBuilder {
    this._data.push({
      style: PDF_FILED_KEYS.HEADING_TITLE,
      text: DEVIATION_REPORT_TEXT.title,
    });
    return this;
  }

  get setSubTitle(): MainInformationBuilder {
    this._data.push({
      margin: MARGIN_TOP_3,
      text: DEVIATION_REPORT_TEXT.subtitle,
      style: PDF_FILED_KEYS.TITLE_MEDIUM,
    });
    return this;
  }

  get setTenderId(): MainInformationBuilder {
    const tenderId = this._getField<string>(this.tender, "tenderID") || STRING.DASH;
    this._data.push({
      text: tenderId.concat("\n\n"),
      style: PDF_FILED_KEYS.TITLE_MEDIUM,
    });
    return this;
  }

  get setName(): MainInformationBuilder {
    const name = this._getIdentifierName(this._getField<OrganizationType | undefined>(this.tender, "procuringEntity"));
    this._addSimpleRow(DEVIATION_REPORT_TEXT.procuringEntityName, name);
    return this;
  }

  get setKind(): MainInformationBuilder {
    const kind = this._getField<string>(this.tender, "procuringEntity.kind");
    const entityKindTranslated = this._getField<string>(this.dictionaries.get("organisation") || {}, `${kind}.title`);
    this._addSimpleRow(DEVIATION_REPORT_TEXT.procuringEntityKind, entityKindTranslated);
    return this;
  }

  get setIdentifier(): MainInformationBuilder {
    const id = this._getField<string>(this.tender, "procuringEntity.identifier.id");
    this._addSimpleRow(DEVIATION_REPORT_TEXT.procuringEntityId, id);
    return this;
  }

  get setAddress(): MainInformationBuilder {
    this._addSimpleRow(
      DEVIATION_REPORT_TEXT.procuringEntityAddress,
      StringHandler.customerLocation(this._getField<any>(this.tender, "procuringEntity.address", {}))
    );
    return this;
  }

  get setProcMethodType(): MainInformationBuilder {
    const value = this._getField<string>(
      this.dictionaries.get("procMethodType") || {},
      `${this.tender.procurementMethodType}.name`
    );
    this._addSimpleRow(DEVIATION_REPORT_TEXT.procMethodType, value);
    return this;
  }

  get setTenderTitle(): MainInformationBuilder {
    this._addSimpleRow(DEVIATION_REPORT_TEXT.tenderTitle, this.tender.title);
    return this;
  }

  get setLotTitle(): MainInformationBuilder {
    const { title } = this.tender?.lots?.find(lot => lot.id === this.data?.lotID) || {};
    this._addSimpleRow(DEVIATION_REPORT_TEXT.lotTitle, title);
    return this;
  }

  get setSupplierName(): MainInformationBuilder {
    const supplier: OrganizationType | undefined = (this.data as AwardType)?.suppliers?.[0];

    if (supplier) {
      const name = this._getIdentifierName(supplier);
      const scheme = this._getIdentifierScheme(supplier?.identifier);
      const value = [name, scheme].filter(Boolean).join("\n");
      this._addSimpleRow(DEVIATION_REPORT_TEXT.supplierName, value);
      return this;
    }

    const bidId: string | undefined = (this.data as AwardType)?.bid_id || (this.data as QualificationsType)?.bidID;
    const bid = this.tender.bids?.find(bid => bid.id === bidId);
    const tenderer = bid?.tenderers?.[0];

    if (tenderer) {
      const name = this._getIdentifierName(tenderer as OrganizationType | undefined);
      const scheme = this._getIdentifierScheme(tenderer?.identifier as IdentifierType | undefined);
      const value = [name, scheme].filter(Boolean).join("\n");
      this._addSimpleRow(DEVIATION_REPORT_TEXT.supplierName, value);
      return this;
    }

    this._addSimpleRow(DEVIATION_REPORT_TEXT.supplierName, "");

    return this;
  }

  private _getIdentifierName(data: OrganizationType | undefined): string | undefined {
    return data?.identifier?.legalName || data?.name;
  }

  private _getIdentifierScheme(data?: IdentifierType): string {
    return (
      [data?.id, `${data?.scheme ? `(${data.scheme})` : ""}`].filter(Boolean).join(STRING.WHITESPACE) || STRING.EMPTY
    );
  }

  private _addSimpleRow(title: string, value?: string | null): void {
    this._data.push(
      PDFTablesHandler.createTableLayout([
        PDFTablesHandler.createTableRow({
          head: title,
          data: [undefined, null, ""].includes(value as any) ? STRING.DASH : (value as string),
        }),
      ])
    );
  }

  private _getField<T>(object: Record<string, any>, path: string, defaultValue: T = "" as any): T {
    return (get(object, path) as T) || defaultValue;
  }
}
