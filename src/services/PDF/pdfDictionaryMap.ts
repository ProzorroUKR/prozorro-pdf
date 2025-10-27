import { PdfTemplateTypes } from "@/services/PDF/PdfTemplateTypes";
import { announcementDictionaries } from "@/services/DictionaryCollector/dictionaries/AnnouncementsDictionariesMap";
import { complaintDictionaries } from "@/services/DictionaryCollector/dictionaries/ComplaintDictionaries.map";
import { tenderRejectionProtocolDictionaries } from "@/services/DictionaryCollector/dictionaries/TenderRejectionProtocolDictionaries.map";
import { determiningWinnerOfProcurementDictionaries } from "@/services/DictionaryCollector/dictionaries/DeterminingWinnerOfProcurementDictionaries";
import { annualProcurementPlanDictionaries } from "@/services/DictionaryCollector/dictionaries/AnnualProcurementPlanDictionariesMap";
import { purchaseCancellationProtocolDictionaries } from "@/services/DictionaryCollector/dictionaries/PurchaseCancellationProtocolDictionaries";
import { protocolConsiderationTenderOffersDictionaries } from "@/services/DictionaryCollector/dictionaries/ProtocolconsiderationtenderoffersDictionaries.map";
import { protocolOnExtensionOfReviewPeriodDictionaries } from "@/services/DictionaryCollector/dictionaries/ProtocolOnExtensionOfReviewPeriodDictionaries";
import { tenderOfferDictionaries } from "@/services/DictionaryCollector/dictionaries/TenderOfferDictionaries.map";

export const pdfDictionaryMap = new Map<PdfTemplateTypes, Map<string, string>>()
  .set(PdfTemplateTypes.XML, new Map())
  .set(PdfTemplateTypes.KVT, new Map())
  .set(PdfTemplateTypes.MONITORING, new Map())
  .set(PdfTemplateTypes.ANNOUNCEMENT, announcementDictionaries)
  .set(PdfTemplateTypes.NAZK, new Map())
  .set(PdfTemplateTypes.PQ, new Map())
  .set(PdfTemplateTypes.TENDER_REJECTION_PROTOCOL_TEMPLATE, tenderRejectionProtocolDictionaries)
  .set(PdfTemplateTypes.ANNUAL_PROCUREMENT_PLAN, annualProcurementPlanDictionaries)
  .set(PdfTemplateTypes.DETERMINING_WINNER_OF_PROCUREMENT_TEMPLATE, determiningWinnerOfProcurementDictionaries)
  .set(PdfTemplateTypes.PURCHASE_CANCELLATION_PROTOCOL_TEMPLATE, purchaseCancellationProtocolDictionaries)
  .set(PdfTemplateTypes.PROTOCOL_CONSIDERATION_TENDER_OFFERS_TEMPLATE, protocolConsiderationTenderOffersDictionaries)
  .set(PdfTemplateTypes.PROTOCOL_ON_EXTENSION_OF_REVIEW_PERIOD_TEMPLATE, protocolOnExtensionOfReviewPeriodDictionaries)
  .set(PdfTemplateTypes.TENDER_OFFER_TEMPLATE, tenderOfferDictionaries)
  .set(PdfTemplateTypes.COMPLAINT, complaintDictionaries)
  .set(PdfTemplateTypes.COMPLAINT_POST, new Map());
