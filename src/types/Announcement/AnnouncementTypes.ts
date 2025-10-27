import { MILESTONE_TYPE } from "@/constants/tender/milestones";
import type { DocumentType } from "@/types/Tender/DocumentType.ts";

export type AnnouncementType = {
  documents: DocumentType[];
};

export type Milestone = {
  code: string;
  description: string;
  sequenceNumber: number;
  title: string;
  duration: MilestoneDurationType;
  percentage: number;
  type: string;
  id: string;
  relatedLot?: string;
};

export type MilestoneDurationType = {
  type: MILESTONE_TYPE;
  days: number;
};

export type AnnouncementItem = {
  description: string;
  classification: {
    scheme: string;
    description: string;
    id: string;
  };
  additionalClassifications: AnnouncementItemAdditionalClassification[];
  deliveryAddress: {
    postalCode: string;
    countryName: string;
    streetAddress: string;
    region: string;
    locality: string;
  };
  deliveryDate: {
    endDate: string;
  };
  id: string;
  unit: {
    code: string;
    name: string;
  };
  quantity: number;
};

export type AnnouncementItemAdditionalClassification = {
  scheme: string;
  id: string;
  title: string;
  description: string;
};
