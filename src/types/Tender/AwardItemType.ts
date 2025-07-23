import type { ClassificationType } from "@/types/Tender/ClassificationType";
import type { AddressType } from "@/types/Tender/AddressType";

export type AwardItemType = {
  id: string;
  description: string;
  classification?: ClassificationType;
  additionalClassifications?: ClassificationType[];
  unit?: {
    code: string;
    name: string;
  };
  quantity?: number;
  deliveryDate?: {
    startDate?: string;
    endDate?: string;
  };
  deliveryAddress?: AddressType;
  deliveryLocation?: {
    latitude: string;
    longitude: string;
    elevation: string;
  };
  relatedLot?: string;
};
