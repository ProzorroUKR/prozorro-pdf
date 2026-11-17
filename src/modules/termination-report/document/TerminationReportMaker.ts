import type { SignerType } from "@/types/sign/SignerType";
import { STRING } from "@/constants/string";
import * as PDF_HELPER_CONST from "@/constants/pdf/pdfHelperConstants";
import { ANNOUNCEMENT_PAGE_MARGIN } from "@/config/pdf/announcementConstants";
import { AbstractDocumentStrategy } from "@/services/PDF/document/AbstractDocumentStrategy";
import type { PdfDocumentConfigType } from "@/types/pdf/PdfDocumentConfigType";
import { PDFTablesHandler } from "@/services/PDF/Formatting/PDFTablesHandler";
import { TERMINATION_REPORT_TEXT } from "@/modules/termination-report/config/texts";
import { TERMINATION_REASON_TYPE_DISRUPTED } from "@/modules/termination-report/constants/terminationReport";
import { MainInformationBuilder } from "@/modules/termination-report/services/MainInformation.builder";
import { ItemsTableBuilder } from "@/modules/termination-report/services/ItemsTable.builder";
import { TerminationPrice } from "@/modules/termination-report/services/TerminationPrice";
import { DateHandler } from "@/utils/DateHandler";
import type {
  TerminationDetails,
  TerminationDictionaries,
  TerminationReportFile,
} from "@/modules/termination-report/types";

export class TerminationReportMaker extends AbstractDocumentStrategy {
  create(
    { terminationDetails, contract }: TerminationReportFile,
    _config: PdfDocumentConfigType,
    _signers: SignerType[],
    dictionaries: TerminationDictionaries
  ): Record<string, any>[] {
    const header = new MainInformationBuilder(contract, dictionaries).setTitle.setSubTitle.setReportNumber.setTenderId
      .setContractNumber.setContractDate.setContractPrice.setBuyerName.setBuyerKind.setBuyerId.setBuyerAddress
      .setSupplierName.setSupplierId.setSupplierAddress.setProcurementSubject.getResult;

    const content: Record<string, any>[] = [
      ...header,
      new ItemsTableBuilder(contract, dictionaries).build(),
      this.showWithDefault(
        DateHandler.fullDateRange(contract?.period?.startDate, contract?.period?.endDate),
        TERMINATION_REPORT_TEXT.contractDuration
      ),
      this.showWithDefault(TerminationPrice.format(terminationDetails?.amountPaid), TERMINATION_REPORT_TEXT.amountPaid),
      this._createReason(terminationDetails),
    ];

    // Drop empty optional nodes ({}) so skipped rows don't render as blank lines.
    return content.filter(node => typeof node === "string" || (node && Object.keys(node).length > 0));
  }

  getPageMargins(): number[] {
    return ANNOUNCEMENT_PAGE_MARGIN;
  }

  private _createReason(terminationDetails: TerminationDetails): Record<string, any> {
    if (terminationDetails?.reasonType !== TERMINATION_REASON_TYPE_DISRUPTED) {
      return PDF_HELPER_CONST.EMPTY_FIELD;
    }

    const reason = String(terminationDetails?.reason ?? STRING.EMPTY).replace(/\\n/g, STRING.DELIMITER.NEW_LINE);

    return PDFTablesHandler.createTableLayout([
      PDFTablesHandler.createTableRow({
        head: TERMINATION_REPORT_TEXT.terminationReason,
        data: reason || STRING.DASH,
      }),
    ]);
  }
}
