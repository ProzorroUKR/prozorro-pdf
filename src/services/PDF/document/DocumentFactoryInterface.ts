import type { DocumentStrategyInterface } from "@/services/PDF/document/DocumentStrategyInterface";

export interface DocumentFactoryInterface {
  create(type: string): DocumentStrategyInterface;
}
