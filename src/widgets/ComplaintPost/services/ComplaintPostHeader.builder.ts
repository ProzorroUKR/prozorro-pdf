import { POST_HEADING } from "../config/COMPLAINT_POST";
import { StringHandler } from "@/utils/StringHandler";
import { DocumentExtractionService } from "@/services/PDF/document/DocumentExtractionService";
import { PDFTablesHandler } from "@/services/PDF/Formatting/PDFTablesHandler";
import type { TableRow } from "@/types/pdfFormatting/tableFormatting";
import { STRING } from "@/constants/string";
import type { AddressType } from "@/types/Tender/AddressType";
import * as PDF_HELPER_CONST from "@/constants/pdf/pdfHelperConstants";
import { PDF_FILED_KEYS } from "@/constants/pdf/pdfFieldKeys";

interface IComplaintPostHeader {
  getResult: Record<string, any>;
  setName: IComplaintPostHeader;
  setEdrpou: IComplaintPostHeader;
  setAddress: IComplaintPostHeader;
  setProcurringName: IComplaintPostHeader;
  setProccurringEdrpou: IComplaintPostHeader;
  setTenderId: IComplaintPostHeader;
  setComplaintId: IComplaintPostHeader;
}

export class ComplaintPostHeaderBuilder implements IComplaintPostHeader {
  private readonly _tenderId: any;
  private readonly _complaint: Record<string, any>;
  private readonly _procuringEntity: Record<string, any> = {};
  private readonly _data: TableRow[] = [];

  constructor(tender: Record<string, any>, complaint: Record<string, any>) {
    this._tenderId = tender.tenderID;
    this._complaint = complaint;
    this._procuringEntity = tender.procuringEntity;
  }

  get setName(): IComplaintPostHeader {
    this._data.push({
      head: POST_HEADING.complaintName,
      data: DocumentExtractionService.getField(
        this._complaint,
        "author.identifier.legalName",
        DocumentExtractionService.getField(this._complaint, "author.name", STRING.DASH)
      ),
      headStyle: PDF_FILED_KEYS.TABLE_DATA_BOLD,
    });
    return this;
  }

  get setEdrpou(): IComplaintPostHeader {
    const id = DocumentExtractionService.getField(this._complaint, "author.identifier.id", STRING.EMPTY);
    const scheme = DocumentExtractionService.getField(this._complaint, "author.identifier.scheme", STRING.EMPTY);
    const formattedScheme = scheme ? `(${scheme})` : STRING.EMPTY;
    const edrpou = id || scheme ? `${id} ${formattedScheme}` : STRING.DASH;
    this._data.push({
      head: POST_HEADING.edrpou,
      data: edrpou,
      headStyle: PDF_FILED_KEYS.TABLE_DATA,
    });
    return this;
  }

  get setAddress(): IComplaintPostHeader {
    const address = DocumentExtractionService.getField(this._complaint, "author.address", {} as AddressType);
    this._data.push({
      head: POST_HEADING.location,
      data: StringHandler.customerLocation(address, STRING.DASH),
      headStyle: PDF_FILED_KEYS.TABLE_DATA,
    });
    return this;
  }

  get setProcurringName(): IComplaintPostHeader {
    this._data.push({
      head: POST_HEADING.legalName,
      data: DocumentExtractionService.getField(
        this._procuringEntity,
        "identifier.legalName",
        DocumentExtractionService.getField(this._procuringEntity, "name", "—")
      ),
      headStyle: PDF_FILED_KEYS.TABLE_DATA_BOLD,
    });
    return this;
  }

  get setProccurringEdrpou(): IComplaintPostHeader {
    const id = DocumentExtractionService.getField(this._procuringEntity, "identifier.id", STRING.EMPTY);
    const scheme = DocumentExtractionService.getField(this._procuringEntity, "identifier.scheme", STRING.EMPTY);
    const formattedScheme = scheme ? `(${scheme})` : STRING.EMPTY;
    const edrpou = id || scheme ? `${id} ${formattedScheme}` : STRING.DASH;

    this._data.push({
      head: POST_HEADING.edrpouProcuring,
      data: edrpou,
      headStyle: PDF_FILED_KEYS.TABLE_DATA,
    });
    return this;
  }

  get setTenderId(): IComplaintPostHeader {
    this._data.push({
      head: POST_HEADING.tenderId,
      data: this._tenderId,
      headStyle: PDF_FILED_KEYS.TABLE_DATA_BOLD,
    });
    return this;
  }

  get setComplaintId(): IComplaintPostHeader {
    this._data.push({
      head: POST_HEADING.complaintId,
      data: DocumentExtractionService.getField(this._complaint, "complaintID", "—"),
      headStyle: PDF_FILED_KEYS.TABLE_DATA_BOLD,
    });
    return this;
  }

  get getResult(): Record<string, any> {
    return PDFTablesHandler.resolveTableBug(
      PDFTablesHandler.createTable(
        this._data.map(item =>
          PDFTablesHandler.createTableRow({
            head: item.head,
            data: item.data,
            headStyle: item.headStyle ?? undefined,
          })
        ),
        [PDF_HELPER_CONST.ROW_WIDTH_198, PDF_HELPER_CONST.ROW_WIDTH_300],
        "",
        PDF_HELPER_CONST.LINE_HEIGHT_15
      ),
      {}
    );
  }
}
