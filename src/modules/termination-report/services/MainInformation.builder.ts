import { STRING } from "@/constants/string";
import { PDF_FILED_KEYS } from "@/constants/pdf/pdfFieldKeys";
import { MARGIN_TOP_3 } from "@/config/pdf/conclusionOfMonitoringConstants";
import { PDFTablesHandler } from "@/services/PDF/Formatting/PDFTablesHandler";
import { StringHandler } from "@/utils/StringHandler";
import { DateHandler } from "@/utils/DateHandler";
import { TERMINATION_REPORT_TEXT } from "@/modules/termination-report/config/texts";
import { TerminationPrice } from "@/modules/termination-report/services/TerminationPrice";
import type {
  TerminationContract,
  TerminationDictionaries,
  TerminationParty,
} from "@/modules/termination-report/types";

export class MainInformationBuilder {
  private readonly _data: Record<string, any>[] = [];

  constructor(
    private readonly contract: TerminationContract,
    private readonly dictionaries: TerminationDictionaries
  ) {}

  get getResult(): Record<string, any>[] {
    return this._data;
  }

  get setTitle(): MainInformationBuilder {
    this._data.push({
      style: PDF_FILED_KEYS.HEADING_TITLE,
      text: TERMINATION_REPORT_TEXT.title,
    });
    return this;
  }

  get setSubTitle(): MainInformationBuilder {
    this._data.push({
      margin: MARGIN_TOP_3,
      style: PDF_FILED_KEYS.TITLE_MEDIUM,
      text: TERMINATION_REPORT_TEXT.subtitle,
    });
    return this;
  }

  get setReportNumber(): MainInformationBuilder {
    this._data.push({
      style: PDF_FILED_KEYS.TITLE_MEDIUM,
      text: (this.contract.contractID || STRING.DASH).concat(STRING.DELIMITER.DOUBLE_NEWLINE),
    });
    return this;
  }

  get setTenderId(): MainInformationBuilder {
    this._addRow(TERMINATION_REPORT_TEXT.tenderId, this.contract.tenderID);
    return this;
  }

  get setContractNumber(): MainInformationBuilder {
    this._addRow(TERMINATION_REPORT_TEXT.contractNumber, this.contract.contractID);
    return this;
  }

  get setContractDate(): MainInformationBuilder {
    const startDate = this.contract.period?.startDate;
    this._addRow(TERMINATION_REPORT_TEXT.contractDate, startDate ? DateHandler.fullDate(startDate) : STRING.EMPTY);
    return this;
  }

  get setContractPrice(): MainInformationBuilder {
    this._addRow(TERMINATION_REPORT_TEXT.contractPrice, TerminationPrice.format(this.contract.value));
    return this;
  }

  get setBuyerName(): MainInformationBuilder {
    const buyer = this.contract.buyer;
    this._addRow(TERMINATION_REPORT_TEXT.buyerName, buyer?.identifier?.legalName || buyer?.name);
    return this;
  }

  get setBuyerKind(): MainInformationBuilder {
    const dictionary = this.dictionaries.get("organisation");
    const kind = this.contract.buyer?.kind;
    this._addRow(TERMINATION_REPORT_TEXT.buyerKind, kind ? dictionary?.[kind]?.title : STRING.EMPTY);
    return this;
  }

  get setBuyerId(): MainInformationBuilder {
    this._addRow(TERMINATION_REPORT_TEXT.buyerId, this.contract.buyer?.identifier?.id);
    return this;
  }

  get setBuyerAddress(): MainInformationBuilder {
    this._addRow(TERMINATION_REPORT_TEXT.buyerAddress, StringHandler.customerLocation(this.contract.buyer?.address));
    return this;
  }

  get setSupplierName(): MainInformationBuilder {
    const supplier = this._supplier;
    this._addRow(TERMINATION_REPORT_TEXT.supplierName, supplier?.identifier?.legalName || supplier?.name);
    return this;
  }

  get setSupplierId(): MainInformationBuilder {
    const identifier = this._supplier?.identifier;
    const value = identifier?.id
      ? [identifier.id, identifier.scheme ? `(${identifier.scheme})` : ""].filter(Boolean).join(STRING.WHITESPACE)
      : STRING.EMPTY;
    this._addRow(TERMINATION_REPORT_TEXT.supplierId, value);
    return this;
  }

  get setSupplierAddress(): MainInformationBuilder {
    const supplier = this._supplier;
    const address = StringHandler.customerLocation(supplier?.address);
    const telephone = supplier?.signerInfo?.telephone;
    this._addRow(
      TERMINATION_REPORT_TEXT.supplierAddress,
      [address, telephone].filter(Boolean).join(STRING.DELIMITER.COMMA)
    );
    return this;
  }

  get setProcurementSubject(): MainInformationBuilder {
    const dictionary = this.dictionaries.get("tender_main_procurement_category");
    const category = this.contract.mainProcurementCategory;
    this._addRow(TERMINATION_REPORT_TEXT.procurementSubject, category ? dictionary?.[category]?.name : STRING.EMPTY);
    return this;
  }

  private get _supplier(): TerminationParty | undefined {
    return this.contract.suppliers?.[0];
  }

  private _addRow(title: string, value?: string | null): void {
    this._data.push(
      PDFTablesHandler.createTableLayout([
        PDFTablesHandler.createTableRow({
          head: title,
          data: [undefined, null, STRING.EMPTY].includes(value as any) ? STRING.DASH : (value as string),
        }),
      ])
    );
  }
}
