import { get } from "lodash";
import { STRING } from "@/constants/string";
import type { ClassificationType } from "@/types/Tender/ClassificationType";

export class ClassificationTransformer {
  static formatClassification(classification: ClassificationType): string {
    return [get(classification, "scheme"), get(classification, "id"), get(classification, "description")].join(
      STRING.WHITESPACE
    );
  }
}
