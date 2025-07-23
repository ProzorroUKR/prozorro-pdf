import type { XMLParserInterface } from "@/services/Dom/XMLParserInterface";
import { DocumentFactory } from "@/services/PDF/document/DocumentFactory";
import { documentStrategyMap } from "@/services/PDF/document/DocumentStrategyMap";
import { PdfTemplateTypes } from "@/services/PDF/PdfTemplateTypes.ts";
import { PDF_STYLES } from "@/config/pdf/pdfStyles";
import type { SignerType } from "@/types/sign/SignerType";

export interface DocumentManagerInterface {
  setDocumentType(type: string): void;
  getDocumentData(file: string, signers: SignerType[]): Record<string, any>;
}

export class DocumentManager implements DocumentManagerInterface {
  private readonly documentFactory;
  private documentGenerator;
  private readonly minPageHeight = 650;

  constructor(private readonly xmlParser: XMLParserInterface) {
    this.documentFactory = new DocumentFactory(documentStrategyMap, this.xmlParser);
    this.documentGenerator = this.documentFactory.create(PdfTemplateTypes.XML);
  }

  setDocumentType(type: string): void {
    this.documentGenerator = this.documentFactory.create(type);
  }

  getDocumentData(
    file: string,
    signers: SignerType[],
    dictionaries?: Map<string, Record<string, any>>,
    link?: string,
    tender?: Record<string, any>
  ): Record<string, any> {
    const content: Record<string, any>[] = this.documentGenerator.create(file, signers, dictionaries, tender);
    const footer: Record<string, any>[] = this.documentGenerator.createFooter(signers, link);

    return {
      pageMargins: this.documentGenerator.getPageMargins(),
      content,
      pageBreakBefore: (currentNode?: Record<string, any>) =>
        currentNode?.headlineLevel === 1 && currentNode.startPosition?.top > this.minPageHeight,
      footer,
      defaultStyle: {
        font: "Times",
        fontSize: 12,
        alignment: "justify",
      },
      styles: PDF_STYLES,
    };
  }
}
