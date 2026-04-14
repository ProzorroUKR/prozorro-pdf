import { STRING } from "@/constants/string";
import { DateHandler } from "@/utils/DateHandler";
import { EDR_2_TEXTS_LIST } from "@/config/pdf/texts/EDR_2_TEXTS_LIST";
import type { SignerType } from "@/types/sign/SignerType";
import { Assert } from "@/widgets/ErrorExceptionCore/Assert";
import { PDF_FILED_KEYS } from "@/constants/pdf/pdfFieldKeys";
import { ERROR_MESSAGES } from "@/widgets/ErrorExceptionCore/configs/messages";
import { ErrorExceptionCore } from "@/widgets/ErrorExceptionCore/ErrorExceptionCore";
import { AbstractDocumentStrategy } from "@/services/PDF/document/AbstractDocumentStrategy";
import {
  LINE_HEIGHT_20,
  LINE_LENGTH,
  ROW_WIDTH_110,
  ROW_WIDTH_180,
  ROW_WIDTH_200,
  ROW_WIDTH_30,
  ROW_WIDTH_95,
  ROW_WIDTH_75,
  ROW_WIDTH_70,
} from "@/constants/pdf/pdfHelperConstants";
import {
  ANNOUNCEMENT_PAGE_MARGIN,
  FOOTER_COLUMN_MARGIN,
  FOOTER_MARGIN,
  FOOTER_QR_MARGIN,
} from "@/config/pdf/announcementConstants";
import { ANNOUNCEMENT_TEXTS_LIST } from "@/config/pdf/texts/ANNOUNCEMENT";
import type {
  Edr2ActivityKindType,
  Edr2BeneficiariesGeneralInfoType,
  Edr2BeneficiaryType,
  Edr2DataType,
  Edr2FounderType,
  Edr2HeadType,
  Edr2TerminationType,
  Edr2Type,
} from "@/types/Edr/Edr2Type";
import { PROZORRO_PDF_ERROR_CODES } from "@/widgets/ErrorExceptionCore/constants/ERROR_CODES.enum";
import { ContactPointFormatter, CONTRACT_POINT_TYPE } from "@/utils/ObjectToString/ContactPointFormatter.ts";
import { PDFTablesHandler } from "@/services/PDF/Formatting/PDFTablesHandler.ts";
import { isObject } from "lodash";

export class Edr2DataMaker extends AbstractDocumentStrategy {
  private _metaSourceDate = "";
  private readonly _blockMargin = [0, 18, 0, 0];
  private readonly _tableTopMargin = [0, 4, 0, 0];

  create({ data, error, meta }: Edr2Type): Record<string, any>[] {
    if (error || !data) {
      throw new ErrorExceptionCore({
        code: PROZORRO_PDF_ERROR_CODES.VALIDATION_FAILED,
        message: ERROR_MESSAGES.VALIDATION_FAILED.wrongEdrFile,
      });
    }

    console.log(data);

    this._metaSourceDate = meta.sourceDate || STRING.EMPTY;

    return [
      {
        style: PDF_FILED_KEYS.HEADING_TITLE,
        text: EDR_2_TEXTS_LIST.title,
      },
      {
        style: PDF_FILED_KEYS.SECOND_HEADING_TITLE,
        text: EDR_2_TEXTS_LIST.subtitle,
      },
      this._createMainInformationTable(data),
      data?.founders?.length ? this._createFoundersTable(data.founders) : STRING.EMPTY,
      ...(data?.beneficiaries?.length || isObject(data?.beneficiaries_general_info)
        ? this._createBeneficiariesTables(data.beneficiaries, data?.beneficiaries_general_info)
        : []),
      data?.heads?.length ? this._createHeadsTable(data.heads) : STRING.EMPTY,
      isObject(data.termination) ? this._createTerminationTable(data.termination) : STRING.EMPTY,
      data?.activity_kinds?.length ? this._createActivitiesTable(data.activity_kinds) : STRING.EMPTY,
      {
        margin: this._blockMargin,
        text: EDR_2_TEXTS_LIST.registry_info_text,
      },
    ].filter(Boolean) as Record<string, any>[];
  }

