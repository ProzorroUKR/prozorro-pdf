export type AddressType = {
  streetAddress: string;
  locality: string;
  region: string;
  postalCode: string;
  countryName: string;
};

export type AddressKeys = keyof AddressType;

export type AddressOrder = Record<string, AddressKeys[]>;
