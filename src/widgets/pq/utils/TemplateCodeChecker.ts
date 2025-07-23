import { TemplateCodesEnum } from "@/widgets/pq/types/TemplateCodes.enum";
import { TemplateVersionsMap } from "@/widgets/pq/configs/TemplateVersions.map";
import { TemplateVersionsEnum } from "@/widgets/pq/types/TemplateVersions.enum";

export class TemplateCodeChecker {
  static isExistingTemplateName(templateName: string): boolean {
    return Object.values(TemplateCodesEnum).includes(templateName as TemplateCodesEnum);
  }

  static validatedTemplateName(templateName: string, fallbackTemplate = TemplateCodesEnum.GENERIC): TemplateCodesEnum {
    return TemplateCodeChecker.isExistingTemplateName(templateName)
      ? (templateName as TemplateCodesEnum)
      : fallbackTemplate;
  }

  static isVersionTemplate(templateName: string, version: TemplateVersionsEnum): boolean {
    const contractTemplateName = TemplateCodeChecker.validatedTemplateName(templateName);
    const versionList = TemplateVersionsMap.get(version) || [];

    return versionList.includes(contractTemplateName) || !templateName;
  }
}
