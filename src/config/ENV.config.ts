import type { EnvironmentType } from "@/types/pdf/EnvironmentType";
import type { EnvironmentModeType } from "@/types/pdf/EnvironmentModeType.ts";
import { STRING } from "@/constants/string";

export const ENV_CONFIG: Record<EnvironmentModeType, EnvironmentType> = {
  production: {
    apiUrl: `${import.meta.env.VITE_PROD_API_URL}/tenders`,
    defaultQrLink: import.meta.env.VITE_PROD_DEFAULT_QR_LINK || "prozorro.gov.ua",
    staticDataUrl: import.meta.env.VITE_PROD_STATIC_DATA || STRING.EMPTY,
    conclusion: {
      xDate: import.meta.env.VITE_PROD_CONCLUSION_X_DATE || STRING.EMPTY,
      yDate: import.meta.env.VITE_PROD_CONCLUSION_Y_DATE || STRING.EMPTY,
    },
  },
  development: {
    apiUrl: `${import.meta.env.VITE_DEV_API_URL}/tenders`,
    defaultQrLink: import.meta.env.VITE_DEV_DEFAULT_QR_LINK,
    staticDataUrl: import.meta.env.VITE_DEV_STATIC_DATA || STRING.EMPTY,
    conclusion: {
      xDate: import.meta.env.VITE_DEV_CONCLUSION_X_DATE || STRING.EMPTY,
      yDate: import.meta.env.VITE_DEV_CONCLUSION_Y_DATE || STRING.EMPTY,
    },
  },
};
