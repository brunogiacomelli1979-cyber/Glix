import Link from "next/link";

import { FloatingRegisterButton } from "@/components/app/floating-register-button";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { FilterBar } from "@/components/dashboard/filter-bar";
import { HistoryList } from "@/components/dashboard/history-list";
import {
  getDashboardMetrics,
  getPeriodStart,
  isGlucoseContext,
  isPeriodFilter,
} from "@/lib/glucose";
import type { GlucoseRecord, PeriodFilter } from "@/types/glucose";
import { createClient } from "@/utils/supabase/server";

type HistorySearchParams = Promise<{
  context?: string;
  error?: string;
  period?: string;
  success?: string;
}>;

export default async function HistoryPage({
  searchParams,
}: {
  searchParams: HistorySearchParams;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user?.id ?? "")
    .maybeSingle<{ full_name: string | null }>();

  const selectedPeriod: PeriodFilter = isPeriodFilter(params.period) ? params.period : "30d";
  const selectedContext = params.context ?? "todos";

  let query = supabase
    .from("glucose_records")
    .select("id, value_mgdl, context, notes, recorded_at")
    .gte("recorded_at", getPeriodStart(selectedPeriod))
    .order("recorded_at", { ascending: false })
    .limit(200);

  if (isGlucoseContext(selectedContext)) {
    query = query.eq("context", selectedContext);
  }

  const { data, error } = await query;
  const records = (data ?? []) as GlucoseRecord[];
  const { highCount } = getDashboardMetrics(records, selectedPeriod);

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#eefaff_0%,#f8fbfc_42%,#ffffff_100%)] text-[#082f49]">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-4 pb-[calc(5rem+env(safe-area-inset-bottom))] sm:gap-6 sm:px-8 sm:py-6">
        <DashboardHeader
          active="historico"
          email={user?.email}
          eyebrow="Histórico"
          fullName={profile?.full_name}
          title="Registros detalhados"
        />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-base leading-7 text-[#405968]">
            Consulte, filtre, edite ou remova medições quando precisar revisar os detalhes.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex h-11 items-center justify-center rounded-2xl border border-[#b8dce8] bg-white/85 px-4 text-sm font-medium text-[#0f4864] shadow-sm shadow-sky-950/5 transition hover:bg-white"
          >
            Voltar ao resumo
          </Link>
        </div>

        <FilterBar
          action="/historico"
          selectedContext={selectedContext}
          selectedPeriod={selectedPeriod}
        />

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

        <HistoryList highCount={highCount} records={records} redirectTo="/historico" />
      </div>
      <FloatingRegisterButton />
    </main>
  );
}
