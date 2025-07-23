import { REGEX } from "@/constants/regex";
import { STRING } from "@/constants/string";
import { ErrorExceptionCore } from "@/widgets/ErrorExceptionCore/ErrorExceptionCore";

export interface IBase64 {
  encode(data: Blob): Promise<string>;
  decode(string: string, encoding: string): string;
}

export class Base64 implements IBase64 {
  encode(data: Blob): Promise<string> {
    const reader = new FileReader();

    return new Promise((resolve, reject) => {
      reader.onload = () => {
        const data: string = (reader.result as string) || STRING.EMPTY;
        resolve(data.replace(REGEX.STRING.BASE64_DESCRIPTION, STRING.EMPTY));
      };

      reader.onerror = reject;
      reader.readAsDataURL(data);
    });
  }

  decode(data: string, encoding: string): string {
    try {
      const bytesArray = new Uint8Array(
        atob(data)
          .split(STRING.EMPTY)
          .map(c => c.charCodeAt(0))
      );
      return new TextDecoder(encoding).decode(bytesArray);
    } catch (e) {
      throw new ErrorExceptionCore(e as Error);
    }
  }
}
