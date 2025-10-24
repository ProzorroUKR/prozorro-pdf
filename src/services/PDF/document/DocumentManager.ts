import { PDF_STYLES } from "@/config/pdf/pdfStyles";
import type { SignerType } from "@/types/sign/SignerType";
import type { EnvironmentType } from "@/types/pdf/EnvironmentType";
import { PdfTemplateTypes } from "@/services/PDF/PdfTemplateTypes";
import { DocumentFactory } from "@/services/PDF/document/DocumentFactory";
import type { PdfDocumentConfigType } from "@/types/pdf/PdfDocumentConfigType";
import { documentStrategyMap } from "@/services/PDF/document/DocumentStrategyMap";
import type { DocumentStrategyInterface } from "@/services/PDF/document/DocumentStrategyInterface";
import { complaintPostCustomFooter } from "@/widgets/ComplaintPost/services/ComplaintPostCustomFooter.ts";

export class DocumentManager {
  private documentType = "";
  private readonly minPageHeight = 650;
  private documentGenerator: DocumentStrategyInterface;
  private readonly documentFactory;

  constructor(envVars: EnvironmentType) {
    this.documentFactory = new DocumentFactory(documentStrategyMap, envVars);
    this.documentGenerator = this.documentFactory.create(PdfTemplateTypes.XML);
  }

  setDocumentType(type: string): void {
    this.documentGenerator = this.documentFactory.create(type);
    this.documentType = type;
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
    const footer: Record<string, any>[] | ((currentPage: number) => Record<string, any>) =
      this.documentType === PdfTemplateTypes.COMPLAINT_POST
        ? complaintPostCustomFooter
        : this.documentGenerator.createFooter(signers, link); // TODO

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
