import type { SignerType } from "@/types/sign/SignerType";

export interface DocumentStrategyInterface {
  create(
    file: string,
    signers?: SignerType[],
    dictionaries?: Map<string, Record<string, any>>,
    tender?: Record<string, any>
  ): Record<string, any>[];
  createFooter(signers?: SignerType[], link?: string): Record<string, any>[];
  getPageMargins(): number[];
  pageBreakBefore(): (
    currentNode?: Record<string, any>,
    followingNodesOnPage?: Record<string, any>,
    nodesOnNextPage?: Record<string, any>,
    previousNodesOnPage?: Record<string, any>
  ) => boolean | undefined;
}
