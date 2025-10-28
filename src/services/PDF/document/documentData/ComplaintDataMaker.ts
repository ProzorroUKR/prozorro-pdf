import type { SignerType } from "@prozorro/prozorro-eds";
import { AbstractDocumentStrategy } from "@/services/PDF/document/AbstractDocumentStrategy";
import { ANNOUNCEMENT_PAGE_MARGIN } from "@/config/pdf/announcementConstants";
import { PDF_FILED_KEYS } from "@/constants/pdf/pdfFieldKeys";
import { COMPLAINT_TEXTS_LISTS } from "@/config/pdf/texts/COMPLAINT";
import { ROW_WIDTH_110, ROW_WIDTH_200 } from "@/constants/pdf/pdfHelperConstants";
import { PDF_STYLES } from "@/config/pdf/pdfStyles";
import { HEADING_MARGIN } from "@/widgets/pq/configs/margins";
import { MARGIN_TOP_10 } from "@/config/pdf/conclusionOfMonitoringConstants";
import type { Argument, ComplaintType, Evidence, Objection, RequestedRemedy } from "@/types/complaints";
import type { DocumentType } from "@/types/Tender/DocumentType";
import { SIGNATURE_FILE_NAME, STRING } from "@/constants/string";
import { ArrayHandler } from "@/utils/ArrayHandler";
import { objectionClassificationScheme } from "@/config/pdf/complaintConstants";
import { StringHandler } from "@/utils/StringHandler";
import type { PdfDocumentConfigType } from "@/types/pdf/PdfDocumentConfigType";

export class ComplaintDataMaker extends AbstractDocumentStrategy {
  getPageMargins(): number[] {
    return ANNOUNCEMENT_PAGE_MARGIN;
  }

  create(
    complaint: ComplaintType,
    _config: PdfDocumentConfigType,
    _signers: SignerType[],
    dictionaries: Map<string, Record<string, any>>,
    tender?: Record<string, any>
  ): Record<string, any>[] {
    return [
      {
        style: PDF_FILED_KEYS.SPECIFICATION_HEADING,
        text: COMPLAINT_TEXTS_LISTS.organisation,
      },
      {
        style: PDF_FILED_KEYS.COMPLAINT_SUBHEADING,
        text: COMPLAINT_TEXTS_LISTS.organisation_address,
      },
      this.getAuthorTable(complaint, tender || {}),
      {
        style: PDF_FILED_KEYS.HEADING,
        text: this.getField(complaint, "title"),
        margin: HEADING_MARGIN,
      },
      this.getObjectionTable(this.getField(complaint, "objections"), dictionaries),
      this.getDocumentList(this.getField(complaint, "documents")),
    ];
  }

  getAuthorTable(complaint: ComplaintType, tender: Record<string, any>): Record<string, any> {
    return {
      table: {
        widths: [ROW_WIDTH_200, "auto"],
        body: [
          this.formatTableRow(
            COMPLAINT_TEXTS_LISTS.author_identifier,
            this.getField(complaint, "author.identifier.legalName") || this.getField(complaint, "author.name")
          ),
          this.formatTableRow(
            COMPLAINT_TEXTS_LISTS.author_scheme,
            `${this.getField(complaint, "author.identifier.id")} (${this.getField(complaint, "author.identifier.scheme")})`,
            false
          ),
          this.formatTableRow(
            COMPLAINT_TEXTS_LISTS.author_address,
            StringHandler.customerLocation(this.getField(complaint, "author.address")),
            false
          ),
          this.formatTableRow(
            COMPLAINT_TEXTS_LISTS.identifier_legalName,
            this.getField(tender, "procuringEntity.identifier.legalName")
          ),
          this.formatTableRow(
            COMPLAINT_TEXTS_LISTS.identifier_id,
            `${this.getField(tender, "procuringEntity.identifier.id")} (${this.getField(tender, "procuringEntity.identifier.scheme")})`,
            false
          ),
          this.formatTableRow(COMPLAINT_TEXTS_LISTS.tender_id, this.getField(tender, "tenderID")),
          this.formatTableRow(COMPLAINT_TEXTS_LISTS.complaint_id, this.getField(complaint, "complaintID")),
        ],
      },
      margin: MARGIN_TOP_10,
    };
  }

