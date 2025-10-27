import type { ClassificationType } from "@/types/Tender/ClassificationType";
import { SCHEME_TRANSLATION_DICTIONARY } from "@/config/SCHEME_TRANSLATION_DICTIONARY";

export class ClassificationHandler {
  static format(classification?: ClassificationType, additionalClassification: ClassificationType[] = []): string[] {
    return [classification, additionalClassification]
      .flat()
      .filter<ClassificationType>(el => !!el)
      .map<string>(({ scheme, id, description }: ClassificationType) => {
        const translatedScheme = SCHEME_TRANSLATION_DICTIONARY.get(scheme) || scheme;
        const formattedId = !["ATC", "INN"].includes(scheme) && id ? id : "";

        return [
          translatedScheme,
          formattedId || description ? ": " : "",
          formattedId,
          formattedId && description ? " – " : "",
          description,
        ]
          .filter(Boolean)
          .join("");
      });
  }
}
