import type { Edr2AddressType } from "@/types/Edr/Edr2Type";

export type AddressType = {
  streetAddress: string;
  locality: string;
  region: string;
  postalCode: string;
  countryName: string;
};

export type AddressKeys = keyof AddressType;
export type Edr2AddressKeys = keyof Edr2AddressType;

export type AddressOrder = Record<string, AddressKeys[] | Edr2AddressKeys[] | string[]>;
