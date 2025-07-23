import type { IdentifierType } from "@/types/Tender/IdentifierType";
import type { ContactPointType } from "@/types/Tender/ContactPointType";
import type { AddressType } from "@/types/Tender/AddressType";

export type OrganizationType = {
  name: string;
  identifier?: IdentifierType;
  additionalIdentifiers?: IdentifierType[];
  contactPoint: ContactPointType;
  address: AddressType;
};
