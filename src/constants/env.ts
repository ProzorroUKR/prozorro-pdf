import { STRING } from "@/constants/string.ts";

export const API_TENDER_URL = `${import.meta.env.VITE_API_URL}/tenders`;
export const DEFAULT_QR_LINK = import.meta.env.VITE_DEFAULT_QR_LINK;
export const CONCLUSION_Y_DATE = import.meta.env.VITE_CONCLUSION_Y_DATE || STRING.EMPTY;
export const CONCLUSION_X_DATE = import.meta.env.VITE_CONCLUSION_X_DATE || STRING.EMPTY;
export const STATIC_DATA_URL = import.meta.env.VITE_STATIC_DATA || STRING.EMPTY;
