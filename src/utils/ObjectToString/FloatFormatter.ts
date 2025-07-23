export class FloatFormatter {
  static format(input: number, precision = 0): string {
    if (Number.isInteger(input)) {
      return input.toString();
    }
    const [intPart, floatPart] = input.toString().split(".");
    if (!precision) {
      return intPart;
    }
    return `${intPart}.${floatPart.slice(0, precision)}`;
  }
}
