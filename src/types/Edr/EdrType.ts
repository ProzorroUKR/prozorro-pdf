import type { ClassificationType } from "@/types/Tender/ClassificationType";

export interface EdrAddressType {
  countryName: string;
  postalCode: string;
  streetAddress: string;
}

export interface EdrIdentificationType {
  legalName: string;
  scheme: string;
}

export interface EdrFounderType {
  name?: string;
  code?: string;
  capital?: string;
  address?: EdrAddressType;
}

export interface EdrDataType {
  name?: string;
  management?: string;
  address?: EdrAddressType;
  founders?: EdrFounderType[];
  activityKind?: ClassificationType;
  identification?: EdrIdentificationType;
  additionalActivityKinds?: ClassificationType[];
  registrationStatus: string;
  registrationStatusDetails: string;
}

export interface EdrErrorType {
  code: string;
  errorDetails: string;
}

export interface EdrMetaType {
  id: string;
  author: string;
  version: string;
  sourceDate: string;
  sourceRequests: string[];
}

export interface EdrType {
  data?: EdrDataType;
  error?: EdrErrorType;
  meta: EdrMetaType;
}
