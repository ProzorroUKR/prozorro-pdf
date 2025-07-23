import type { DocumentType } from "@/types/Tender/DocumentType";

export type ConclusionType = {
  violationOccurred?: boolean;
  violationType?: string;
  auditFinding?: string;
  stringsAttached?: string;
  description?: string;
  date?: string;
  documents?: DocumentType[];
  dateCreated: string;
  datePublished: string;
  relatedParty?: string;
};
