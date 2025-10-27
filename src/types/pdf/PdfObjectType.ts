import type { TenderType } from "@/types/Tender/TenderType";
import type { MonitoringType } from "@/types/Monitoring/MonitoringType";
import type { AnnouncementType } from "@/types/Announcement/AnnouncementTypes";
import type { AwardType } from "@/types/Tender/AwardType";
import type { PQDataComplexType } from "@/widgets/pq/types/PQTypes";
import type { ComplaintType } from "@/types/complaints";
import type { CancellationType } from "@/types/PurchaseCancellation/PurchaseCancellationTypes";
import type { DocumentType } from "@/types/Tender/DocumentType";
import type { BidType } from "@/types/TenderOffer/Tender";

export type PdfObjectType =
  | TenderType
  | MonitoringType
  | AnnouncementType
  | AwardType
  | PQDataComplexType
  | ComplaintType
  | DocumentType
  | CancellationType
  | BidType;