  createFooter(_?: SignerType[], link?: string): (currentPage: number) => Record<string, any>[] {
    Assert.isDefined(link, ERROR_MESSAGES.INVALID_PARAMS.undefinedUrl, PROZORRO_PDF_ERROR_CODES.INVALID_PARAMS);

    return (currentPage: number) => [
      { canvas: [{ type: "line", x1: 0, y1: 0, x2: LINE_LENGTH, y2: 0, lineWidth: 1 }] },
      {
        margin: FOOTER_MARGIN,
        columns: [
          {
            width: 250,
            margin: FOOTER_COLUMN_MARGIN,
            fontSize: 10,
            stack: [
              {
                text: `${EDR_2_TEXTS_LIST.current_on} ${
                  this._metaSourceDate ? DateHandler.formatISODate(this._metaSourceDate) : STRING.DASH
                }`,
              },
              {
                text: `${EDR_2_TEXTS_LIST.page} ${currentPage}`,
              },
            ],
          },
          {
            width: 190,
            margin: FOOTER_COLUMN_MARGIN,
            fontSize: 10,
            alignment: "right",
            text: ANNOUNCEMENT_TEXTS_LIST.original_doc,
          },
          {
            margin: FOOTER_QR_MARGIN,
            qr: link,
            version: 9,
            fit: 100,
          },
        ],
      },
    ];
  }

  getPageMargins(): number[] {
    return ANNOUNCEMENT_PAGE_MARGIN;
  }

  private _createMainInformationTable(data: Edr2DataType): Record<string, any> {
    const contactPoint = ContactPointFormatter.format(data?.contacts || {}, {
      separator: "; ",
      type: CONTRACT_POINT_TYPE.ETFWA,
    });

    const body = [
      this._createRow(EDR_2_TEXTS_LIST.company_name, data.names?.name),
      this._createRow(EDR_2_TEXTS_LIST.company_short_name, data.names?.short),
      this._createRow(EDR_2_TEXTS_LIST.company_name_en, data.names?.name_en),
      this._createRow(EDR_2_TEXTS_LIST.company_short_name_en, data.names?.short_en),
      this._createRow(EDR_2_TEXTS_LIST.company_olf_name, data.olf_name),
      this._createRow(EDR_2_TEXTS_LIST.company_code, data.code),
      this._createRow(EDR_2_TEXTS_LIST.company_status, data.state_text),
      this._createRow(EDR_2_TEXTS_LIST.management, data.management),
      this._createRow(EDR_2_TEXTS_LIST.subject_type, this._formatSubjectType(data.subject_type)),
      this._createRow(EDR_2_TEXTS_LIST.registration_date, this._formatDate(data.registration?.date)),
      this._createRow(EDR_2_TEXTS_LIST.address, data?.address?.address),
      this._createRow(EDR_2_TEXTS_LIST.contacts, contactPoint),
    ];

    return this._wrapTableBlock(
      this._createResolvedTable(body, [ROW_WIDTH_200, "*"], 0),
      EDR_2_TEXTS_LIST.main_information_title
    );
  }

  private _createFoundersTable(founders: Edr2FounderType[]): Record<string, any> | undefined {
    const body = [
      [
        this._createHeaderCell(EDR_2_TEXTS_LIST.founders_name),
        this._createHeaderCell(EDR_2_TEXTS_LIST.founders_code),
        this._createHeaderCell(EDR_2_TEXTS_LIST.founders_capital),
        this._createHeaderCell(EDR_2_TEXTS_LIST.founders_address),
      ],
      ...founders.map(founder => [
        this._createDataCell(founder.name),
        this._createDataCell(founder.code),
        this._createDataCell(founder?.capital?.toString()),
        this._createDataCell(founder?.address?.address),
      ]),
    ];

    return this._wrapTableBlock(
      this._createResolvedTable(body, [ROW_WIDTH_180, ROW_WIDTH_110, ROW_WIDTH_70, "*"], 1),
      EDR_2_TEXTS_LIST.founders_title
    );
  }

  private _createHeadsTable(heads: Edr2HeadType[]): Record<string, any> | undefined {
    const body = [
      [
        this._createHeaderCell(EDR_2_TEXTS_LIST.heads_number),
        this._createHeaderCell(EDR_2_TEXTS_LIST.heads_full_name),
        this._createHeaderCell(EDR_2_TEXTS_LIST.heads_role),
        this._createHeaderCell(EDR_2_TEXTS_LIST.heads_appointment_date),
        this._createHeaderCell(EDR_2_TEXTS_LIST.heads_restriction),
      ],
      ...heads.map((head, index) => [
        this._createDataCell(String(index + 1), STRING.EMPTY),
        this._createDataCell(this._formatFullName(head)),
        this._createDataCell(head.role_text, STRING.EMPTY),
        this._createDataCell(head.appointment_date ? DateHandler.fullDate(head.appointment_date) : undefined),
        this._createDataCell(head.restriction),
      ]),
    ];

    return this._wrapTableBlock(
      this._createResolvedTable(body, [ROW_WIDTH_30, ROW_WIDTH_180, ROW_WIDTH_95, ROW_WIDTH_75, "*"], 1),
      EDR_2_TEXTS_LIST.heads_title
    );
  }

