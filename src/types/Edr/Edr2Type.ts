import type { EdrErrorType, EdrMetaType } from "@/types/Edr/EdrType.ts";

export interface Edr2ActivityKindType {
  code: string;
  is_primary: boolean;
  name: string;
}

export interface Edr2AddressType {
  address?: string;
  country?: string;
  zip?: string;
  parts?: {
    atu?: string;
    atu_code?: number;
    atu_code_id?: number;
    house?: string;
    house_type?: string;
    street?: string;
    street_id?: number;
  };
}

export interface Edr2ContactsType {
  email?: string;
  tel?: string[];
  fax?: string;
  web_page?: string;
  anotherInfo?: string;
}

export interface Edr2FounderType {
  address?: Edr2AddressType;
  capital?: number;
  code?: string;
  country?: string;
  name?: string;
  role?: number;
  role_text?: string;
}

export interface Edr2BeneficiaryType {
  last_name?: string;
  first_middle_name?: string;
  country?: string;
  address?: Edr2AddressType;
  beneficiaries_type?: number | string;
  beneficiary_false?: boolean;
  name?: string;
  code?: string;
  role_text?: string;
  interest?: number | string;
  indirect_interest?: number | string;
  other_impact?: string;
}

export interface Edr2BeneficiariesGeneralInfoType {
  excluded?: boolean;
  is_missing?: boolean;
  reason?: string;
}

export interface Edr2HeadType {
  address?: Edr2AddressType;
  first_middle_name?: string;
  is_missing_chief?: boolean;
  last_name?: string;
  role?: number;
  role_text?: string;
  appointment_date?: string;
  restriction?: string;
}

export interface Edr2NamesType {
  display?: string;
  include_olf?: number;
  name: string;
  short?: string;
  name_en?: string;
  short_en?: string;
}

export interface Edr2PrimaryActivityKindType {
  class?: string;
  code: string;
  name: string;
  reg_number?: string;
}

export interface Edr2PropertyStructType {
  struct_excluded?: boolean;
  struct_false?: boolean;
  struct_opaque?: boolean;
  struct_signed?: boolean;
}

export interface Edr2RegistrationType {
  date?: string;
  is_division?: boolean;
  is_merge?: boolean;
  is_separation?: boolean;
  is_transformation?: boolean;
  record_date?: string;
  record_number?: string;
}

export interface Edr2RegistrationEntryType {
  code?: string;
  description?: string;
  name?: string;
  start_date?: string;
  start_num?: string;
  type?: number;
}

export interface Edr2RelatedSubjectType {
  name?: string;
  code?: string;
}

export interface Edr2TerminationType {
  cause?: string;
  date?: string;
  record_number?: string;
  requirement_end_date?: string;
  state?: number;
  state_text?: string;
}

export interface Edr2TerminationCancelType {
  record_number?: string;
  date?: string;
}

export interface Edr2BankruptcyType {
  date?: string;
  state_text?: string;
  doc_number?: string;
  doc_date?: string;
  date_judge?: string;
  court_name?: string;
}

export interface Edr2DataType {
  activity_kinds?: Edr2ActivityKindType[];
  address?: Edr2AddressType;
  authorised_capital?: {
    value?: number;
  };
  code?: string;
  contacts?: Edr2ContactsType;
  e_resident?: boolean;
  beneficiaries?: Edr2BeneficiaryType[];
  beneficiaries_general_info?: Edr2BeneficiariesGeneralInfoType;
  founders?: Edr2FounderType[];
  founders_general_info?: {
    accounting?: boolean;
  };
  founding_document_type?: number;
  heads?: Edr2HeadType[];
  id?: number;
  management?: string;
  names?: Edr2NamesType;
  object_name?: string;
  olf_code?: string;
  olf_name?: string;
  primary_activity_kind?: Edr2PrimaryActivityKindType;
  property_struct?: Edr2PropertyStructType;
  registration?: Edr2RegistrationType;
  registrations?: Edr2RegistrationEntryType[];
  predecessors?: Edr2RelatedSubjectType;
  assignees?: Edr2RelatedSubjectType;
  bankruptcy?: Edr2BankruptcyType;
  state?: number;
  state_text?: string;
  subject_type?: "person" | "enterprise" | string;
  termination?: Edr2TerminationType;
  termination_cancel?: Edr2TerminationCancelType;
}

export interface Edr2Type {
  data?: Edr2DataType;
  error?: EdrErrorType;
  meta: EdrMetaType;
}
