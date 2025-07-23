export interface DictionaryCollectorInterface {
  load(dictionary: string): Promise<Record<string, any>>;
}
