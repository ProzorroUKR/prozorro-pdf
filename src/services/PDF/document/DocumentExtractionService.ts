import get from "lodash/get";

export class DocumentExtractionService {
  static getField<T>(object: Record<string, any>, path: string, defaultValue: T = "" as any): T {
    return (get(object, path) as T) || defaultValue;
  }
}
