import type { PdfFeatureModule } from "@/modules/types";

// Feature modules — each owns its loader, document maker, texts, constants,
// dictionaries and local services under src/modules/<type>/.
import { edrModule } from "@/modules/edr";
import { edr2Module } from "@/modules/edr-2";
import { nazkModule } from "@/modules/nazk";
import { conclusionModule } from "@/modules/conclusion";
import { ticketModule } from "@/modules/ticket";
import { deviationReportModule } from "@/modules/deviation-report";
import { complaintPostModule } from "@/modules/complaint-post";
import { complaintModule } from "@/modules/complaint";
import { announcementModule } from "@/modules/announcement";
import { determiningWinnerModule } from "@/modules/determining-winner";
import { tenderRejectionModule } from "@/modules/tender-rejection";
import { purchaseCancellationModule } from "@/modules/purchase-cancellation";
import { protocolExtensionModule } from "@/modules/protocol-extension";
import { protocolConsiderationModule } from "@/modules/protocol-consideration";
import { annualProcurementPlanModule } from "@/modules/annual-procurement-plan";
import { tenderOfferModule } from "@/modules/tender-offer";
import { pqModule } from "@/modules/pq";

/**
 * The full list of PDF feature-module descriptors. The core PDF pipeline builds
 * its loader / document-maker / dictionary maps from this list (see
 * `src/modules/ModuleRegistry.ts`) instead of importing every concrete class.
 */
export const pdfFeatureModules: PdfFeatureModule[] = [
  ticketModule,
  conclusionModule,
  announcementModule,
  nazkModule,
  pqModule,
  annualProcurementPlanModule,
  tenderRejectionModule,
  determiningWinnerModule,
  purchaseCancellationModule,
  protocolConsiderationModule,
  protocolExtensionModule,
  tenderOfferModule,
  complaintModule,
  edrModule,
  edr2Module,
  complaintPostModule,
  deviationReportModule,
];
