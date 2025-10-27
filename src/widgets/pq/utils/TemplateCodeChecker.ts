import { PROZORRO_TEMPLATE_CODES } from "@/widgets/pq/types/TemplateCodes.enum";
import { TemplateVersionsMap } from "@/widgets/pq/configs/TemplateVersions.map";
import { TemplateVersionsEnum } from "@/widgets/pq/types/TemplateVersions.enum";

export class TemplateCodeChecker {
  static isExistingTemplateName(templateName: string): boolean {
    return Object.values(PROZORRO_TEMPLATE_CODES).includes(templateName as PROZORRO_TEMPLATE_CODES);
  }

  static validatedTemplateName(
    templateName: string,
    fallbackTemplate = PROZORRO_TEMPLATE_CODES.GENERIC
  ): PROZORRO_TEMPLATE_CODES {
    return TemplateCodeChecker.isExistingTemplateName(templateName)
      ? (templateName as PROZORRO_TEMPLATE_CODES)
      : fallbackTemplate;
  }

  static isVersionTemplate(templateName: string, version: TemplateVersionsEnum): boolean {
    const contractTemplateName = TemplateCodeChecker.validatedTemplateName(templateName);
    const versionList = TemplateVersionsMap.get(version) || [];

    return versionList.includes(contractTemplateName) || !templateName;
  }
}
