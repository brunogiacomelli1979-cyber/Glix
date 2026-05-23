export type GlucoseContext =
  | "jejum"
  | "antes_refeicao"
  | "pos_refeicao"
  | "antes_dormir"
  | "outro";

export type PeriodFilter = "today" | "7d" | "30d" | "90d";

export type GlucoseBand = "low" | "normal" | "attention" | "high" | "empty";

export type GlucoseRecord = {
  id: string;
  value_mgdl: number;
  context: GlucoseContext;
  notes: string | null;
  recorded_at: string;
};

export type GlucoseStatus = {
  band: GlucoseBand;
  label: string;
  description: string;
  chip: string;
  dot: string;
  chart: string;
};

export type SummaryCard = {
  label: string;
  value: string;
  unit: string;
  detail: string;
  statusValue: number | null | undefined;
  featured?: boolean;
};

export type InsightCard = {
  label: string;
  value: string;
  detail: string;
};
