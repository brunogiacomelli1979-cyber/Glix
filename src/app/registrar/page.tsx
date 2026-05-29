import Image from "next/image";
import Link from "next/link";

import { UserNav } from "@/components/app/user-nav";
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

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#eefaff_0%,#f8fbfc_42%,#ffffff_100%)] text-[#082f49]">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-5 px-4 py-4 pb-[calc(2rem+env(safe-area-inset-bottom))] sm:px-6 sm:py-6">
        <header className="rounded-3xl border border-[#d8edf4] bg-white/80 px-4 py-4 shadow-sm shadow-sky-950/5 backdrop-blur sm:px-5">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Image
                src="/branding/glix-logo-main.png"
                alt="Glix"
                width={48}
                height={48}
                className="size-12 rounded-2xl object-contain"
                priority
              />
              <div className="min-w-0">
                <p className="text-sm font-semibold uppercase text-[#0f7897]">Registro rápido</p>
                <h1 className="text-2xl font-semibold tracking-tight text-[#062338]">
                  Olá{user?.email ? `, ${user.email.split("@")[0]}` : ""}.
                </h1>
              </div>
            </div>
            <UserNav active="registrar" />
          </div>
        </header>

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
          Ver dashboard
        </Link>
      </div>
    </main>
  );
}
