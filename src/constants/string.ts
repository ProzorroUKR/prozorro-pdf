export const STRING = {
  EMPTY: "",
  DOT: ".",
  COMMA: ",",
  MINUS: "-",
  DASH: "—",
  EXTRA_LONG_DASH: "⸺",
  UNDERSCORE: "_",
  SEMICOLON: ";",
  WHITESPACE: " ",
  DELIMITER: {
    DOT: ". ",
    COMMA: ", ",
    DOT_NEW_LINE: ".\n",
    NEW_LINE: "\n",
    DOUBLE_NEWLINE: "\n\n",
  },
  DISC: "•",
  PERCENT: "%",
} as const;

export const DEFAULT_TEXT_FIELDS: Record<string, string> = {
  SPACE: STRING.EMPTY,
  SPACE_LARGE: "   ",
  UNDERSCORES_3: "___", // 3 underscores
  UNDERSCORES_16: "________________", // 16 underscores
  UNDERSCORES_32: "________________________________", // 32 underscores
  UNDERSCORES_40: "________________________________________", // 40 underscores
  UNDERSCORES_68: "____________________________________________________________________", // 68 underscores
  SIGNATURE: "_________________/ _______________",
  DEFAULT_PRICE:
    "______________________ гривень без ПДВ/з ПДВ (_____________ __________________________________________сума прописом).",
};

export const CLASSIFICATION_CONSTANTS: { readonly [index: string]: string } = {
  DK021: "ДК021",
  CPV: "CPV",
};
export const ESCO_TYPE = "esco";
export const SIGNATURE_FILE_NAME = "sign.p7s";
