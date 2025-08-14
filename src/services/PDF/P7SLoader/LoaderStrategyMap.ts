import type { AxiosStatic } from "axios";
import { PROZORRO_PDF_TYPES } from "@/services/PDF/PdfTypes";
import { ConclusionLoader } from "@/services/PDF/P7SLoader/loaders/ConclusionLoader.ts";
import { TicketLoader } from "@/services/PDF/P7SLoader/loaders/TicketLoader.ts";
import type { LoaderStrategyInterface } from "@/services/PDF/P7SLoader/LoaderStrategyInterface";
import type { IBase64 } from "@/utils/Base64";
import { AnnouncementLoader } from "@/services/PDF/P7SLoader/loaders/AnouncementLoader";
import { NazkLoader } from "@/services/PDF/P7SLoader/loaders/NazkLoader";
import { PQLoader } from "@/services/PDF/P7SLoader/loaders/PQLoader";
import { ComplaintLoader } from "@/services/PDF/P7SLoader/loaders/ComplaintLoader";
import { TenderRejectionProtocolLoader } from "@/services/PDF/P7SLoader/loaders/TenderRejectionProtocolLoader";
import { DeterminingWinnerOfProcurementLoader } from "@/services/PDF/P7SLoader/loaders/DeterminingWinnerOfProcurementLoader";
import { PurchaseCancellationProtocolLoader } from "@/services/PDF/P7SLoader/loaders/PurchaseCancellationProtocolLoader";
import { AnnualProcurementPlan } from "@/services/PDF/P7SLoader/loaders/AnnualProcurementPlan";
import { ProtocolConsiderationTenderOffersLoader } from "@/services/PDF/P7SLoader/loaders/ProtocolConsiderationTenderOffersLoader";
import { ProtocolOnExtensionOfReviewPeriodLoader } from "@/services/PDF/P7SLoader/loaders/ProtocolOnExtensionOfReviewPeriodLoader";
import { TenderOfferLoader } from "@/services/PDF/P7SLoader/loaders/TenderOfferLoader";
import { EdrLoader } from "@/services/PDF/P7SLoader/loaders/EdrLoader";

export const loaderStrategyMap = new Map<string, new (base64: IBase64, axios: AxiosStatic) => LoaderStrategyInterface>()
  .set(PROZORRO_PDF_TYPES.TICKET, TicketLoader)
  .set(PROZORRO_PDF_TYPES.CONCLUSION, ConclusionLoader)
  .set(PROZORRO_PDF_TYPES.ANNOUNCEMENT, AnnouncementLoader)
  .set(PROZORRO_PDF_TYPES.NAZK, NazkLoader)
  .set(PROZORRO_PDF_TYPES.PQ, PQLoader)
  .set(PROZORRO_PDF_TYPES.ANNUAL_PROCUREMENT_PLAN, AnnualProcurementPlan)
  .set(PROZORRO_PDF_TYPES.TENDER_REJECTION_PROTOCOL, TenderRejectionProtocolLoader)
  .set(PROZORRO_PDF_TYPES.DETERMINING_WINNER_OF_PROCUREMENT, DeterminingWinnerOfProcurementLoader)
  .set(PROZORRO_PDF_TYPES.PURCHASE_CANCELLATION_PROTOCOL, PurchaseCancellationProtocolLoader)
  .set(PROZORRO_PDF_TYPES.PROTOCOL_CONSIDERATION_TENDER_OFFERS, ProtocolConsiderationTenderOffersLoader)
  .set(PROZORRO_PDF_TYPES.PROTOCOL_ON_EXTENSION_OF_REVIEW_PERIOD, ProtocolOnExtensionOfReviewPeriodLoader)
  .set(PROZORRO_PDF_TYPES.TENDER_OFFER, TenderOfferLoader)
  .set(PROZORRO_PDF_TYPES.COMPLAINT, ComplaintLoader)
  .set(PROZORRO_PDF_TYPES.EDR, EdrLoader);
