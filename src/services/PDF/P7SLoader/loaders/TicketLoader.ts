import type { LoaderStrategyInterface } from "@/services/PDF/P7SLoader/LoaderStrategyInterface";
import { AbstractLoaderStrategy } from "@/services/PDF/P7SLoader/AbstractLoaderStrategy";
import type { TenderType } from "@/types/Tender/TenderType";
import type { P7SLoadResultType } from "@/types/pdf/P7SLoadResultType";
import { ERROR_MESSAGES } from "@/widgets/ErrorExceptionCore/configs/messages";
import { Assert } from "@/widgets/ErrorExceptionCore/Assert";
import { excludeFalsy } from "@/utils/helpers";
import { REGEX } from "@/constants/regex";
import { ENCODING } from "@/constants/encoding";
import type { PdfDocumentConfigType } from "@/types/pdf/PdfDocumentConfigType";
import type { DocumentType } from "@/types/Tender/DocumentType";
import { PdfTemplateTypes } from "@/services/PDF/PdfTemplateTypes";
import { ValidationTypes } from "@/services/DataTypeValidator/ValidationTypes.ts";

export class TicketLoader extends AbstractLoaderStrategy<string> implements LoaderStrategyInterface<string> {
  public async load(object: TenderType, config: PdfDocumentConfigType): Promise<P7SLoadResultType<string>> {
    this._dataTypeValidator.validate(
      config.title,
      ValidationTypes.STRING,
      ERROR_MESSAGES.INVALID_PARAMS.undefinedTitle
    );

    const document = this.getDocument(object, config);
    const file = await this.getData(document.url);
    const { data, signers } = await this.getDataFromSign(file, ENCODING.WINDOWS_1251);

    return {
      file: data,
      url: document.url,
      title: document.title,
      signers: signers || [],
      type: this.getDocumentType(config.title),
    };
  }

  private getDocument(object: TenderType, { date, title }: PdfDocumentConfigType): DocumentType {
    Assert.isDefined(object.awards, ERROR_MESSAGES.VALIDATION_FAILED.undefinedAwards);

    const regexp = new RegExp(title);
    const documents = object.awards
      .map(award => award.documents)
      .filter(excludeFalsy)
      .flat()
      .filter((doc: DocumentType) => this.approximateCheckDateModified(doc.dateModified, date));

    const document = documents.find(doc => regexp.test(doc.title));

    Assert.isDefined(document, ERROR_MESSAGES.VALIDATION_FAILED.undefinedDocumentTitle);

    return document;
  }

  private getDocumentType(documentTitle: string): PdfTemplateTypes.XML | PdfTemplateTypes.KVT {
    const result = REGEX.FILE.TYPE.INVOICE.exec(documentTitle);

    Assert.isDefined(result, ERROR_MESSAGES.VALIDATION_FAILED.wrongDocumentType);
    Assert.isDefined(result.groups, ERROR_MESSAGES.VALIDATION_FAILED.wrongDocumentType);

    return result.groups.type as PdfTemplateTypes.XML | PdfTemplateTypes.KVT;
  }
}
