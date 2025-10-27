import { MILESTONE_TYPE } from "@/constants/tender/milestones";

export const DURATION_TYPE: Record<MILESTONE_TYPE, string> = {
  [MILESTONE_TYPE.WORKING]: "Робочі",
  [MILESTONE_TYPE.BANKING]: "Банківські",
  [MILESTONE_TYPE.CALENDAR]: "Календарні",
};
