export interface NumbersSpellerInterface {
  convertToWords(
    input: string,
    defaults?: string,
    useFeminine?: boolean
  ): string;
  priceToWords(input: string, defaults?: string): string;
}
