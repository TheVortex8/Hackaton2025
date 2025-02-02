
export type MappedItem = {
    id: number;
    location: Array<number>;
    severity: Array<"high" | "medium" | "low">;
    estFireStartTime: string;
    timeOfReport: string;
    estFireDelayTime: number;
    estCost: number;
  };