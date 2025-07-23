import type { CriteriaFactoryConfig } from "@/types/CriteriaFactoryConfig";
import { TENDER_OFFER } from "@/config/pdf/texts/TENDER_OFFER";

export const criterionTenderTablesConfig: CriteriaFactoryConfig[] = [
  {
    types: ["CRITERION.SELECTION"],
    tableTitle: TENDER_OFFER.confirmation_of_qualification_requirements_of_tender_documentation,
    isLot: false,
  },
  {
    types: ["CRITERION.EXCLUSION"],
    tableTitle: TENDER_OFFER.confirmation_of_absence_of_grounds_for_refusal_participate,
    isLot: false,
  },
  {
    types: ["CRITERION.OTHER.LIFE_CYCLE_COST"],
    tableTitle: TENDER_OFFER.validation_of_life_cycle_cost_requirements,
    isLot: false,
  },
  {
    types: [
      "CRITERION.OTHER.BID.LANGUAGE",
      "CRITERION.OTHER.BID.VALIDITY_PERIOD",
      "CRITERION.OTHER.UKRAINE_FACILITY",
      "CRITERION.OTHER.BID.GUARANTEE",
      "CRITERION.OTHER.CONTRACT.GUARANTEE",
    ],
    tableTitle: TENDER_OFFER.confirmation_of_other_requirements_of_tender_documentation,
    isLot: false,
  },
];

export const criterionLotTablesConfig: CriteriaFactoryConfig[] = [
  {
    types: ["CRITERION.SELECTION"],
    tableTitle: TENDER_OFFER.confirmation_of_qualification_requirements_of_tender_documentation,
    isLot: true,
  },
  {
    types: ["CRITERION.OTHER.LIFE_CYCLE_COST"],
    tableTitle: TENDER_OFFER.validation_of_life_cycle_cost_requirements,
    isLot: true,
  },
  {
    types: [
      "CRITERION.OTHER.BID.VALIDITY_PERIOD",
      "CRITERION.OTHER.UKRAINE_FACILITY",
      "CRITERION.OTHER.BID.GUARANTEE",
      "CRITERION.OTHER.CONTRACT.GUARANTEE",
    ],
    tableTitle: TENDER_OFFER.confirmation_of_other_requirements_of_tender_documentation,
    isLot: true,
  },
];
