export class ArrayHandler {
  static getFirstElement<T>([firstElement]: T[]): T | undefined {
    return firstElement;
  }

  static getLastElement<T>(arr: T[]): T | undefined {
    const lastIndex = arr.length - 1;
    return arr[lastIndex];
  }

  static isLastIndex(index: number, arr: any[]): boolean {
    return index === arr.length - 1;
  }
}