  private _createBeneficiariesTables(
    beneficiaries: Edr2BeneficiaryType[] = [],
    generalInfo?: Edr2BeneficiariesGeneralInfoType
  ): Record<string, any>[] {
    const beneficiariesTables = (beneficiaries || []).map((item, i) => this._createBeneficiaryTable(item, i));
    const generalInfoTable = [
      this._createRow(EDR_2_TEXTS_LIST.beneficiary_excluded, this._formatBoolean(generalInfo?.excluded)),
      this._createRow(EDR_2_TEXTS_LIST.beneficiary_missing, this._formatBoolean(generalInfo?.is_missing)),
      this._createRow(EDR_2_TEXTS_LIST.beneficiary_missing_reason, generalInfo?.reason),
    ];

    if (generalInfo) {
      return [
        this._wrapTableBlock(
          this._createResolvedTable(generalInfoTable, [ROW_WIDTH_200, "*"], 0),
          {
            text: EDR_2_TEXTS_LIST.beneficiary_title,
            style: PDF_FILED_KEYS.TITLE_LARGE,
          },
          [0, 6, 0, 0]
        ),
        ...beneficiariesTables,
      ];
    }

    if (beneficiariesTables.length) {
      const [firstBeneficiaryTable, ...restBeneficiariesTables] = beneficiariesTables;

      return [
        this._wrapTableBlock(
          firstBeneficiaryTable,
          {
            stack: [
              {
                text: EDR_2_TEXTS_LIST.beneficiary_title,
                style: PDF_FILED_KEYS.TITLE_LARGE,
              },
              {
                text: "Бенефіціар №1",
                style: PDF_FILED_KEYS.TABLE_HEAD,
              },
            ],
          },
          this._blockMargin,
          true
        ),
        ...restBeneficiariesTables,
      ];
    }

    return [];
  }

  private _createBeneficiaryTable(beneficiary: Edr2BeneficiaryType, index: number): Record<string, any> {
    const type = beneficiary?.beneficiaries_type?.toString() || STRING.EMPTY;
    const body = [
      this._createRow(EDR_2_TEXTS_LIST.beneficiary_full_name, this._formatFullName(beneficiary)),
      this._createRow(EDR_2_TEXTS_LIST.beneficiary_country, beneficiary?.country),
      this._createRow(EDR_2_TEXTS_LIST.beneficiary_address, beneficiary?.address?.address),
      this._createRow(EDR_2_TEXTS_LIST.beneficiary_indirect_name, beneficiary?.name),
      this._createRow(EDR_2_TEXTS_LIST.beneficiary_code, beneficiary?.code),
      this._createRow(
        EDR_2_TEXTS_LIST.beneficiary_type,
        (EDR_2_TEXTS_LIST.beneficiaryTypeDictionary as Record<string, string>)[type] || type
      ),
      this._createRow(EDR_2_TEXTS_LIST.beneficiary_role, beneficiary?.role_text),
      this._createRow(EDR_2_TEXTS_LIST.beneficiary_interest, beneficiary?.interest?.toString()),
      this._createRow(EDR_2_TEXTS_LIST.beneficiary_indirect_interest, beneficiary?.indirect_interest?.toString()),
      this._createRow(EDR_2_TEXTS_LIST.beneficiary_other_impact, beneficiary?.other_impact),
      this._createRow(EDR_2_TEXTS_LIST.beneficiary_false, this._formatBoolean(beneficiary.beneficiary_false)),
    ];

    return this._wrapTableBlock(this._createResolvedTable(body, [ROW_WIDTH_200, "*"], 0), {
      text: `Бенефіціар №${index + 1}`,
      style: PDF_FILED_KEYS.TABLE_HEAD,
    });
  }

