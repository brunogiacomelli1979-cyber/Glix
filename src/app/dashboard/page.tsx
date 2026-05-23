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

type DashboardSearchParams = Promise<{
  error?: string;
  success?: string;
  context?: string;
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

const contexts = Object.entries(contextLabels);

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

function getChartData(records: GlucoseRecord[]) {
  return [...records].sort(
    (a, b) => new Date(a.recorded_at).getTime() - new Date(b.recorded_at).getTime()
  );
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

  const width = 680;
  const height = 248;
  const padding = { top: 22, right: 20, bottom: 44, left: 58 };
  const values = chartRecords.map((record) => record.value_mgdl);
  const minValue = Math.max(0, Math.min(...values) - 20);
  const maxValue = Math.max(...values) + 20;
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  const valueRange = Math.max(1, maxValue - minValue);

  const points = chartRecords.map((record, index) => {
    const x =
      padding.left +
      (chartRecords.length === 1 ? chartWidth / 2 : (index / (chartRecords.length - 1)) * chartWidth);
    const y =
      padding.top + chartHeight - ((record.value_mgdl - minValue) / valueRange) * chartHeight;

    return {
      ...record,
      x,
      y,
      label: formatShortDate(record.recorded_at),
    };
  });

  const linePath = points.map((point) => `${point.x},${point.y}`).join(" ");
  const yTicks = [minValue, Math.round((minValue + maxValue) / 2), maxValue];

  return (
    <div className="overflow-x-auto rounded-2xl bg-white">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label="Gráfico de evolução da glicemia"
        className="min-w-[540px]"
      >
        {yTicks.map((tick) => {
          const y = padding.top + chartHeight - ((tick - minValue) / valueRange) * chartHeight;

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

        {points.length > 1 && (
          <polyline fill="none" stroke="#0f6f8f" strokeWidth="3" points={linePath} />
        )}

        {points.map((point, index) => (
          <g key={point.id}>
            <circle cx={point.x} cy={point.y} r="5" className="fill-[#0f6f8f]" />
            <text x={point.x} y={point.y - 10} textAnchor="middle" className="fill-[#082f49] text-xs">
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
        ))}
      </svg>
    </div>
  );
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

  let query = supabase
    .from("glucose_records")
    .select("id, value_mgdl, context, notes, recorded_at")
    .order("recorded_at", { ascending: false })
    .limit(30);

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
  const summaryCards = [
    {
      label: "Última medição",
      value: latest ? `${latest.value_mgdl}` : "--",
      unit: latest ? "mg/dL" : "",
      detail: latest ? formatDate(latest.recorded_at) : "Sem registros",
      featured: true,
    },
    {
      label: "Média",
      value: average ? `${average}` : "--",
      unit: average ? "mg/dL" : "",
      detail: "Filtro atual",
    },
    {
      label: "Menor",
      value: minValue ? `${minValue}` : "--",
      unit: minValue ? "mg/dL" : "",
      detail: "Período exibido",
    },
    {
      label: "Maior",
      value: maxValue ? `${maxValue}` : "--",
      unit: maxValue ? "mg/dL" : "",
      detail: "Período exibido",
    },
    {
      label: "Registros",
      value: records.length.toString(),
      unit: "",
      detail: "Últimos lançamentos",
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
                <CardDescription className={card.featured ? "text-white/75" : "text-[#607585]"}>
                  {card.label}
                </CardDescription>
                <CardTitle className={card.featured ? "text-3xl text-white" : "text-3xl text-[#062338]"}>
                  {card.value}
                  {card.unit && <span className="ml-1 text-sm font-medium opacity-80">{card.unit}</span>}
                </CardTitle>
                <p className={card.featured ? "text-xs text-white/75" : "text-xs text-[#7b8d98]"}>
                  {card.detail}
                </p>
              </CardHeader>
            </Card>
          ))}
        </section>

        <Card className="rounded-3xl border-[#d8edf4] bg-white/90 shadow-sm shadow-sky-950/5">
          <CardHeader>
            <CardTitle className="text-[#062338]">Evolução da glicemia</CardTitle>
            <CardDescription className="text-[#607585]">
              Registros em ordem cronológica, com valores em mg/dL.
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
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <CardTitle className="text-[#062338]">Histórico</CardTitle>
                  <CardDescription className="text-[#607585]">
                    Últimos {records.length} registros. {highCount} acima de 180 mg/dL.
                  </CardDescription>
                </div>
                <form className="flex w-full items-center gap-2 md:w-auto" action="/dashboard">
                  <select
                    name="context"
                    defaultValue={selectedContext}
                    className="h-10 flex-1 rounded-lg border border-[#cfe5ed] bg-white px-2 text-sm outline-none focus-visible:border-[#7cc8da] focus-visible:ring-3 focus-visible:ring-[#7cc8da]/30 md:flex-none"
                  >
                    <option value="todos">Todos</option>
                    {contexts.map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                  <Button type="submit" variant="outline" className="h-10 border-[#b8dce8] text-[#0f4864]">
                    Filtrar
                  </Button>
                </form>
              </div>
            </CardHeader>
            <CardContent>
              {records.length === 0 ? (
                <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-[#b8dce8] bg-[#f8fbfc] px-4 text-center">
                  <CalendarClock className="mb-3 size-8 text-[#8cb7c5]" />
                  <p className="font-medium text-[#082f49]">Nenhum registro encontrado</p>
                  <p className="mt-1 text-sm text-[#607585]">
                    Salve sua primeira medição para montar o histórico.
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
                          <p className="text-xs text-[#607585] md:hidden">
                            {formatDate(record.recorded_at)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#082f49]">
                            {contextLabels[record.context] ?? record.context}
                          </p>
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
                            className="text-[#607585] hover:bg-rose-50 hover:text-rose-700"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </form>
                      </div>
                      <details className="mt-3 rounded-xl bg-[#f8fbfc] px-3 py-2">
                        <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-medium text-[#0f6f8f]">
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
