import Image from "next/image";
import Link from "next/link";
import { ChartNoAxesCombined, LockKeyhole, NotebookPen } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: NotebookPen,
    title: "Registro rápido",
    text: "Anote valor, horário, contexto e observações sem depender de planilhas.",
  },
  {
    icon: ChartNoAxesCombined,
    title: "Tendências visuais",
    text: "Acompanhe médias, últimos registros e evolução em uma visão organizada.",
  },
  {
    icon: LockKeyhole,
    title: "Dados protegidos",
    text: "Cada conta acessa apenas os próprios registros com autenticação Supabase.",
  },
];

const previewBars = [
  { label: "Seg", value: 42 },
  { label: "Ter", value: 58 },
  { label: "Qua", value: 48 },
  { label: "Qui", value: 72 },
  { label: "Sex", value: 64 },
  { label: "Sab", value: 82 },
  { label: "Hoje", value: 54 },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#effaff_0%,#f8fbfc_48%,#ffffff_100%)] text-[#082f49]">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 py-5 sm:px-8">
        <header className="flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/branding/glix-logo-main.png"
              alt="Glix"
              width={112}
              height={48}
              className="h-12 w-auto object-contain"
              priority
            />
          </Link>
          <nav className="flex items-center gap-2">
            <Link
              href="/login"
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "min-h-11 text-[#0f4864] hover:bg-white/70"
              )}
            >
              Entrar
            </Link>
            <Link
              href="/register"
              className={cn(
                buttonVariants(),
                "min-h-11 bg-[#0f6f8f] text-white shadow-sm shadow-sky-900/10 hover:bg-[#0b5f7b]"
              )}
            >
              Começar
            </Link>
          </nav>
        </header>

        <div className="grid flex-1 items-center gap-10 py-10 lg:grid-cols-[0.95fr_1.05fr] lg:py-14">
          <div className="max-w-2xl">
            <p className="mb-4 text-sm font-semibold uppercase text-[#0f7897]">
              Diário digital de glicemia
            </p>
            <h1 className="text-4xl font-semibold leading-tight tracking-tight text-[#062338] sm:text-6xl">
              Acompanhe sua glicemia com clareza.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-[#476173]">
              Registre medições, visualize tendências e organize seu histórico em uma
              experiência simples e segura.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/register"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "h-12 bg-[#0f6f8f] px-5 text-white shadow-lg shadow-sky-900/10 hover:bg-[#0b5f7b]"
                )}
              >
                Criar minha conta
              </Link>
              <Link
                href="/login"
                className={cn(
                  buttonVariants({ size: "lg", variant: "outline" }),
                  "h-12 border-[#b8dce8] bg-white/70 px-5 text-[#0f4864] hover:bg-white"
                )}
              >
                Já tenho conta
              </Link>
            </div>
            <p className="mt-5 text-base leading-7 text-[#516b7a]">
              O Glix não substitui orientação médica.
            </p>
          </div>

          <div className="relative">
            <div className="absolute inset-8 rounded-[2rem] bg-[#8fd7e8]/30 blur-3xl" />
            <div className="relative overflow-hidden rounded-[1.75rem] border border-white bg-white p-4 shadow-2xl shadow-sky-950/10 sm:p-6">
              <div className="rounded-[1.35rem] border border-[#d8edf4] bg-[linear-gradient(180deg,#f8fdff_0%,#ffffff_100%)] p-4 sm:p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold uppercase text-[#0f7897]">Resumo de hoje</p>
                    <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#062338]">
                      112 mg/dL
                    </h2>
                    <p className="mt-1 text-base text-[#405968]">Última medição registrada</p>
                  </div>
                  <span className="rounded-full border border-[#b8dce8] bg-[#eefaff] px-3 py-1 text-sm font-medium text-[#0f4864]">
                    Organizado
                  </span>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-[#d8edf4] bg-white p-4 shadow-sm shadow-sky-950/5">
                    <p className="text-sm text-[#516b7a]">Média</p>
                    <p className="mt-2 text-xl font-semibold text-[#062338]">118 mg/dL</p>
                  </div>
                  <div className="rounded-2xl border border-[#d8edf4] bg-white p-4 shadow-sm shadow-sky-950/5">
                    <p className="text-sm text-[#516b7a]">Registros</p>
                    <p className="mt-2 text-xl font-semibold text-[#062338]">12</p>
                  </div>
                </div>

                <div className="mt-5 rounded-2xl border border-[#d8edf4] bg-white p-4 shadow-sm shadow-sky-950/5">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium text-[#062338]">Evolução semanal</p>
                    <p className="text-sm text-[#516b7a]">mg/dL</p>
                  </div>
                  <div className="mt-5 flex h-36 items-end gap-2" aria-label="Prévia visual do gráfico de glicemia">
                    {previewBars.map((bar) => (
                      <div key={bar.label} className="flex flex-1 flex-col items-center gap-2">
                        <div
                          className="w-full rounded-t-xl bg-[linear-gradient(180deg,#0f9fba_0%,#b8e8f1_100%)]"
                          style={{ height: `${bar.value}%` }}
                        />
                        <span className="text-[0.8rem] font-medium text-[#516b7a]">{bar.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-5 rounded-2xl border border-[#d8edf4] bg-[#f8fbfc] p-4">
                  <p className="text-sm font-medium text-[#516b7a]">Registro recente</p>
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-[#062338]">Antes de dormir</p>
                      <p className="mt-1 text-sm text-[#516b7a]">Hoje, 21:15</p>
                    </div>
                    <span className="rounded-full border border-[#c7edf3] bg-white px-3 py-1.5 text-sm font-semibold text-[#0f6f8f]">
                      110 mg/dL
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="grid gap-4 pb-8 md:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-[#d8edf4] bg-white/85 p-5 shadow-sm shadow-sky-950/5"
            >
              <feature.icon className="mb-4 size-5 text-[#0f7897]" />
              <h2 className="font-semibold text-[#082f49]">{feature.title}</h2>
              <p className="mt-2 text-[0.95rem] leading-7 text-[#405968]">{feature.text}</p>
            </div>
          ))}
        </section>
      </section>
    </main>
  );
}
