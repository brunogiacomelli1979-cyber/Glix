import Image from "next/image";
import { CalendarClock, Pencil, Plus, Save, Trash2 } from "lucide-react";

import { logout } from "@/app/auth/actions";
import {
  createGlucoseRecord,
  deleteGlucoseRecord,
  updateGlucoseRecord,
} from "@/app/dashboard/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/utils/supabase/server";

type PeriodFilter = "today" | "7d" | "30d" | "90d";

type DashboardSearchParams = Promise<{
  error?: string;
  success?: string;
  context?: string;
  period?: PeriodFilter;
}>;

type GlucoseRecord = {
  id: string;
  value_mgdl: number;
  context: string;
  notes: string | null;
  recorded_at: string;
};

const contextLabels: Record<string, string> = {
  jejum: "Jejum",
  antes_refeicao: "Antes da refeição",
  pos_refeicao: "Pós-refeição",
  antes_dormir: "Antes de dormir",
  outro: "Outro",
};

const periodLabels: Record<PeriodFilter, string> = {
  today: "Hoje",
  "7d": "7 dias",
  "30d": "30 dias",
  "90d": "90 dias",
};

const contexts = Object.entries(contextLabels);
const periods = Object.entries(periodLabels) as [PeriodFilter, string][];

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatShortDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
  }).format(new Date(value));
}

function formatDateTimeInput(value: string) {
  return new Date(value).toISOString().slice(0, 16);
}

function getPeriodStart(period: PeriodFilter) {
  const date = new Date();

  if (period === "today") {
    date.setHours(0, 0, 0, 0);
    return date.toISOString();
  }

  const days = period === "7d" ? 7 : period === "30d" ? 30 : 90;
  date.setDate(date.getDate() - days);
  return date.toISOString();
}

function getAverage(records: GlucoseRecord[]) {
  if (records.length === 0) {
    return null;
  }

  const total = records.reduce((sum, record) => sum + record.value_mgdl, 0);
  return Math.round(total / records.length);
}

function getMin(records: GlucoseRecord[]) {
  if (records.length === 0) {
    return null;
  }

  return Math.min(...records.map((record) => record.value_mgdl));
}

function getMax(records: GlucoseRecord[]) {
  if (records.length === 0) {
    return null;
  }

  return Math.max(...records.map((record) => record.value_mgdl));
}

function getGlucoseStatus(value?: number | null) {
  if (!value) {
    return {
      label: "Sem dados",
      description: "Aguardando registros",
      chip: "border-[#d8edf4] bg-white text-[#607585]",
      dot: "bg-[#94b8c5]",
      chart: "#94b8c5",
    };
  }

  if (value < 70) {
    return {
      label: "Baixa",
      description: "Abaixo de 70 mg/dL",
      chip: "border-sky-100 bg-sky-50 text-sky-700",
      dot: "bg-sky-500",
      chart: "#0ea5e9",
    };
  }

  if (value <= 140) {
    return {
      label: "Normal",
      description: "70 a 140 mg/dL",
      chip: "border-[#c7edf3] bg-[#eefaff] text-[#0f6f8f]",
      dot: "bg-[#0f6f8f]",
      chart: "#0f6f8f",
    };
  }

  if (value <= 180) {
    return {
      label: "Atenção",
      description: "141 a 180 mg/dL",
      chip: "border-amber-100 bg-amber-50 text-amber-700",
      dot: "bg-amber-500",
      chart: "#f59e0b",
    };
  }

  return {
    label: "Alta",
    description: "Acima de 180 mg/dL",
    chip: "border-rose-100 bg-rose-50 text-rose-700",
    dot: "bg-rose-500",
    chart: "#e11d48",
  };
}

