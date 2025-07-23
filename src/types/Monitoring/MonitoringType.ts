import type { ConclusionType } from "@/types/Monitoring/ConclusionType";

export type MonitoringType = {
  tender_id: string;
  monitoring_id: string;
  status: string;
  reasons: string[];
  conclusion?: ConclusionType;
};
