import { PREFIX } from "@/constants/prefixes";
import { formatLogParamDecorator, traceDecorator } from "./helpers";

export interface LogDetails {
  code?: number;
  message: string;
  originalError?: Error;
}

export interface ILogger {
  log(details: string | LogDetails): void;
  error(details: string | LogDetails, error?: Error): void;
  warn(details: string | LogDetails): void;
  debug(details: string | LogDetails): void;
  success(details: string | LogDetails): void;
}

export class Logger implements ILogger {
  constructor(private readonly prefix?: string) {}

  @traceDecorator()
  @formatLogParamDecorator()
  log(details: string | LogDetails): void {
    console.log(this._formatMessage(details as LogDetails), details);
  }

  @traceDecorator()
  @formatLogParamDecorator()
  error(details: string | LogDetails, error?: Error): void {
    console.error(this._formatMessage(details as LogDetails), details, error || "");
  }

  @traceDecorator()
  @formatLogParamDecorator()
  warn(details: string | LogDetails): void {
    console.warn(this._formatMessage(details as LogDetails), details);
  }

  @traceDecorator()
  @formatLogParamDecorator()
  debug(details: string | LogDetails): void {
    console.debug(this._formatMessage(details as LogDetails), details);
  }

  @traceDecorator()
  @formatLogParamDecorator()
  success(details: string | LogDetails): void {
    console.log(
      `%c ${this._formatMessage(details as LogDetails)} `,
      "color: green; font-weight: bold; background: white;",
      details
    );
  }

  private _formatMessage({ message }: LogDetails): string {
    return `${PREFIX.SIGN_TO_DOC}${this.prefix ? ` ${this.prefix}:` : ""} ${message}`;
  }
}
