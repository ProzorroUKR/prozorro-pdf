import type { AddressOrder } from "@/types/Tender/AddressType";

export const ADDRESS_ORDER: AddressOrder = {
  COUNTRY_TO_STREET: ["postalCode", "countryName", "region", "locality", "streetAddress"],
  STREET_TO_COUNTRY: ["locality", "streetAddress", "region", "postalCode", "countryName"],
  EDR_LOCATION: ["countryName", "postalCode", "streetAddress"],
  EDR2_LOCATION: ["country", "zip", "parts.atu", "parts.street", "parts.house_type", "parts.house"],
};
