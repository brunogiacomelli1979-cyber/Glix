import Link from "next/link";

import { FloatingRegisterButton } from "@/components/app/floating-register-button";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { GlucoseChart } from "@/components/dashboard/glucose-chart";
import { InsightCards } from "@/components/dashboard/insight-cards";
import { SummaryCards } from "@/components/dashboard/summary-cards";
import {
  formatDate,
  getAverage,
  getGlucoseStatus,
  getMax,
  getMin,
  getPeriodStart,
  getTrend,
} from "@/lib/glucose";
import type { GlucoseRecord, InsightCard, SummaryCard } from "@/types/glucose";
import { createClient } from "@/utils/supabase/server";

type DashboardSearchParams = Promise<{
  error?: string;
  success?: string;
}>;

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

  const [periodResult, latestResult, profileResult] = await Promise.all([
    supabase
      .from("glucose_records")
      .select("id, value_mgdl, context, notes, recorded_at")
      .gte("recorded_at", getPeriodStart("7d"))
      .order("recorded_at", { ascending: false })
      .limit(30),
    supabase
      .from("glucose_records")
      .select("id, value_mgdl, context, notes, recorded_at")
      .order("recorded_at", { ascending: false })
      .limit(1),
    supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user?.id ?? "")
      .maybeSingle<{ full_name: string | null }>(),
  ]);

  const records = (periodResult.data ?? []) as GlucoseRecord[];
  const latest = (latestResult.data?.[0] ?? null) as GlucoseRecord | null;
  const average = getAverage(records);
  const minValue = getMin(records);
  const maxValue = getMax(records);
  const highCount = records.filter((record) => record.value_mgdl > 180).length;

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
      detail: "Últimos 7 dias",
      statusValue: average,
    },
    {
      label: "Menor",
      value: minValue ? `${minValue}` : "--",
      unit: minValue ? "mg/dL" : "",
      detail: "Últimos 7 dias",
      statusValue: minValue,
    },
    {
      label: "Maior",
      value: maxValue ? `${maxValue}` : "--",
      unit: maxValue ? "mg/dL" : "",
      detail: "Últimos 7 dias",
      statusValue: maxValue,
    },
  ];

  const insightDetail =
    records.length === 0
      ? "Registre uma medição para iniciar seu acompanhamento."
      : highCount > 0
        ? `${highCount} registro(s) acima de 180 mg/dL no período.`
        : "Nenhum registro acima de 180 mg/dL no período.";

  const insights: InsightCard[] = [
    {
      label: "Tendência",
      value: getTrend(records),
      detail: "Comparação simples entre o primeiro e o último registro dos últimos 7 dias.",
    },
    {
      label: "Insight discreto",
      value: average ? getGlucoseStatus(average).label : "Aguardando dados",
      detail: insightDetail,
    },
  ];

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#eefaff_0%,#f8fbfc_42%,#ffffff_100%)] text-[#082f49]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-4 pb-[calc(5rem+env(safe-area-inset-bottom))] sm:gap-6 sm:px-8 sm:py-6">
        <DashboardHeader
          email={user?.email}
          eyebrow="Resumo"
          fullName={profileResult.data?.full_name}
          title="Visão rápida"
        />

        {(params.error || params.success || periodResult.error || latestResult.error) && (
          <div
            className={`rounded-2xl border px-4 py-3 text-base leading-7 ${
              params.success
                ? "border-[#c7edf3] bg-[#eefaff] text-[#0f6f8f]"
                : "border-rose-100 bg-rose-50 text-rose-700"
            }`}
          >
            {params.success ?? params.error ?? periodResult.error?.message ?? latestResult.error?.message}
          </div>
        )}

        <SummaryCards cards={summaryCards} />
        <InsightCards insights={insights} />
        <GlucoseChart records={records} />

        <Link
          href="/historico"
          className="inline-flex h-12 items-center justify-center rounded-2xl border border-[#b8dce8] bg-white/85 px-4 text-base font-medium text-[#0f4864] shadow-sm shadow-sky-950/5 transition hover:bg-white"
        >
          Ver histórico completo
        </Link>

        <section className="rounded-2xl border border-[#d8edf4] bg-white/80 px-4 py-3 text-sm leading-6 text-[#405968]">
          O Glix não realiza diagnóstico médico. Use os registros como apoio para organizar sua
          rotina e conversar com profissionais de saúde.
        </section>
      </div>
      <FloatingRegisterButton />
    </main>
  );
}