function StatusBadge({ value }: { value?: number | null }) {
  const status = getGlucoseStatus(value);

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${status.chip}`}>
      <span className={`size-1.5 rounded-full ${status.dot}`} />
      {status.label}
    </span>
  );
}

function getChartData(records: GlucoseRecord[]) {
  return [...records].sort(
    (a, b) => new Date(a.recorded_at).getTime() - new Date(b.recorded_at).getTime()
  );
}

function getSmoothPath(points: { x: number; y: number }[]) {
  if (points.length === 0) {
    return "";
  }

  if (points.length === 1) {
    return `M ${points[0].x} ${points[0].y}`;
  }

  return points.reduce((path, point, index) => {
    if (index === 0) {
      return `M ${point.x} ${point.y}`;
    }

    const previous = points[index - 1];
    const controlX = (previous.x + point.x) / 2;
    return `${path} C ${controlX} ${previous.y}, ${controlX} ${point.y}, ${point.x} ${point.y}`;
  }, "");
}

function GlucoseChart({ records }: { records: GlucoseRecord[] }) {
  const chartRecords = getChartData(records);

  if (chartRecords.length === 0) {
    return (
      <div className="flex h-56 items-center justify-center rounded-2xl border border-dashed border-[#b8dce8] bg-[#f8fbfc] px-4 text-center text-sm text-[#607585]">
        O gráfico aparece depois do primeiro registro.
      </div>
    );
  }

  const width = 700;
  const height = 272;
  const padding = { top: 24, right: 22, bottom: 48, left: 60 };
  const values = chartRecords.map((record) => record.value_mgdl);
  const minValue = Math.max(0, Math.min(...values, 70) - 20);
  const maxValue = Math.max(...values, 180) + 20;
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  const valueRange = Math.max(1, maxValue - minValue);
  const peak = Math.max(...values);

  function getY(value: number) {
    return padding.top + chartHeight - ((value - minValue) / valueRange) * chartHeight;
  }

  const points = chartRecords.map((record, index) => {
    const x =
      padding.left +
      (chartRecords.length === 1 ? chartWidth / 2 : (index / (chartRecords.length - 1)) * chartWidth);
    const y = getY(record.value_mgdl);

    return {
      ...record,
      x,
      y,
      label: formatShortDate(record.recorded_at),
      status: getGlucoseStatus(record.value_mgdl),
    };
  });

  const yTicks = [minValue, 70, 140, 180, maxValue].filter(
    (tick, index, list) => list.indexOf(tick) === index && tick >= minValue && tick <= maxValue
  );
  const path = getSmoothPath(points);
  const bands = [
    { from: minValue, to: 70, color: "#eff8ff" },
    { from: 70, to: 140, color: "#eefaff" },
    { from: 140, to: 180, color: "#fffbeb" },
    { from: 180, to: maxValue, color: "#fff1f2" },
  ].filter((band) => band.to > minValue && band.from < maxValue);

  return (
    <div className="overflow-x-auto rounded-2xl bg-white">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label="Gráfico de evolução da glicemia"
        className="min-w-[560px]"
      >
        {bands.map((band) => {
          const yTop = getY(Math.min(band.to, maxValue));
          const yBottom = getY(Math.max(band.from, minValue));
          return (
            <rect
              key={`${band.from}-${band.to}`}
              x={padding.left}
              y={yTop}
              width={chartWidth}
              height={Math.max(0, yBottom - yTop)}
              fill={band.color}
            />
          );
        })}

        {yTicks.map((tick) => {
          const y = getY(tick);

          return (
            <g key={tick}>
              <line
                x1={padding.left}
                x2={width - padding.right}
                y1={y}
                y2={y}
                stroke="#d8edf4"
              />
              <text x={10} y={y + 4} className="fill-[#607585] text-xs">
                {tick} mg/dL
              </text>
            </g>
          );
        })}

        <line
          x1={padding.left}
          x2={padding.left}
          y1={padding.top}
          y2={height - padding.bottom}
          stroke="#94b8c5"
        />
        <line
          x1={padding.left}
          x2={width - padding.right}
          y1={height - padding.bottom}
          y2={height - padding.bottom}
          stroke="#94b8c5"
        />

        {points.length > 1 && <path d={path} fill="none" stroke="#0f6f8f" strokeWidth="3" />}

        {points.map((point, index) => {
          const isPeak = point.value_mgdl === peak && points.length > 1;

          return (
            <g key={point.id}>
              <title>
                {`${formatDate(point.recorded_at)} - ${point.value_mgdl} mg/dL (${point.status.label})`}
              </title>
              {isPeak && (
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="9"
                  fill="none"
                  stroke={point.status.chart}
                  strokeOpacity="0.28"
                  strokeWidth="5"
                />
              )}
              <circle cx={point.x} cy={point.y} r="5" fill={point.status.chart} />
              <text x={point.x} y={point.y - 12} textAnchor="middle" className="fill-[#082f49] text-xs">
                {point.value_mgdl}
              </text>
              {(index === 0 || index === points.length - 1 || points.length <= 6) && (
                <text
                  x={point.x}
                  y={height - 18}
                  textAnchor="middle"
                  className="fill-[#607585] text-xs"
                >
                  {point.label}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function getTrend(records: GlucoseRecord[]) {
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

function getStability(records: GlucoseRecord[]) {
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

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: DashboardSearchParams;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const selectedContext = params.context ?? "todos";
  const selectedPeriod: PeriodFilter = params.period && params.period in periodLabels ? params.period : "30d";

  let query = supabase
    .from("glucose_records")
    .select("id, value_mgdl, context, notes, recorded_at")
    .gte("recorded_at", getPeriodStart(selectedPeriod))
    .order("recorded_at", { ascending: false })
    .limit(90);

  if (selectedContext !== "todos") {
    query = query.eq("context", selectedContext);
  }

  const { data, error } = await query;
  const records = (data ?? []) as GlucoseRecord[];
  const average = getAverage(records);
  const minValue = getMin(records);
  const maxValue = getMax(records);
  const latest = records[0];
  const highCount = records.filter((record) => record.value_mgdl > 180).length;
  const normalCount = records.filter((record) => {
    return record.value_mgdl >= 70 && record.value_mgdl <= 140;
  }).length;
  const normalPercent = records.length > 0 ? Math.round((normalCount / records.length) * 100) : 0;
  const summaryCards = [
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
  const insights = [
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

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#eefaff_0%,#f8fbfc_42%,#ffffff_100%)] text-[#082f49]">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-4 pb-[calc(2rem+env(safe-area-inset-bottom))] sm:gap-6 sm:px-8 sm:py-6">
        <header className="rounded-3xl border border-[#d8edf4] bg-white/80 px-4 py-4 shadow-sm shadow-sky-950/5 backdrop-blur sm:px-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-3">
                <Image
                  src="/branding/glix-logo-main.png"
                  alt="Glix"
                  width={48}
                  height={48}
                  className="size-12 rounded-2xl object-contain"
                  priority
                />
                <div>
                  <p className="text-xs font-semibold uppercase text-[#0f7897]">Glix</p>
                  <h1 className="text-2xl font-semibold tracking-tight text-[#062338]">
                    Painel de glicemia
                  </h1>
                </div>
              </div>
              <p className="mt-3 truncate text-sm text-[#607585]">
                Conta conectada: <span className="font-medium text-[#0f4864]">{user?.email}</span>
              </p>
            </div>
            <form action={logout}>
              <Button
                variant="outline"
                type="submit"
                className="h-9 border-[#b8dce8] bg-white/70 text-[#0f4864]"
              >
                Sair
              </Button>
            </form>
          </div>
        </header>

        <form
          action="/dashboard"
          className="grid gap-3 rounded-3xl border border-[#d8edf4] bg-white/85 p-3 shadow-sm shadow-sky-950/5 sm:grid-cols-[1fr_1fr_auto]"
        >
          <select
            name="period"
            defaultValue={selectedPeriod}
            aria-label="Filtrar por período"
            className="h-11 rounded-2xl border border-[#cfe5ed] bg-white px-3 text-sm outline-none focus-visible:border-[#7cc8da] focus-visible:ring-3 focus-visible:ring-[#7cc8da]/30"
          >
            {periods.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <select
            name="context"
            defaultValue={selectedContext}
            aria-label="Filtrar por contexto"
            className="h-11 rounded-2xl border border-[#cfe5ed] bg-white px-3 text-sm outline-none focus-visible:border-[#7cc8da] focus-visible:ring-3 focus-visible:ring-[#7cc8da]/30"
          >
            <option value="todos">Todos os contextos</option>
            {contexts.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <Button type="submit" className="h-11 bg-[#0f6f8f] text-white hover:bg-[#0b5f7b]">
            Aplicar filtros
          </Button>
        </form>

        {(params.error || params.success || error) && (
          <div
            className={`rounded-2xl border px-4 py-3 text-sm ${
              params.success
                ? "border-[#c7edf3] bg-[#eefaff] text-[#0f6f8f]"
                : "border-rose-100 bg-rose-50 text-rose-700"
            }`}
          >
            {params.success ?? params.error ?? error?.message}
          </div>
        )}

        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {summaryCards.map((card) => (
            <Card
              key={card.label}
              className={`rounded-2xl border-[#d8edf4] shadow-sm shadow-sky-950/5 ${
                card.featured ? "bg-[#0f6f8f] text-white" : "bg-white/90"
              }`}
            >
              <CardHeader className="gap-2">
                <div className="flex items-start justify-between gap-2">
                  <CardDescription className={card.featured ? "text-white/75" : "text-[#607585]"}>
                    {card.label}
                  </CardDescription>
                  {!card.featured && <StatusBadge value={card.statusValue} />}
                </div>
                <CardTitle className={card.featured ? "text-3xl text-white" : "text-3xl text-[#062338]"}>
                  {card.value}
                  {card.unit && <span className="ml-1 text-sm font-medium opacity-80">{card.unit}</span>}
                </CardTitle>
                <div className="flex flex-wrap items-center gap-2">
                  <p className={card.featured ? "text-xs text-white/75" : "text-xs text-[#7b8d98]"}>
                    {card.detail}
                  </p>
                  {card.featured && <StatusBadge value={card.statusValue} />}
                </div>
              </CardHeader>
            </Card>
          ))}
        </section>

        <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {insights.map((insight) => (
            <Card key={insight.label} className="rounded-2xl border-[#d8edf4] bg-white/90 shadow-sm shadow-sky-950/5">
              <CardHeader className="gap-2">
                <CardDescription className="text-[#607585]">{insight.label}</CardDescription>
                <CardTitle className="text-xl text-[#062338]">{insight.value}</CardTitle>
                <p className="text-xs leading-5 text-[#7b8d98]">{insight.detail}</p>
              </CardHeader>
            </Card>
          ))}
        </section>

        <Card className="rounded-3xl border-[#d8edf4] bg-white/90 shadow-sm shadow-sky-950/5">
          <CardHeader>
            <CardTitle className="text-[#062338]">Evolução da glicemia</CardTitle>
            <CardDescription className="text-[#607585]">
              Pontos coloridos por faixa, com destaque para picos do período.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <GlucoseChart records={records} />
          </CardContent>
        </Card>

        <section className="grid gap-4 lg:grid-cols-[380px_1fr] lg:gap-6">
          <Card className="rounded-3xl border-[#d8edf4] bg-white/90 shadow-sm shadow-sky-950/5">
            <CardHeader>
              <CardTitle className="text-[#062338]">Nova medição</CardTitle>
              <CardDescription className="text-[#607585]">
                Adicione um registro ao seu diário.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form action={createGlucoseRecord} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="value_mgdl">Glicemia (mg/dL)</Label>
                  <Input
                    id="value_mgdl"
                    name="value_mgdl"
                    type="number"
                    min="1"
                    max="1499"
                    placeholder="Ex.: 112"
                    className="h-11 border-[#cfe5ed] bg-white text-base"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="context">Contexto</Label>
                  <select
                    id="context"
                    name="context"
                    required
                    className="h-11 w-full rounded-lg border border-[#cfe5ed] bg-white px-2.5 text-base outline-none focus-visible:border-[#7cc8da] focus-visible:ring-3 focus-visible:ring-[#7cc8da]/30"
                    defaultValue="jejum"
                  >
                    {contexts.map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="recorded_at">Data e horário</Label>
                  <Input
                    id="recorded_at"
                    name="recorded_at"
                    type="datetime-local"
                    className="h-11 border-[#cfe5ed] bg-white text-base"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Observações</Label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows={4}
                    placeholder="Ex.: caminhada depois do almoço"
                    className="w-full resize-none rounded-lg border border-[#cfe5ed] bg-white px-2.5 py-2 text-base outline-none placeholder:text-muted-foreground focus-visible:border-[#7cc8da] focus-visible:ring-3 focus-visible:ring-[#7cc8da]/30"
                  />
                </div>
                <Button type="submit" size="lg" className="h-12 w-full bg-[#0f6f8f] text-white hover:bg-[#0b5f7b]">
                  <Plus className="size-4" />
                  Salvar registro
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-[#d8edf4] bg-white/90 shadow-sm shadow-sky-950/5">
            <CardHeader>
              <div>
                <CardTitle className="text-[#062338]">Histórico</CardTitle>
                <CardDescription className="text-[#607585]">
                  {records.length} registros no filtro atual. {highCount} acima de 180 mg/dL.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              {records.length === 0 ? (
                <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-[#b8dce8] bg-[#f8fbfc] px-4 text-center">
                  <CalendarClock className="mb-3 size-8 text-[#8cb7c5]" />
                  <p className="font-medium text-[#082f49]">Nenhum registro encontrado</p>
                  <p className="mt-1 text-sm text-[#607585]">
                    Ajuste os filtros ou salve uma nova medição.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="hidden rounded-xl bg-[#f3fbfd] px-4 py-3 text-xs font-semibold uppercase text-[#607585] md:grid md:grid-cols-[140px_1fr_140px_auto] md:gap-3">
                    <span>Valor</span>
                    <span>Contexto</span>
                    <span>Quando</span>
                    <span>Ações</span>
                  </div>
                  {records.map((record) => (
                    <article
                      key={record.id}
                      className="rounded-2xl border border-[#e3f1f5] bg-white px-4 py-4 shadow-sm shadow-sky-950/5"
                    >
                      <div className="grid grid-cols-[1fr_auto] items-start gap-3 md:grid-cols-[140px_1fr_140px_auto]">
                        <div>
                          <p className="text-lg font-semibold text-[#062338]">{record.value_mgdl} mg/dL</p>
                          <div className="mt-2 md:hidden">
                            <StatusBadge value={record.value_mgdl} />
                          </div>
                          <p className="mt-1 text-xs text-[#607585] md:hidden">
                            {formatDate(record.recorded_at)}
                          </p>
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-sm font-medium text-[#082f49]">
                              {contextLabels[record.context] ?? record.context}
                            </p>
                            <span className="hidden md:inline-flex">
                              <StatusBadge value={record.value_mgdl} />
                            </span>
                          </div>
                          {record.notes && (
                            <p className="mt-1 line-clamp-2 text-xs leading-5 text-[#607585] md:line-clamp-1">
                              {record.notes}
                            </p>
                          )}
                        </div>
                        <p className="hidden text-sm text-[#607585] md:block">
                          {formatDate(record.recorded_at)}
                        </p>
                        <form action={deleteGlucoseRecord}>
                          <input type="hidden" name="id" value={record.id} />
                          <Button
                            type="submit"
                            variant="ghost"
                            size="icon"
                            aria-label="Remover registro"
                            className="size-10 text-[#607585] hover:bg-rose-50 hover:text-rose-700"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </form>
                      </div>
                      <details className="mt-3 rounded-xl bg-[#f8fbfc] px-3 py-2">
                        <summary className="flex min-h-10 cursor-pointer list-none items-center gap-2 text-sm font-medium text-[#0f6f8f]">
                          <Pencil className="size-4" />
                          Editar registro
                        </summary>
                        <form action={updateGlucoseRecord} className="mt-4 grid gap-3 md:grid-cols-2">
                          <input type="hidden" name="id" value={record.id} />
                          <div className="space-y-2">
                            <Label htmlFor={`value-${record.id}`}>Glicemia (mg/dL)</Label>
                            <Input
                              id={`value-${record.id}`}
                              name="value_mgdl"
                              type="number"
                              min="1"
                              max="1499"
                              defaultValue={record.value_mgdl}
                              className="h-10 border-[#cfe5ed] bg-white"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`context-${record.id}`}>Contexto</Label>
                            <select
                              id={`context-${record.id}`}
                              name="context"
                              required
                              className="h-10 w-full rounded-lg border border-[#cfe5ed] bg-white px-2.5 text-sm outline-none focus-visible:border-[#7cc8da] focus-visible:ring-3 focus-visible:ring-[#7cc8da]/30"
                              defaultValue={record.context}
                            >
                              {contexts.map(([value, label]) => (
                                <option key={value} value={value}>
                                  {label}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`recorded-${record.id}`}>Data e horário</Label>
                            <Input
                              id={`recorded-${record.id}`}
                              name="recorded_at"
                              type="datetime-local"
                              defaultValue={formatDateTimeInput(record.recorded_at)}
                              className="h-10 border-[#cfe5ed] bg-white"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`notes-${record.id}`}>Observações</Label>
                            <textarea
                              id={`notes-${record.id}`}
                              name="notes"
                              rows={3}
                              defaultValue={record.notes ?? ""}
                              className="w-full resize-none rounded-lg border border-[#cfe5ed] bg-white px-2.5 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-[#7cc8da] focus-visible:ring-3 focus-visible:ring-[#7cc8da]/30"
                            />
                          </div>
                          <Button type="submit" className="bg-[#0f6f8f] text-white hover:bg-[#0b5f7b] md:col-span-2">
                            <Save className="size-4" />
                            Salvar alterações
                          </Button>
                        </form>
                      </details>
                    </article>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        <section className="rounded-2xl border border-[#d8edf4] bg-white/80 px-4 py-3 text-sm leading-6 text-[#607585]">
          O Glix não realiza diagnóstico médico. Use os registros como apoio para organizar sua
          rotina e conversar com profissionais de saúde.
        </section>
      </div>
    </main>
  );
}
