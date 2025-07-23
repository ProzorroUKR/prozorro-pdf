import type { LoaderStrategyInterface } from "@/services/PDF/P7SLoader/LoaderStrategyInterface";

export interface LoaderFactoryInterface {
  create(type: string): LoaderStrategyInterface;
}
