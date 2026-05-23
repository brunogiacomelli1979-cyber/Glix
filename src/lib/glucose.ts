import type {
  GlucoseContext,
  GlucoseRecord,
  GlucoseStatus,
  InsightCard,
  PeriodFilter,
  SummaryCard,
} from "@/types/glucose";

export const GLUCOSE_MIN_VALUE = 20;
export const GLUCOSE_MAX_VALUE = 600;
export const NOTES_MAX_LENGTH = 300;

export const contextLabels: Record<GlucoseContext, string> = {
  jejum: "Jejum",
  antes_refeicao: "Antes da refeição",
  pos_refeicao: "Pós-refeição",
  antes_dormir: "Antes de dormir",
  outro: "Outro",
};

export const periodLabels: Record<PeriodFilter, string> = {
  today: "Hoje",
  "7d": "7 dias",
  "30d": "30 dias",
  "90d": "90 dias",
};

export const contexts = Object.entries(contextLabels) as [GlucoseContext, string][];
export const periods = Object.entries(periodLabels) as [PeriodFilter, string][];

const validContexts = new Set<GlucoseContext>(Object.keys(contextLabels) as GlucoseContext[]);

export function isGlucoseContext(value: string): value is GlucoseContext {
  return validContexts.has(value as GlucoseContext);
}

export function isPeriodFilter(value: string | undefined): value is PeriodFilter {
  return Boolean(value && value in periodLabels);
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function formatShortDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
  }).format(new Date(value));
}

export function formatDateTimeInput(value: string) {
  return new Date(value).toISOString().slice(0, 16);
}

export function getPeriodStart(period: PeriodFilter) {
  const date = new Date();

  if (period === "today") {
    date.setHours(0, 0, 0, 0);
    return date.toISOString();
  }

  const days = period === "7d" ? 7 : period === "30d" ? 30 : 90;
  date.setDate(date.getDate() - days);
  return date.toISOString();
}

export function getAverage(records: GlucoseRecord[]) {
  if (records.length === 0) {
    return null;
  }

  const total = records.reduce((sum, record) => sum + record.value_mgdl, 0);
  return Math.round(total / records.length);
}

export function getMin(records: GlucoseRecord[]) {
  if (records.length === 0) {
    return null;
  }

  return Math.min(...records.map((record) => record.value_mgdl));
}

export function getMax(records: GlucoseRecord[]) {
  if (records.length === 0) {
    return null;
  }

  return Math.max(...records.map((record) => record.value_mgdl));
}

export function getGlucoseStatus(value?: number | null): GlucoseStatus {
  if (!value) {
    return {
      band: "empty",
      label: "Sem dados",
      description: "Aguardando registros",
      chip: "border-[#d8edf4] bg-white text-[#607585]",
      dot: "bg-[#94b8c5]",
      chart: "#94b8c5",
    };
  }

  if (value < 70) {
    return {
      band: "low",
      label: "Baixa",
      description: "Abaixo de 70 mg/dL",
      chip: "border-sky-100 bg-sky-50 text-sky-700",
      dot: "bg-sky-500",
      chart: "#0ea5e9",
    };
  }

  if (value <= 140) {
    return {
      band: "normal",
      label: "Normal",
      description: "70 a 140 mg/dL",
      chip: "border-[#c7edf3] bg-[#eefaff] text-[#0f6f8f]",
      dot: "bg-[#0f6f8f]",
      chart: "#0f6f8f",
    };
  }

  if (value <= 180) {
    return {
      band: "attention",
      label: "Atenção",
      description: "141 a 180 mg/dL",
      chip: "border-amber-100 bg-amber-50 text-amber-700",
      dot: "bg-amber-500",
      chart: "#f59e0b",
    };
  }

  return {
    band: "high",
    label: "Alta",
    description: "Acima de 180 mg/dL",
    chip: "border-rose-100 bg-rose-50 text-rose-700",
    dot: "bg-rose-500",
    chart: "#e11d48",
  };
}

export function getChartData(records: GlucoseRecord[]) {
  return [...records].sort(
    (a, b) => new Date(a.recorded_at).getTime() - new Date(b.recorded_at).getTime()
  );
}

export function getTrend(records: GlucoseRecord[]) {
  const ordered = getChartData(records);

  if (ordered.length < 2) {
    return "Dados insuficientes";
  }

  const first = ordered[0].value_mgdl;
  const last = ordered[ordered.length - 1].value_mgdl;
  const diff = last - first;

  if (Math.abs(diff) <= 10) {
    return "Tendência estável";
  }

  return diff > 0 ? "Tendência de alta" : "Tendência de queda";
}

