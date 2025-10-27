import type { IPQBuilder } from "@/widgets/pq/PQBuilderInterface";
import { PROZORRO_TEMPLATE_CODES } from "@/widgets/pq/types/TemplateCodes.enum";
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
  .set(PROZORRO_TEMPLATE_CODES.COMPUTER, new ComputersBuilder())
  .set(PROZORRO_TEMPLATE_CODES.SOFTWARE, new SoftwareBuilder())
  .set(PROZORRO_TEMPLATE_CODES.FOOD, new FoodBuilder())
  .set(PROZORRO_TEMPLATE_CODES.FRUIT, new FruitBuilder())
  .set(PROZORRO_TEMPLATE_CODES.FRUIT2, new Fruit2Builder())
  .set(PROZORRO_TEMPLATE_CODES.GAS, new FuelBuilder())
  .set(PROZORRO_TEMPLATE_CODES.GAS2, new Fuel2Builder())
  .set(PROZORRO_TEMPLATE_CODES.GENERIC, new GenericBuilder())
  .set(PROZORRO_TEMPLATE_CODES.MEDICINE, new MedicineBuilder())
  .set(PROZORRO_TEMPLATE_CODES.MEDICINE2, new Medicine2Builder())
  .set(PROZORRO_TEMPLATE_CODES.OTHER, new OtherBuilder())
  .set(PROZORRO_TEMPLATE_CODES.PHARM, new PharmBuilder())
  .set(PROZORRO_TEMPLATE_CODES.PHARM2, new Pharm2Builder());
