import type { AxiosStatic } from "axios";
import { PdfTypes } from "@/services/PDF/PdfTypes";
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

export const loaderStrategyMap = new Map<
  string,
  new (base64: IBase64, axios: AxiosStatic) => LoaderStrategyInterface
>()
  .set(PdfTypes.TICKET, TicketLoader)
  .set(PdfTypes.CONCLUSION, ConclusionLoader)
  .set(PdfTypes.ANNOUNCEMENT, AnnouncementLoader)
  .set(PdfTypes.NAZK, NazkLoader)
  .set(PdfTypes.PQ, PQLoader)
  .set(PdfTypes.ANNUAL_PROCUREMENT_PLAN, AnnualProcurementPlan)
  .set(PdfTypes.TENDER_REJECTION_PROTOCOL, TenderRejectionProtocolLoader)
  .set(
    PdfTypes.DETERMINING_WINNER_OF_PROCUREMENT,
    DeterminingWinnerOfProcurementLoader
  )
  .set(
    PdfTypes.PURCHASE_CANCELLATION_PROTOCOL,
    PurchaseCancellationProtocolLoader
  )
  .set(
    PdfTypes.PROTOCOL_CONSIDERATION_TENDER_OFFERS,
    ProtocolConsiderationTenderOffersLoader
  )
  .set(
    PdfTypes.PROTOCOL_ON_EXTENSION_OF_REVIEW_PERIOD,
    ProtocolOnExtensionOfReviewPeriodLoader
  )
  .set(PdfTypes.TENDER_OFFER, TenderOfferLoader)
  .set(PdfTypes.COMPLAINT, ComplaintLoader)
  .set(PdfTypes.EDR, EdrLoader);
