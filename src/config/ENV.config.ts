import { STRING } from "@/constants/string";
import type { EnvironmentType } from "@/types/pdf/EnvironmentType";
import { ENVIRONMENT_MODE } from "@/constants/ENVIRONMENT_MODE.enum";

export const ENV_CONFIG: Record<ENVIRONMENT_MODE, EnvironmentType> = {
  [ENVIRONMENT_MODE.PRODUCTION]: {
    apiUrl: `${import.meta.env.VITE_PROD_API_URL}/tenders`,
    defaultQrLink: import.meta.env.VITE_PROD_DEFAULT_QR_LINK || "prozorro.gov.ua",
    staticDataUrl: import.meta.env.VITE_PROD_STATIC_DATA || STRING.EMPTY,
    conclusion: {
      xDate: import.meta.env.VITE_PROD_CONCLUSION_X_DATE || STRING.EMPTY,
      yDate: import.meta.env.VITE_PROD_CONCLUSION_Y_DATE || STRING.EMPTY,
    },
  },
  [ENVIRONMENT_MODE.STAGING]: {
    apiUrl: `${import.meta.env.VITE_ST_API_URL}/tenders`,
    defaultQrLink: import.meta.env.VITE_ST_DEFAULT_QR_LINK,
    staticDataUrl: import.meta.env.VITE_ST_STATIC_DATA || STRING.EMPTY,
    conclusion: {
      xDate: import.meta.env.VITE_ST_CONCLUSION_X_DATE || STRING.EMPTY,
      yDate: import.meta.env.VITE_ST_CONCLUSION_Y_DATE || STRING.EMPTY,
    },
  },
  [ENVIRONMENT_MODE.SANDBOX]: {
    apiUrl: `${import.meta.env.VITE_SB_API_URL}/tenders`,
    defaultQrLink: import.meta.env.VITE_SB_DEFAULT_QR_LINK,
    staticDataUrl: import.meta.env.VITE_SB_STATIC_DATA || STRING.EMPTY,
    conclusion: {
      xDate: import.meta.env.VITE_SB_CONCLUSION_X_DATE || STRING.EMPTY,
      yDate: import.meta.env.VITE_SB_CONCLUSION_Y_DATE || STRING.EMPTY,
    },
  },
};
