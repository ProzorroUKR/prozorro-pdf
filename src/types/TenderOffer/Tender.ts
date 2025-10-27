import type { ClassificationType } from "@/types/Tender/ClassificationType";
import type { DocumentType } from "@/types/Tender/DocumentType";
import type { AwardType } from "@/types/Tender/AwardType";
import type { Milestone } from "@/types/Announcement/AnnouncementTypes";

export type TenderOfferType = {
  id: string;
  title?: string;
  tenderID: string;
  date?: string;
  bids?: BidType[];
  features?: FeatureType[];
  criteria?: CriterionType[];
  procurementMethodType: string;
  items?: ItemType[];
  lots?: LotValueType[];
  awards?: AwardType[];
  milestones?: Milestone[];
};

export type BidType = {
  id: string;
  date?: string;
  status: string;
  tenderers?: BidTendererType[];
  value?: BidsValueType;
  weightedValue?: BidsValueType;
  subcontractingDetails?: string;
  parameters?: BidParametersType[];
  requirementResponses?: RequirementResponseType[];
  lotValues?: LotValueType[];
  documents?: DocumentType[];
  financialDocuments?: DocumentType[];
  eligibilityDocuments?: DocumentType[];
  qualificationDocuments?: DocumentType[];
  items?: ItemType[];
};

export type BidTendererType = {
  scale?: string;
  name?: string;
  contactPoint?: ContactPointType;
  identifier?: IdentifierType;
  address?: AddressType;
};

export type AddressType = {
  streetAddress?: string;
  postalCode?: string;
  countryName?: string;
  region?: string;
  locality?: string;
};

export type IdentifierType = {
  scheme?: string;
  id: string;
  legalName: string;
};

export type ContactPointType = {
  name?: string;
  email?: string;
  telephone?: string;
  faxNumber?: string;
  url?: string;
};

export type BidsValueType = {
  amount?: number;
  amountPerformance?: number;
  currency?: string;
  valueAddedTaxIncluded?: boolean;
  amountNet?: number;
  contractDuration?: ContractDurationType;
  annualCostsReduction?: number[];
  yearlyPaymentsPercentage?: number;
};

export type ContractDurationType = {
  years: number;
  days: number;
};

export type BidParametersType = {
  code: string;
  value: number;
};

export type FeatureType = {
  code: string;
  title: string;
  description?: string;
  enum: EnumType[];
  relatedItem: string;
  featureOf: string;
};

export type CriterionType = {
  id: string;
  title?: string;
  description?: string;
  source?: string;
  relatesTo?: string;
  relatedItem?: string;
  classification?: ClassificationType;
  additionalClassifications?: ClassificationType[];
  legislation?: LegislationType[];
  requirementGroups: RequirementGroupType[];
};

export type LegislationType = {
  version: string;
  identifier: IdentifierType;
  type: string;
  article?: string;
};

export type RequirementGroupType = {
  id: string;
  description: string;
  requirements: RequirementType[];
};

export type RequirementType = {
  id: string;
  title: string;
  description?: string;
  dataType: string;
  status: string;
  minValue?: number;
  maxValue?: number;
  expectedValue?: number | string | boolean;
  expectedValues?: string[];
  period?: PeriodType;
  relatedFeature?: string;
  eligibleEvidences?: EvidenceType[];
  datePublished: string;
  dateModified?: string;
  unit?: UnitType;
  dataSchema?: DataSchemaType;
};

export type DataSchemaType = "ISO 3166-1 alpha-2" | "ISO 639-3";

export type PeriodType = {
  startDate?: string;
  endDate?: string;
  durationInDays?: number;
  duration?: string;
};

export type EvidenceType = {
  id: string;
  title?: string;
  description?: string;
  type: "document" | "statement";
  relatedDocument?: ReferenceType;
};

export type RequirementResponseType = {
  id: string;
  title?: string;
  description?: string;
  value?: boolean | string | number;
  values?: string[];
  period?: PeriodType;
  relatedTenderer?: string;
  relatedItem?: string;
  requirement: ReferenceType;
  evidences?: EvidenceType[];
  unit?: UnitType;
  classification?: ClassificationType;
};

export type ReferenceType = {
  id: string;
  title?: string;
};

export type LotValueType = {
  id?: string;
  title?: string;
  value?: BidsValueType;
  weightedValue?: BidsValueType;
  relatedLot: string;
  status: string;
  subcontractingDetails?: string;
  date?: string;
  participationUrl?: string;
};

export type ItemType = {
  id: string;
  description?: string;
  classification?: ClassificationType;
  additionalClassifications?: ClassificationType[];
  unit?: UnitType;
  quantity?: number;
  relatedLot?: string;
  deliveryDate?: PeriodType;
  deliveryAddress?: AddressType;
  deliveryLocation?: {
    latitude: string;
    longitude: string;
  };
};

export type UnitType = {
  code: string;
  name?: string;
};

export type EnumType = {
  description?: string;
  value: number;
  title: string;
};

export type SubCriteriaFieldsType = {
  classificationId: string;
  title: string;
  unit: UnitType | undefined;
  value: string | undefined;
  values: string[] | undefined;
};

export type ItemTableRowType = {
  key: string;
  mainRow: { text: string | Record<string, any>; style: string }[];
  additional: SubCriteriaFieldsType[] | null;
};
