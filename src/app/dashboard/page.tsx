import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { FilterBar } from "@/components/dashboard/filter-bar";
import { GlucoseChart } from "@/components/dashboard/glucose-chart";
import { HistoryList } from "@/components/dashboard/history-list";
import { InsightCards } from "@/components/dashboard/insight-cards";
import { SummaryCards } from "@/components/dashboard/summary-cards";
import {
  getDashboardMetrics,
  getPeriodStart,
  isGlucoseContext,
  isPeriodFilter,
} from "@/lib/glucose";
import type { GlucoseRecord, PeriodFilter } from "@/types/glucose";
import { createClient } from "@/utils/supabase/server";

type DashboardSearchParams = Promise<{
  context?: string;
  error?: string;
  period?: string;
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

  const selectedPeriod: PeriodFilter = isPeriodFilter(params.period) ? params.period : "30d";
  const selectedContext = params.context ?? "todos";

  let query = supabase
    .from("glucose_records")
    .select("id, value_mgdl, context, notes, recorded_at")
    .gte("recorded_at", getPeriodStart(selectedPeriod))
    .order("recorded_at", { ascending: false })
    .limit(90);

  if (isGlucoseContext(selectedContext)) {
    query = query.eq("context", selectedContext);
  }

  const { data, error } = await query;
  const records = (data ?? []) as GlucoseRecord[];
  const { highCount, insights, summaryCards } = getDashboardMetrics(records, selectedPeriod);

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#eefaff_0%,#f8fbfc_42%,#ffffff_100%)] text-[#082f49]">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-4 pb-[calc(2rem+env(safe-area-inset-bottom))] sm:gap-6 sm:px-8 sm:py-6">
        <DashboardHeader email={user?.email} />
        <FilterBar selectedContext={selectedContext} selectedPeriod={selectedPeriod} />

        {(params.error || params.success || error) && (
          <div
            className={`rounded-2xl border px-4 py-3 text-base leading-7 ${
              params.success
                ? "border-[#c7edf3] bg-[#eefaff] text-[#0f6f8f]"
                : "border-rose-100 bg-rose-50 text-rose-700"
            }`}
          >
            {params.success ?? params.error ?? error?.message}
          </div>
        )}

        <SummaryCards cards={summaryCards} />
        <InsightCards insights={insights} />
        <GlucoseChart records={records} />

        <section>
          <HistoryList highCount={highCount} records={records} />
        </section>

        <section className="rounded-2xl border border-[#d8edf4] bg-white/80 px-4 py-3 text-sm leading-6 text-[#405968]">
          O Glix não realiza diagnóstico médico. Use os registros como apoio para organizar sua
          rotina e conversar com profissionais de saúde.
        </section>
      </div>
    </main>
  );
}
