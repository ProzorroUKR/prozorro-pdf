export const additionalClassifications: { readonly [index: string]: string } = {
  CPV: "ДК 021:2015",
  ДКПП: "ДК 016:2010",
  ДК015: "ДК 015-97",
  ДК018: "ДК 018-2000",
  ДК003: "ДК003:2010",
  КЕКВ: "КЕКВ",
  ДК021: "ДК021-2015",
  INN_NO_EU: "МНН",
  INN_EU: "INN",
  ATC_NO_EU: "АТХ",
  ATC_EU: "ATC",
  INN: "МНН",
  ATC: "АТХ",
  "UA-ROAD": "Індекс автомобільних доріг",
  GMDN: "НК 024:2019",
  "GMDN-2023": "НК 024:2023",
};
export const additionalClassificationsResolves: {
  [index: string]: {
    readonly format: string;
    readonly dictionary: string | null;
  };
} = {
  ДКПП: {
    format: ":classification: :id :dash :description",
    dictionary: null,
  },
  ДК015: {
    format: ":classification: :id :dash :description",
    dictionary: "dk015",
  },
  ДК018: {
    format: ":classification: :id :dash :description",
    dictionary: "buildings_structures_dk",
  },
  ДК021: {
    format: ":classification: :id :dash :description",
    dictionary: "buildings_structures_dk",
  },
  ДК003: {
    format: ":classification: :id :dash :description",
    dictionary: "dk003",
  },
  КЕКВ: {
    format: ":classification: :id :dash :description",
    dictionary: "budget_expenditures",
  },
  INN: {
    format: ":classification: :description",
    dictionary: "inn",
  },
  ATC: {
    format: ":classification: :description",
    dictionary: "atc",
  },
  "UA-ROAD": {
    format: ":classification: :id :dash :description",
    dictionary: "roads",
  },
  GMDN: {
    format: ":classification: :id :dash :description",
    dictionary: null,
  },
  "GMDN-2023": {
    format: ":classification: :id :dash :description",
    dictionary: null,
  },
};
