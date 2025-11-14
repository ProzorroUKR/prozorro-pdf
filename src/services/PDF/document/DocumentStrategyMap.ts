import type { DocumentStrategyInterface } from "@/services/PDF/document/DocumentStrategyInterface";
import { PdfTemplateTypes } from "@/services/PDF/PdfTemplateTypes";
import { XmlDataMaker } from "@/services/PDF/document/documentData/XmlDataMaker";
import { KvtDataMaker } from "@/services/PDF/document/documentData/KvtDataMaker";
import { ConclusionOfMonitoringDataMaker } from "@/services/PDF/document/documentData/ConclusionOfMonitoringDataMaker";
import { AnnouncementDataMaker } from "@/widgets/TenderAnnouncement/AnnouncementDataMaker";
import { NazkDataMaker } from "@/services/PDF/document/documentData/NazkDataMaker";
import { PQDataMaker } from "@/services/PDF/document/documentData/PQDataMaker";
import { ComplaintDataMaker } from "@/services/PDF/document/documentData/ComplaintDataMaker";
import { TenderRejectionProtocolDataMaker } from "@/services/PDF/document/documentData/TenderRejectionProtocolDataMaker";
import { DeterminingWinnerOfProcurementDataMaker } from "@/services/PDF/document/documentData/DeterminingWinnerOfProcurementDataMaker";
import { AnnualProcurementPlanDataMaker } from "@/services/PDF/document/documentData/AnnualProcurementPlanDataMaker";
import { PurchaseCancellationProtocolDataMaker } from "@/services/PDF/document/documentData/PurchaseCancellationProtocolDataMaker";
import { ProtocolConsiderationTenderOffersDataMaker } from "@/services/PDF/document/documentData/ProtocolConsiderationTenderOffersDataMaker";
import { ProtocolOnExtensionOfReviewPeriodDataMaker } from "@/services/PDF/document/documentData/ProtocolOnExtensionOfReviewPeriodDataMaker";
import { TenderOfferDataMaker } from "@/services/PDF/document/documentData/TenderOfferDataMaker";
import { EdrDataMaker } from "@/services/PDF/document/documentData/EdrDataMaker";
import { ComplaintPostDataMaker } from "@/widgets/ComplaintPost/ComplaintPostDataMaker";
import type { EnvironmentType } from "@/types/pdf/EnvironmentType";
import { DeviationReportMaker } from "@/services/PDF/document/documentData/DeviationReportMaker";

export const documentStrategyMap = new Map<
  PdfTemplateTypes,
  new (envVars: EnvironmentType) => DocumentStrategyInterface
>()
  .set(PdfTemplateTypes.XML, XmlDataMaker)
  .set(PdfTemplateTypes.KVT, KvtDataMaker)
  .set(PdfTemplateTypes.MONITORING, ConclusionOfMonitoringDataMaker)
  .set(PdfTemplateTypes.ANNOUNCEMENT, AnnouncementDataMaker)
  .set(PdfTemplateTypes.NAZK, NazkDataMaker)
  .set(PdfTemplateTypes.PQ, PQDataMaker)
  .set(PdfTemplateTypes.ANNUAL_PROCUREMENT_PLAN, AnnualProcurementPlanDataMaker)
  .set(PdfTemplateTypes.PROTOCOL_CONSIDERATION_TENDER_OFFERS_TEMPLATE, ProtocolConsiderationTenderOffersDataMaker)
  .set(PdfTemplateTypes.DETERMINING_WINNER_OF_PROCUREMENT_TEMPLATE, DeterminingWinnerOfProcurementDataMaker)
  .set(PdfTemplateTypes.PURCHASE_CANCELLATION_PROTOCOL_TEMPLATE, PurchaseCancellationProtocolDataMaker)
  .set(PdfTemplateTypes.TENDER_REJECTION_PROTOCOL_TEMPLATE, TenderRejectionProtocolDataMaker)
  .set(PdfTemplateTypes.PROTOCOL_ON_EXTENSION_OF_REVIEW_PERIOD_TEMPLATE, ProtocolOnExtensionOfReviewPeriodDataMaker)
  .set(PdfTemplateTypes.TENDER_OFFER_TEMPLATE, TenderOfferDataMaker)
  .set(PdfTemplateTypes.COMPLAINT, ComplaintDataMaker)
  .set(PdfTemplateTypes.EDR, EdrDataMaker)
  .set(PdfTemplateTypes.COMPLAINT_POST, ComplaintPostDataMaker)
  .set(PdfTemplateTypes.DEVIATION_REPORT, DeviationReportMaker);
