import { AbstractDocumentStrategy } from "@/services/PDF/document/AbstractDocumentStrategy";
import { ANNOUNCEMENT_PAGE_MARGIN } from "@/config/pdf/announcementConstants";
import { POST_HEADING } from "@/widgets/ComplaintPost/config/COMPLAINT_POST";
import { PDF_FILED_KEYS } from "@/constants/pdf/pdfFieldKeys";
import { ComplaintPostHeaderBuilder } from "@/widgets/ComplaintPost/services/ComplaintPostHeader.builder";
import { ComplaintPostPostBuilder } from "@/widgets/ComplaintPost/services/ComplaintPostPost.builder";
import type { PdfDocumentConfigType } from "@/types/pdf/PdfDocumentConfigType";
import type { SignerType } from "@/types/sign/SignerType";
import { STRING } from "@/constants/string";

export class ComplaintPostDataMaker extends AbstractDocumentStrategy {
  getPageMargins(): number[] {
    return ANNOUNCEMENT_PAGE_MARGIN;
  }

  createFooter(): Record<string, any>[] {
    return [{ text: STRING.EMPTY }];
  }

  create(
    complaint: Record<string, any>,
    _config: PdfDocumentConfigType,
    _signers: SignerType[],
    _dictionaries: Map<string, Record<string, any>>,
    tender: Record<string, any>
  ): Record<string, any>[] | Promise<Record<string, any>[]> {
    return [
      {
        text: POST_HEADING.requisites,
        style: PDF_FILED_KEYS.COMPLAINT_POST_HEADING,
      },
      {
        text: POST_HEADING.address,
        style: PDF_FILED_KEYS.COMPLAINT_SUBHEADING,
      },
      this.postHeader(complaint, tender),
      ...this.postTables(complaint),
    ];
  }

  postHeader(complaint: Record<string, any>, tender: Record<string, any>): Record<string, any> {
    const builder = new ComplaintPostHeaderBuilder(tender, complaint);

    return builder.setName.setEdrpou.setAddress.setProcurringName.setProccurringEdrpou.setTenderId.setComplaintId
      .getResult;
  }

  postTables(complaint: Record<string, any>): Record<string, any>[] {
    const builder = new ComplaintPostPostBuilder(complaint);

    return builder.setSequenceNumber.setAuthor.setRecipient.setDatePublished.setTitle.setDescription.getResult;
  }
}
