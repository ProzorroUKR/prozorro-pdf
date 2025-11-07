import { ENVIRONMENT_MODE } from "@/constants/ENVIRONMENT_MODE.enum.ts";

export const edsModeMap = new Map<ENVIRONMENT_MODE, "development" | "production">()
  .set(ENVIRONMENT_MODE.SANDBOX, "development")
  .set(ENVIRONMENT_MODE.STAGING, "development")
  .set(ENVIRONMENT_MODE.PRODUCTION, "production");