export function getStability(records: GlucoseRecord[]) {
  if (records.length < 3) {
    return "Aguardando mais registros";
  }

  const values = records.map((record) => record.value_mgdl);
  const range = Math.max(...values) - Math.min(...values);

  if (range <= 30) {
    return "Boa estabilidade";
  }

  if (range <= 70) {
    return "Variação moderada";
  }

  return "Variação ampla";
}

export function getDashboardMetrics(records: GlucoseRecord[], selectedPeriod: PeriodFilter) {
  const average = getAverage(records);
  const minValue = getMin(records);
  const maxValue = getMax(records);
  const latest = records[0];
  const highCount = records.filter((record) => record.value_mgdl > 180).length;
  const normalCount = records.filter((record) => {
    return record.value_mgdl >= 70 && record.value_mgdl <= 140;
  }).length;
  const normalPercent = records.length > 0 ? Math.round((normalCount / records.length) * 100) : 0;

  const summaryCards: SummaryCard[] = [
    {
      label: "Última medição",
      value: latest ? `${latest.value_mgdl}` : "--",
      unit: latest ? "mg/dL" : "",
      detail: latest ? formatDate(latest.recorded_at) : "Sem registros",
      statusValue: latest?.value_mgdl,
      featured: true,
    },
    {
      label: "Média",
      value: average ? `${average}` : "--",
      unit: average ? "mg/dL" : "",
      detail: periodLabels[selectedPeriod],
      statusValue: average,
    },
    {
      label: "Menor",
      value: minValue ? `${minValue}` : "--",
      unit: minValue ? "mg/dL" : "",
      detail: "Período exibido",
      statusValue: minValue,
    },
    {
      label: "Maior",
      value: maxValue ? `${maxValue}` : "--",
      unit: maxValue ? "mg/dL" : "",
      detail: "Período exibido",
      statusValue: maxValue,
    },
    {
      label: "Registros",
      value: records.length.toString(),
      unit: "",
      detail: "Lançamentos filtrados",
      statusValue: null,
    },
  ];

  const insights: InsightCard[] = [
    {
      label: "Média do período",
      value: average ? `${average} mg/dL` : "--",
      detail: average ? getGlucoseStatus(average).description : "Sem registros no filtro atual",
    },
    {
      label: "Registros altos",
      value: highCount.toString(),
      detail: "Acima de 180 mg/dL",
    },
    {
      label: "Tendência",
      value: getTrend(records),
      detail: "Comparação entre primeiro e último registro",
    },
    {
      label: "Estabilidade",
      value: getStability(records),
      detail: `${normalPercent}% na faixa normal`,
    },
  ];

  return {
    average,
    highCount,
    insights,
    summaryCards,
  };
}

export type ParsedGlucoseForm = {
  value_mgdl: number;
  context: GlucoseContext;
  recorded_at: string;
  notes: string | null;
};

export function parseGlucoseFormData(formData: FormData): { data?: ParsedGlucoseForm; error?: string } {
  const rawValue = formData.get("value_mgdl");
  const rawContext = String(formData.get("context") ?? "");
  const rawRecordedAt = String(formData.get("recorded_at") ?? "");
  const notes = String(formData.get("notes") ?? "").trim();
  const value = Number(rawValue);

  if (rawValue === null || rawValue === "" || rawContext === "") {
    return { error: "Preencha os campos obrigatórios." };
  }

  if (!Number.isInteger(value) || value < GLUCOSE_MIN_VALUE || value > GLUCOSE_MAX_VALUE) {
    return {
      error: `Informe uma glicemia entre ${GLUCOSE_MIN_VALUE} e ${GLUCOSE_MAX_VALUE} mg/dL.`,
    };
  }

  if (!isGlucoseContext(rawContext)) {
    return { error: "Selecione um contexto válido." };
  }

  if (notes.length > NOTES_MAX_LENGTH) {
    return { error: `Observações devem ter no máximo ${NOTES_MAX_LENGTH} caracteres.` };
  }

  const recordedAt = rawRecordedAt ? new Date(rawRecordedAt) : new Date();

  if (Number.isNaN(recordedAt.getTime())) {
    return { error: "Informe uma data válida." };
  }

  return {
    data: {
      value_mgdl: value,
      context: rawContext,
      recorded_at: recordedAt.toISOString(),
      notes: notes || null,
    },
  };
}
