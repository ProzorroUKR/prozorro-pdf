import { PDF_STYLES } from "@/config/pdf/pdfStyles";
import type { SignerType } from "@/types/sign/SignerType";
import { PdfTemplateTypes } from "@/services/PDF/PdfTemplateTypes";
import { DocumentFactory } from "@/services/PDF/document/DocumentFactory";
import type { PdfDocumentConfigType } from "@/types/pdf/PdfDocumentConfigType";
import { documentStrategyMap } from "@/services/PDF/document/DocumentStrategyMap";
import type { DocumentStrategyInterface } from "@/services/PDF/document/DocumentStrategyInterface";

export class DocumentManager {
  private readonly minPageHeight = 650;
  private documentGenerator: DocumentStrategyInterface;
  private readonly documentFactory = new DocumentFactory(documentStrategyMap);

  constructor() {
    this.documentGenerator = this.documentFactory.create(PdfTemplateTypes.XML);
  }

  setDocumentType(type: string): void {
    this.documentGenerator = this.documentFactory.create(type);
  }

  async getDocumentData(
    file: any,
    config: PdfDocumentConfigType,
    signers: SignerType[],
    dictionaries?: Map<string, Record<string, any>>,
    link?: string,
    data?: Record<string, any>
  ): Promise<any> {
    const content: Record<string, any>[] = await this.documentGenerator.create(
      file,
      config,
      signers,
      dictionaries,
      data
    );
    const footer: Record<string, any>[] = this.documentGenerator.createFooter(signers, link);

    return {
      footer,
      content,
      styles: PDF_STYLES,
      pageMargins: this.documentGenerator.getPageMargins(),
      pageBreakBefore: (currentNode?: Record<string, any>) =>
        currentNode?.headlineLevel === 1 && currentNode.startPosition?.top > this.minPageHeight,
      defaultStyle: {
        font: "Tinos",
        fontSize: 12,
        alignment: "justify",
      },
    };
  }
}
