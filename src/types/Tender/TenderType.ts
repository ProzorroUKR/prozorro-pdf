import type { AwardType } from "@/types/Tender/AwardType";
import type { DocumentType } from "@/types/Tender/DocumentType";

export type TenderType = {
  title: string;
  description?: string;
  tenderID: string;
  awards?: AwardType[];
  documents?: DocumentType[];
};
