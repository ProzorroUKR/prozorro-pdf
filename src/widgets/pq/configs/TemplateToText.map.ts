import type { TextConfigType } from "@/widgets/pq/types/TextConfigType";
import { TemplateCodesEnum } from "@/widgets/pq/types/TemplateCodes.enum";
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
  .set(TemplateCodesEnum.FRUIT, fruitContractConfig)
  .set(TemplateCodesEnum.FRUIT2, fruit2ContractConfig)
  .set(TemplateCodesEnum.COMPUTER, computersContractConfig)
  .set(TemplateCodesEnum.SOFTWARE, softwareContractConfig)
  .set(TemplateCodesEnum.OTHER, computersContractConfig)
  .set(TemplateCodesEnum.MEDICINE, medicineContractConfig)
  .set(TemplateCodesEnum.PHARM, pharmContractConfig)
  .set(TemplateCodesEnum.GAS, fuelContractConfig)
  .set(TemplateCodesEnum.GAS2, fuel2ContractConfig)
  .set(TemplateCodesEnum.GENERIC, genericContractConfig)
  .set(TemplateCodesEnum.FOOD, foodContractConfig)
  .set(TemplateCodesEnum.MEDICINE2, medicineV2ContractConfig)
  .set(TemplateCodesEnum.PHARM2, pharm2ContractConfig);
