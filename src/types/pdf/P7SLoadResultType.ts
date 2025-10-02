import { PdfTemplateTypes } from "@/services/PDF/PdfTemplateTypes";
import type { SignerType } from "@/types/sign/SignerType";

export type P7SLoadResultType<DataType> = {
  url?: string;
  title: string;
  file: DataType;
  additionalData?: any;
  signers: SignerType[];
  type: PdfTemplateTypes;
};