  private _createTerminationTable(termination?: Edr2TerminationType): Record<string, any> | undefined {
    const body = [
      this._createRow(EDR_2_TEXTS_LIST.termination_record_number, termination?.record_number),
      this._createRow(EDR_2_TEXTS_LIST.termination_cause_for_record, termination?.cause),
      this._createRow(EDR_2_TEXTS_LIST.termination_date, this._formatDate(termination?.date)),
      this._createRow(EDR_2_TEXTS_LIST.termination_state_text, termination?.state_text),
      this._createRow(EDR_2_TEXTS_LIST.termination_record_number_if_terminated, termination?.record_number),
      this._createRow(
        EDR_2_TEXTS_LIST.termination_requirement_end_date,
        this._formatDate(termination?.requirement_end_date)
      ),
      this._createRow(EDR_2_TEXTS_LIST.termination_cause, termination?.cause),
    ];

    return this._wrapTableBlock(
      this._createResolvedTable(body, [ROW_WIDTH_200, "*"], 0),
      EDR_2_TEXTS_LIST.termination_title
    );
  }

  private _createActivitiesTable(activities: Edr2ActivityKindType[]): Record<string, any> | undefined {
    const mainActivities = (activities || []).filter(item => item.is_primary);
    const additionalActivities = (activities || []).filter(item => !item.is_primary);

    const body = [
      this._createRow(EDR_2_TEXTS_LIST.activities_primary, this._formatActivities(mainActivities)),
      this._createRow(EDR_2_TEXTS_LIST.activities_additional, this._formatActivities(additionalActivities)),
    ];

    return this._wrapTableBlock(
      this._createResolvedTable(body, [ROW_WIDTH_200, "*"], 0),
      EDR_2_TEXTS_LIST.activities_title
    );
  }

  private _createResolvedTable(body: Record<string, any>[][], widths: Array<number | string>, headerRows = 0) {
    return {
      ...PDFTablesHandler.createTable(body, widths, undefined, LINE_HEIGHT_20, headerRows, true),
      margin: this._tableTopMargin,
    };
  }

  private _wrapTableBlock(
    table: Record<string, any>,
    title?: string | Record<string, any>,
    margin: number[] = this._blockMargin,
    isResolvedTable = false
  ): Record<string, any> {
    const titleNode = typeof title === "string" ? { text: title, style: PDF_FILED_KEYS.TITLE_LARGE } : title;
    const wrappedTable = isResolvedTable
      ? table
      : PDFTablesHandler.resolveTableBug(table, titleNode || { text: undefined, style: PDF_FILED_KEYS.TITLE_LARGE });

    return {
      ...wrappedTable,
      margin,
    };
  }

  private _createRow(head: string, value?: string, defaultValue: string = STRING.DASH): Record<string, any>[] {
    return PDFTablesHandler.createTableRow({ head, data: value || defaultValue, hasMargin: false });
  }

  private _createHeaderCell(text: string): Record<string, any> {
    return { text, style: PDF_FILED_KEYS.TABLE_HEAD };
  }

  private _createDataCell(text?: string, defaultValue: string = STRING.DASH): Record<string, any> {
    return { text: text || defaultValue, style: PDF_FILED_KEYS.TABLE_DATA };
  }

  private _formatSubjectType(subjectType?: string): string {
    return (EDR_2_TEXTS_LIST.subjectType as Record<any, any>)[subjectType as any] || subjectType || STRING.DASH;
  }

  private _formatFullName({
    last_name,
    first_middle_name,
  }: Pick<Edr2HeadType, "last_name" | "first_middle_name"> = {}): string {
    return [last_name, first_middle_name].filter(Boolean).join(STRING.WHITESPACE);
  }

  private _formatActivity({ code, name }: Edr2ActivityKindType = { code: "", name: "", is_primary: false }): string {
    return [code, name].filter(Boolean).join(STRING.WHITESPACE);
  }

  private _formatActivities(activities: Edr2ActivityKindType[] = []): string {
    return (
      activities
        .map(activity => this._formatActivity(activity))
        .filter(value => value !== STRING.DASH)
        .join(STRING.DELIMITER.NEW_LINE) || STRING.DASH
    );
  }

  private _formatDate(date?: string): string {
    return date ? DateHandler.fullDate(date) : STRING.DASH;
  }

  private _formatBoolean(value?: boolean): string {
    if (value === undefined) {
      return STRING.DASH;
    }

    return value ? EDR_2_TEXTS_LIST.yes : EDR_2_TEXTS_LIST.no;
  }
}
