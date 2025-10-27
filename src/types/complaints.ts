import type { MoneyType } from "@/types/Tender/MoneyType";
import type { DocumentType } from "@/types/Tender/DocumentType";
import type { AddressType } from "@/types/Tender/AddressType";
import type { ContactPointType } from "@/types/Tender/ContactPointType";
import type { IdentifierType } from "@/types/Tender/IdentifierType";

export type ComplaintType = {
  author: Author;
  bidId: string;
  complaintID: string;
  date: string;
  description: string;
  documents: DocumentType[];
  id: string;
  objections: Objection[];
  relatedLot: string;
  status: string;
  title: string;
  type: string;
  value: MoneyType;
};

export type Objection = {
  arguments: Argument[];
  classification: ObjectionClassification;
  description: string;
  id: string;
  relatedItem: string;
  relatesTo: string;
  requestedRemedies: RequestedRemedy[];
  sequenceNumber?: number;
  title: string;
};

export type Evidence = {
  description: string;
  id: string;
  relatedDocument: string;
  title: string;
};

export type Argument = {
  description: string;
  evidences: Evidence[];
  id: string;
};

export type Author = {
  name: string;
  address: AddressType;
  contactPoint: ContactPointType;
  identifier: IdentifierType;
};

export type ObjectionClassification = {
  scheme: string;
  id: string;
  description: string;
};

export type RequestedRemedy = {
  description: string;
  id: string;
  type: string;
};
