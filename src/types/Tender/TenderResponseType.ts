import type { AxiosResponse } from "axios";
import type { TenderType } from "@/types/Tender/TenderType";

export type TenderResponseType = AxiosResponse<{ data: TenderType }>;
