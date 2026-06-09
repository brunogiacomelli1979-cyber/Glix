import Link from "next/link";

import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { QuickMeasurementForm } from "@/components/measurements/quick-measurement-form";
import { createClient } from "@/utils/supabase/server";

type RegisterMeasurementSearchParams = Promise<{
  error?: string;
  success?: string;
}>;

function getCurrentDateTimeInput() {
  const date = new Date();
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 16);
}

export default async function RegisterMeasurementPage({
  searchParams,
}: {
  searchParams: RegisterMeasurementSearchParams;
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

  const greetingName = profile?.full_name?.trim() || user?.email?.split("@")[0];

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#eefaff_0%,#f8fbfc_42%,#ffffff_100%)] text-[#082f49]">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-5 px-4 py-4 pb-[calc(2rem+env(safe-area-inset-bottom))] sm:px-6 sm:py-6">
        <DashboardHeader
          active="registrar"
          email={user?.email}
          eyebrow="Registro rápido"
          fullName={profile?.full_name}
          title={`Olá${greetingName ? `, ${greetingName}` : ""}.`}
        />

        {(params.error || params.success) && (
          <div
            className={`rounded-2xl border px-4 py-3 text-base leading-7 ${
              params.success
                ? "border-[#c7edf3] bg-[#eefaff] text-[#0f6f8f]"
                : "border-rose-100 bg-rose-50 text-rose-700"
            }`}
          >
            {params.success ?? params.error}
          </div>
        )}

        <section>
          <p className="mb-3 text-base leading-7 text-[#405968]">
            Abra, registre e siga sua rotina. O Glix organiza o histórico para consulta depois.
          </p>
          <QuickMeasurementForm defaultRecordedAt={getCurrentDateTimeInput()} />
        </section>

        <Link
          href="/dashboard"
          className="inline-flex h-12 items-center justify-center rounded-2xl border border-[#b8dce8] bg-white/80 px-4 text-base font-medium text-[#0f4864] shadow-sm shadow-sky-950/5 transition hover:bg-white"
        >
          Ver resumo
        </Link>
      </div>
    </main>
  );
}
