import type { SignerType } from "@/types/sign/SignerType";
import type { PdfDocumentConfigType } from "@/types/pdf/PdfDocumentConfigType";

export interface DocumentStrategyInterface {
  create(
    data: any,
    config: PdfDocumentConfigType,
    signers?: SignerType[],
    dictionaries?: Map<string, Record<string, any>>,
    tender?: Record<string, any>
  ): Record<string, any>[] | Promise<Record<string, any>[]>;
  createFooter(
    signers?: SignerType[],
    link?: string
  ): ((currentPage: number) => Record<string, any>[]) | Record<string, any>[];
  getPageMargins(): number[];
  pageBreakBefore(): (
    currentNode?: Record<string, any>,
    followingNodesOnPage?: Record<string, any>,
    nodesOnNextPage?: Record<string, any>,
    previousNodesOnPage?: Record<string, any>
  ) => boolean | undefined;
}
