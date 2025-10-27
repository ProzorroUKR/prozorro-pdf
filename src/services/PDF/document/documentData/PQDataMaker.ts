import * as PDF_HELPER_CONST from "@/constants/pdf/pdfHelperConstants";
import { AbstractDocumentStrategy } from "@/services/PDF/document/AbstractDocumentStrategy";
import type { SignerType } from "types/sign/SignerType";
import { DEFAULT_PAGE_MARGIN } from "@/config/pdf/announcementConstants";
import type { PQContractType, PQDataComplexType } from "@/widgets/pq/types/PQTypes";
import { STRING } from "@/constants/string";
import { PROZORRO_TEMPLATE_CODES } from "@/widgets/pq/types/TemplateCodes.enum";
import type { TenderOfferType } from "@/types/TenderOffer/Tender";
import { TEMPLATE_TO_BUILDER } from "@/widgets/pq/configs/TemplateToBuilder.map";
import { TemplateCodeChecker } from "@/widgets/pq/utils/TemplateCodeChecker";
import type { PdfDocumentConfigType } from "@/types/pdf/PdfDocumentConfigType";

export class PQDataMaker extends AbstractDocumentStrategy {
  private _tender: TenderOfferType | Record<string, any> = {};

  create(
    contract: PQDataComplexType | Record<string, any>,
    config: PdfDocumentConfigType,
    _signers?: SignerType[],
    _dictionaries?: Map<string, Record<string, any>>
  ): Record<string, any>[] {
    this._tender = contract?.tender || {};
    const contractObject: PQContractType | Record<string, never> = contract?.contract || {
      contractTemplateName: STRING.EMPTY,
    };
    const contractTemplate: PROZORRO_TEMPLATE_CODES = TemplateCodeChecker.validatedTemplateName(
      this._formatContractTemplate(contractObject.contractTemplateName || config.contractTemplateName)
    );

    if (TEMPLATE_TO_BUILDER.get(contractTemplate)) {
      return TEMPLATE_TO_BUILDER.get(contractTemplate)?.build(contractObject, contractTemplate, this._tender) || [];
    }

    return [];
  }

  createFooter(): Record<string, any>[] {
    return [PDF_HELPER_CONST.EMPTY_FIELD];
  }

  getPageMargins(): number[] {
    return DEFAULT_PAGE_MARGIN;
  }

  /**
   * Тимчасовий функціонал, потрібен для міграції кодів в словниках.
   * Після оновлення потрібно буде видалити один з варіантів.
   * https://prozorro-ua.atlassian.net/browse/CS-18966
   */
  private _formatContractTemplate(contractTemplate: string): string {
    return contractTemplate.replace(/-\d\./, ".");
  }
}
