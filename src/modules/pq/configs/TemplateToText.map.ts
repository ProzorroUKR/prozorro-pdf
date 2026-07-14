import type { TextConfigType } from "@/types/pq/TextConfigType";
import { PROZORRO_TEMPLATE_CODES } from "@/types/pq/TemplateCodes.enum";
import { fruitContractConfig } from "@/modules/pq/templates/fruit/configs/fruitContract.config";
import { computersContractConfig } from "@/modules/pq/templates/computers/configs/computersContract.config";
import { fuelContractConfig } from "@/modules/pq/templates/fuel/configs/fuelContract.config";
import { pharmContractConfig } from "@/modules/pq/templates/pharm/configs/pharmContract.config";
import { medicineContractConfig } from "@/modules/pq/templates/medicine/configs/medicineContract.config";
import { genericContractConfig } from "@/modules/pq/templates/generic/configs/genericContract.config";
import { foodContractConfig } from "@/modules/pq/templates/food/configs/foodContract.config";
import { fuel2ContractConfig } from "@/modules/pq/templates/fuel2/configs/fuel2Contract.config";
import { softwareContractConfig } from "@/modules/pq/templates/software/configs/softwareContract.config";
import { pharm2ContractConfig } from "@/modules/pq/templates/pharm2/configs/pharm2Contract.config";
import { medicineV2ContractConfig } from "@/modules/pq/templates/medicine2/config/medicineV2Contract.config";
import { fruit2ContractConfig } from "@/modules/pq/templates/fruit2/configs/fruit2Contract.config";
import { nushContractConfig } from "@/modules/pq/templates/nush/configs/nushContract.config";
import { aozContractConfig } from "@/modules/pq/templates/aoz/configs/aozContract.config.ts";

export const TemplateToTextMap = new Map<string, TextConfigType>()
  .set(PROZORRO_TEMPLATE_CODES.FRUIT, fruitContractConfig)
  .set(PROZORRO_TEMPLATE_CODES.FRUIT2, fruit2ContractConfig)
  .set(PROZORRO_TEMPLATE_CODES.COMPUTER, computersContractConfig)
  .set(PROZORRO_TEMPLATE_CODES.SOFTWARE, softwareContractConfig)
  .set(PROZORRO_TEMPLATE_CODES.OTHER, computersContractConfig)
  .set(PROZORRO_TEMPLATE_CODES.MEDICINE, medicineContractConfig)
  .set(PROZORRO_TEMPLATE_CODES.PHARM, pharmContractConfig)
  .set(PROZORRO_TEMPLATE_CODES.GAS, fuelContractConfig)
  .set(PROZORRO_TEMPLATE_CODES.GAS2, fuel2ContractConfig)
  .set(PROZORRO_TEMPLATE_CODES.GENERIC, genericContractConfig)
  .set(PROZORRO_TEMPLATE_CODES.FOOD, foodContractConfig)
  .set(PROZORRO_TEMPLATE_CODES.MEDICINE2, medicineV2ContractConfig)
  .set(PROZORRO_TEMPLATE_CODES.PHARM2, pharm2ContractConfig)
  .set(PROZORRO_TEMPLATE_CODES.NUSH, nushContractConfig)
  .set(PROZORRO_TEMPLATE_CODES.DPA, aozContractConfig);
