export type Item = {
    id: number;
    location: Array<number>;
    severity: Array<"high" | "medium" | "low">;
    estimated_fire_start_time: string;
    reported_time: string;
    deploy_time?: number;
    cost?: number;
  };
  