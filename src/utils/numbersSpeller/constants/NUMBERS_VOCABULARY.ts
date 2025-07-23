export const ZERO = "нуль";

export const NUMBERS_FEMININES: Record<string, string> = {
  ONE: "одна",
  TWO: "дві",
};

export const NUMBERS_VOCABULARY: Record<string, string[]> = {
  BELOW_TWENTY: [
    "",
    "один",
    "два",
    "три",
    "чотири",
    "п’ять",
    "шість",
    "сім",
    "вісім",
    "дев’ять",
    "десять",
    "одинадцять",
    "дванадцять",
    "тринадцять",
    "чотирнадцять",
    "п’ятнадцять",
    "шістнадцять",
    "сімнадцять",
    "вісімнадцять",
    "дев’ятнадцять",
  ],
  TENS: [
    "",
    "",
    "двадцять",
    "тридцять",
    "сорок",
    "п’ятдесят",
    "шістдесят",
    "сімдесят",
    "вісімдесят",
    "дев’яносто",
  ],
  HUNDREDS: [
    "",
    "сто",
    "двісті",
    "триста",
    "чотириста",
    "п’ятсот",
    "шістсот",
    "сімсот",
    "вісімсот",
    "дев’ятсот",
  ],
  THOUSANDS: ["", "тисяча", "тисячі", "тисяч"],
  MILLIONS: ["", "мільйон", "мільйони", "мільйонів"],
  BILLIONS: ["", "мільярд", "мільярди", "мільярдів"],
  TRILLIONS: ["", "трильйон", "трильйони", "трильйонів"],
};

export const unitIndexToNumberGrades = [
  NUMBERS_VOCABULARY.THOUSANDS,
  NUMBERS_VOCABULARY.MILLIONS,
  NUMBERS_VOCABULARY.BILLIONS,
  NUMBERS_VOCABULARY.TRILLIONS,
];
