import type { IPQBuilder } from "@/widgets/pq/PQBuilderInterface";
import { TemplateCodesEnum } from "@/widgets/pq/types/TemplateCodes.enum";
import { ComputersBuilder } from "@/widgets/pq/templates/computers/ComputerBuilder";
import { FoodBuilder } from "@/widgets/pq/templates/food/FoodBuilder";
import { FruitBuilder } from "@/widgets/pq/templates/fruit/FruitBuilder";
import { FuelBuilder } from "@/widgets/pq/templates/fuel/FuelBuilder";
import { GenericBuilder } from "@/widgets/pq/templates/generic/GenericBuilder";
import { MedicineBuilder } from "@/widgets/pq/templates/medicine/MedicineBuilder";
import { OtherBuilder } from "@/widgets/pq/templates/other/OtherBuilder";
import { PharmBuilder } from "@/widgets/pq/templates/pharm/PharmBuilder";
import { Medicine2Builder } from "@/widgets/pq/templates/medicine2/Medicine2Builder";
import { Pharm2Builder } from "@/widgets/pq/templates/pharm2/Pharm2Builder";
import { Fuel2Builder } from "@/widgets/pq/templates/fuel2/Fuel2Builder";
import { SoftwareBuilder } from "@/widgets/pq/templates/software/SoftwareBuilder";
import { Fruit2Builder } from "@/widgets/pq/templates/fruit2/Fruit2Builder";

export const TEMPLATE_TO_BUILDER = new Map<string, IPQBuilder>()
  .set(TemplateCodesEnum.COMPUTER, new ComputersBuilder())
  .set(TemplateCodesEnum.SOFTWARE, new SoftwareBuilder())
  .set(TemplateCodesEnum.FOOD, new FoodBuilder())
  .set(TemplateCodesEnum.FRUIT, new FruitBuilder())
  .set(TemplateCodesEnum.FRUIT2, new Fruit2Builder())
  .set(TemplateCodesEnum.GAS, new FuelBuilder())
  .set(TemplateCodesEnum.GAS2, new Fuel2Builder())
  .set(TemplateCodesEnum.GENERIC, new GenericBuilder())
  .set(TemplateCodesEnum.MEDICINE, new MedicineBuilder())
  .set(TemplateCodesEnum.MEDICINE2, new Medicine2Builder())
  .set(TemplateCodesEnum.OTHER, new OtherBuilder())
  .set(TemplateCodesEnum.PHARM, new PharmBuilder())
  .set(TemplateCodesEnum.PHARM2, new Pharm2Builder());
