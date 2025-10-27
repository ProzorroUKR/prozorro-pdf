export const REGEX = {
  FILE: {
    TYPE: {
      AUDIT: /^audit_.+\.yaml$/i,
      INVOICE: /(?<type>XML|KVT)\.p7s/,
    },
  },
  STRING: {
    BASE64_DESCRIPTION: /data:(.*?)base64,/,
  },
  NUMBER: {
    EIGHT_SYMBOLS: /^\d{8}$/,
  },
} as const;
