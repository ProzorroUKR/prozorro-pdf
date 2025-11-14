import { STRING } from "@/constants/string";
import { DATE_FORMAT } from "@/constants/date";
import { MARGIN_TOP_3 } from "@/config/pdf/tenderOffer";
import type { SignerType } from "@/types/sign/SignerType";
import type { AwardType } from "@/types/Tender/AwardType";
import { PDF_FILED_KEYS } from "@/constants/pdf/pdfFieldKeys";
import type { TenderOfferType } from "@/types/TenderOffer/Tender";
import type { Milestone } from "@/types/Announcement/AnnouncementTypes";
import { ANNOUNCEMENT_PAGE_MARGIN } from "@/config/pdf/announcementConstants";
import type { PdfDocumentConfigType } from "@/types/pdf/PdfDocumentConfigType";
import { DEVIATION_REPORT_TEXT } from "@/config/pdf/texts/DEVIATION_REPORT_TEXT";
import { AbstractDocumentStrategy } from "@/services/PDF/document/AbstractDocumentStrategy";
import type { QualificationsType } from "@/types/ProtocolConsiderationTenderOffers/Qualifications";
import { LINE_HEIGHT_20, ROW_ALL_WIDTH, ROW_WIDTH_250 } from "@/constants/pdf/pdfHelperConstants";
import { MainInformationBuilder } from "@/widgets/DeviationReport/services/MainInformation.builder";
import { PDFTablesHandler } from "@/services/PDF/Formatting/PDFTablesHandler.ts";

export class DeviationReportMaker extends AbstractDocumentStrategy {
  create(
    { tender, data }: { tender: TenderOfferType; data: AwardType | QualificationsType },
    _config: PdfDocumentConfigType,
    _signers: SignerType[],
    dictionaries: Map<string, Record<string, any>>
  ): Record<string, any>[] {
    return [
      ...new MainInformationBuilder(tender, data, dictionaries).setTitle.setSubTitle.setTenderId.setName.setKind
        .setIdentifier.setAddress.setProcMethodType.setTenderTitle.setLotTitle.setSupplierName.getResult,
      this._createMilestone(data.milestones || []),
      PDFTablesHandler.createTableLayout([
        PDFTablesHandler.createTableRow({
          head: DEVIATION_REPORT_TEXT.resolve,
          data: DEVIATION_REPORT_TEXT.resolveText,
        }),
      ]),
    ];
  }

  getPageMargins(): number[] {
    return ANNOUNCEMENT_PAGE_MARGIN;
  }

  private _createMilestone(milestones: Milestone[]): Record<string, any> {
    const [milestone] = milestones.filter(el => el.code === "24h");
    const dateString = new Date(milestone?.dueDate || STRING.EMPTY)
      .toLocaleString("uk-UA", DATE_FORMAT)
      .replace(",", "");

    const body = [
      PDFTablesHandler.createTableRow({
        head: DEVIATION_REPORT_TEXT.milestoneDueDate,
        data: milestone?.dueDate ? dateString : STRING.EXTRA_LONG_DASH,
      }),
      PDFTablesHandler.createTableRow({
        head: DEVIATION_REPORT_TEXT.milestonesDescription,
        data: milestone?.description || STRING.EXTRA_LONG_DASH,
      }),
    ];

    return this.resolveTableBug(
      {
        table: {
          headerRows: 0,
          heights: LINE_HEIGHT_20,
          dontBreakRows: false,
          widths: [ROW_WIDTH_250, ROW_ALL_WIDTH],
          body: body,
        },
        margin: MARGIN_TOP_3,
      },
      {
        style: PDF_FILED_KEYS.TITLE_MEDIUM_BOLD,
        text: DEVIATION_REPORT_TEXT.milestoneTitle,
      }
    );
  }
}
