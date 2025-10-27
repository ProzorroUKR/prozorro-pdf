import type { TextConfigType } from "@/widgets/pq/types/TextConfigType";
import { PROZORRO_TEMPLATE_CODES } from "@/widgets/pq/types/TemplateCodes.enum";
import { fruitContractConfig } from "@/widgets/pq/templates/fruit/configs/fruitContract.config";
import { computersContractConfig } from "@/widgets/pq/templates/computers/configs/computersContract.config";
import { fuelContractConfig } from "@/widgets/pq/templates/fuel/configs/fuelContract.config";
import { pharmContractConfig } from "@/widgets/pq/templates/pharm/configs/pharmContract.config";
import { medicineContractConfig } from "@/widgets/pq/templates/medicine/configs/medicineContract.config";
import { genericContractConfig } from "@/widgets/pq/templates/generic/configs/genericContract.config";
import { foodContractConfig } from "@/widgets/pq/templates/food/configs/foodContract.config";
import { fuel2ContractConfig } from "@/widgets/pq/templates/fuel2/configs/fuel2Contract.config";
import { softwareContractConfig } from "@/widgets/pq/templates/software/configs/softwareContract.config";
import { pharm2ContractConfig } from "@/widgets/pq/templates/pharm2/configs/pharm2Contract.config";
import { medicineV2ContractConfig } from "@/widgets/pq/templates/medicine2/config/medicineV2Contract.config";
import { fruit2ContractConfig } from "@/widgets/pq/templates/fruit2/configs/fruit2Contract.config";

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
  .set(PROZORRO_TEMPLATE_CODES.PHARM2, pharm2ContractConfig);
