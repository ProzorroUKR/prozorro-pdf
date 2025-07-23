import { isNumber, get } from "lodash";
import { PDF_FILED_KEYS } from "@/constants/pdf/pdfFieldKeys";
import { TENDER_OFFER } from "@/config/pdf/texts/TENDER_OFFER";
import { STRING } from "@/constants/string";
import type { BidsValueType, BidType, LotValueType, TenderOfferType } from "@/types/TenderOffer/Tender";
import { PDFTablesHandler } from "@/services/PDF/Formatting/PDFTablesHandler";
import { StringHandler } from "@/utils/StringHandler";
import { ContactPointFormatter, CONTRACT_POINT_TYPE } from "@/utils/ObjectToString/ContactPointFormatter";
import type { ContactPointType } from "@/types/Tender/ContactPointType";
import { UnitHelper } from "@/services/Common/UnitHelper";

export interface IMainInformationBuilder {
  getResult: Record<string, any>[];
  setTitle: IMainInformationBuilder;
  setTenderId: IMainInformationBuilder;
  setName: IMainInformationBuilder;
  setIdentifier: IMainInformationBuilder;
  setAddress: IMainInformationBuilder;
  setContactPoint: IMainInformationBuilder;
  setScale: IMainInformationBuilder;
  setValue: IMainInformationBuilder;
  setWeightedValue: IMainInformationBuilder;
  setSubcontractingDetails: IMainInformationBuilder;
}

export class MainInformationBuilder implements IMainInformationBuilder {
  private readonly _data: Record<string, any>[] = [];

  constructor(
    private readonly tender: TenderOfferType | LotValueType,
    private readonly bid: BidType | LotValueType,
    private readonly dictionaries: Map<string, Record<string, any>>
  ) {}

  get getResult(): Record<string, any>[] {
    return this._data;
  }

  get setTitle(): IMainInformationBuilder {
    this._data.push({
      style: PDF_FILED_KEYS.HEADING_TITLE,
      text: TENDER_OFFER.title,
    });
    return this;
  }

  get setTenderId(): IMainInformationBuilder {
    const tenderId = this._getField<string>(this.tender, "tenderID") || STRING.DASH;
    this._data.push({
      text: tenderId.concat("\n\n"),
      style: PDF_FILED_KEYS.TITLE_MEDIUM,
    });
    return this;
  }

  get setName(): IMainInformationBuilder {
    const name =
      this._getField<string>(this.bid, "tenderers[0].identifier.legalName") ||
      this._getField<string>(this.bid, "tenderers[0]name");
    this._addSimpleRow(TENDER_OFFER.name_of_the_nomenclature_item_of_the_procurement, name);
    return this;
  }

  get setIdentifier(): IMainInformationBuilder {
    const id = this._getField<string>(this.bid, "tenderers[0]identifier.id");
    const scheme = this._getField<string>(this.bid, "tenderers[0]identifier.scheme");

    this._addSimpleRow(TENDER_OFFER.participant_edrpou, scheme ? `${id} (${scheme})` : id);
    return this;
  }

  get setAddress(): IMainInformationBuilder {
    this._addSimpleRow(
      TENDER_OFFER.participant_location,
      StringHandler.customerLocation(this._getField<any>(this.bid, "tenderers[0]address", {}))
    );
    return this;
  }

  get setContactPoint(): IMainInformationBuilder {
    this._addSimpleRow(
      TENDER_OFFER.participant_contact_person,
      ContactPointFormatter.format(this._getField<ContactPointType>(this.bid, "tenderers[0]contactPoint"), {
        separator: STRING.DELIMITER.NEW_LINE,
        type: CONTRACT_POINT_TYPE.NTFEU,
      })
    );
    return this;
  }

  get setScale(): IMainInformationBuilder {
    const scale = this._getField<string>(this.bid, "tenderers[0].scale", "");
    const dictionary = this.dictionaries?.get("scale") || {};
    this._addSimpleRow(TENDER_OFFER.participant_classification, this._getField(dictionary, `${scale}.title`));
    return this;
  }

  get setValue(): IMainInformationBuilder {
    if (isNumber(this.bid?.value?.amount)) {
      this._addSimpleRow(TENDER_OFFER.information_price_tender_offer, this._getPrice(this.bid?.value || {}));
    }
    return this;
  }

  get setWeightedValue(): IMainInformationBuilder {
    if (isNumber(this.bid?.weightedValue?.amount)) {
      this._addSimpleRow(
        TENDER_OFFER.information_price_tender_offer_before_start,
        this._getPrice(this.bid?.weightedValue || {})
      );
    }
    return this;
  }

  get setSubcontractingDetails(): IMainInformationBuilder {
    if (this.bid?.subcontractingDetails) {
      this._addSimpleRow(TENDER_OFFER.subcontractor, this.bid?.subcontractingDetails);
    }

    return this;
  }

  private _getPrice({ amount, valueAddedTaxIncluded, currency }: BidsValueType): string | undefined {
    if (!isNumber(amount)) {
      return amount;
    }

    return [UnitHelper.currencyFormatting(amount), currency, valueAddedTaxIncluded ? TENDER_OFFER.with_tax : null]
      .filter(item => item !== null && item !== undefined)
      .join(STRING.WHITESPACE);
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