  getObjectionTable(objections: Objection[], dictionary: Map<string, Record<string, any>>): Record<string, any>[] {
    if (!objections.length) {
      return [];
    }
    const objectionResult: Record<string, any>[] = [];

    objections.forEach((objection, index, array) => {
      const tableBody: Record<string, any>[] = [
        this.formatTableRow(
          COMPLAINT_TEXTS_LISTS.objection_title,
          `${this.getField(objection, "sequenceNumber")} ${this.getField(objection, "title")}`
        ),
        this.formatTableRow(
          COMPLAINT_TEXTS_LISTS.objections_classification,
          this.getClassificationDescription(objection)
        ),
        [this.formatObjectionDescription(), this.formatObjection(objection)],
        [
          {
            style: PDF_STYLES.table_cell_title_complaint,
            text: COMPLAINT_TEXTS_LISTS.requested_remedies,
          },
          this.formatRequestedRemedies(this.getField(objection, "requestedRemedies"), dictionary.get("remedies_type")),
        ],
      ];

      objectionResult.push({
        table: {
          widths: [ROW_WIDTH_110, "*"],
          body: tableBody,
        },
      });

      if (!ArrayHandler.isLastIndex(index, array)) {
        objectionResult.push({
          text: STRING.WHITESPACE,
        });
      }
    });

    return objectionResult;
  }

  getDocumentList(documents?: DocumentType[]): Record<string, any>[] {
    if (!documents || !documents.length) {
      return [];
    }
    const documentListTitle: Record<string, any>[] = [
      {
        style: PDF_STYLES.table_cell_title_complaint,
        text: COMPLAINT_TEXTS_LISTS.document_list,
        margin: MARGIN_TOP_10,
      },
    ];

    return documentListTitle.concat(
      documents
        .filter(
          (document: DocumentType) => document.author === "complaint_owner" && document.title !== SIGNATURE_FILE_NAME
        )
        .map(
          ({ title }: DocumentType): Record<string, any> => ({
            style: PDF_STYLES.table_data,
            text: title,
          })
        )
    );
  }

  getClassificationDescription(objection: Objection): Record<string, any>[] {
    return [
      { text: `${this.getField(objectionClassificationScheme, this.getField(objection, "classification.scheme"))} \n` },
      { text: this.getField(objection, "classification.description") },
    ];
  }

  formatRequestedRemedies(
    requestedRemedies?: RequestedRemedy[],
    remediesDictionary?: Record<string, any>
  ): Record<string, any>[] {
    if (!requestedRemedies || !requestedRemedies.length) {
      return [];
    }

    return requestedRemedies
      .map((remedy, index, array) => [
        {
          style: PDF_STYLES.table_data,
          text: this.getField(remediesDictionary || {}, `${this.getField(remedy, "type")}.title`),
        },
        {
          style: PDF_STYLES.table_data,
          text: this.getField(remedy, "description"),
        },
        { text: ArrayHandler.isLastIndex(index, array) ? STRING.EMPTY : STRING.WHITESPACE },
      ])
      .flat();
  }

  formatObjection(objection?: Objection): Record<string, any>[] {
    if (!objection) {
      return [];
    }

    const descriptionList: Record<string, any>[] = [
      {
        style: PDF_STYLES.table_data,
        text: this.getField(objection, "description"),
      },
      { text: STRING.WHITESPACE },
    ];
    const argumentList: Argument[] = this.getField(objection, "arguments");

    argumentList.forEach(({ description = STRING.EMPTY, evidences = [] }: Argument, index, array) => {
      descriptionList.push({
        style: PDF_STYLES.table_data,
        text: description,
      });

      evidences.forEach(({ title = STRING.EMPTY }: Evidence) =>
        descriptionList.push({
          style: PDF_STYLES.table_data,
          text: title,
        })
      );

      if (!ArrayHandler.isLastIndex(index, array)) {
        descriptionList.push({ text: STRING.WHITESPACE });
      }
    });

    return descriptionList;
  }

  formatObjectionDescription(): Record<string, any>[] {
    return [
      {
        style: PDF_STYLES.table_cell_title_complaint,
        text: COMPLAINT_TEXTS_LISTS.objection_description,
      },
      {
        table: {
          widths: [1, "auto"],
          body: [
            [
              STRING.DISC,
              {
                style: PDF_STYLES.table_cell_title_complaint,
                text: COMPLAINT_TEXTS_LISTS.objection_argument,
              },
            ],
            [
              STRING.DISC,
              {
                style: PDF_STYLES.table_cell_title_complaint,
                text: COMPLAINT_TEXTS_LISTS.objection_evidence,
              },
            ],
          ],
        },
        layout: {
          paddingLeft: () => 0,
          hLineWidth: () => 0,
          vLineWidth: () => 0,
        },
      },
    ];
  }

  formatTableRow(left: string, right: string | Record<string, any>, leftBold = true): Record<string, any>[] {
    return [
      {
        style: leftBold ? PDF_STYLES.table_cell_title_complaint : PDF_STYLES.table_data,
        text: left,
      },
      {
        style: PDF_STYLES.table_data,
        text: right,
      },
    ];
  }
}
