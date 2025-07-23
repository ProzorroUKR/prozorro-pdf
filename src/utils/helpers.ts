export function excludeFalsy<T>(value: T): value is Exclude<T, false | null | undefined | "" | 0> {
  return Boolean(value);
}

export const deepClone = <T>(data: T): T => JSON.parse(JSON.stringify(data)) as T;

/**
 * Декоратор для методів логування, який автоматично конвертує рядкові повідомлення у формат LogDetails.
 */
export function formatLogParamDecorator() {
  return function (_: any, __: string, descriptor: PropertyDescriptor): PropertyDescriptor {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      const details = args[0];
      if (typeof details === "string") {
        args[0] = { message: details };
      }
      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}

/**
 * Декоратор для трасування викликів методів та функцій.
 */
export function traceDecorator() {
  return function (_: any, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      const result = originalMethod.apply(this, args);
      console.trace(`Trace for ${propertyKey}`);
      return result;
    };

    return descriptor;
  };
}
