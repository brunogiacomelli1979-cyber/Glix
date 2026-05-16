import Link from "next/link";
import { Activity, ChartNoAxesCombined, LockKeyhole, NotebookPen } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: NotebookPen,
    title: "Registro rápido",
    text: "Anote glicemia, horário, contexto e observações em poucos segundos.",
  },
  {
    icon: ChartNoAxesCombined,
    title: "Clareza no dia a dia",
    text: "Veja médias, últimos resultados e padrões básicos sem depender de planilhas.",
  },
  {
    icon: LockKeyhole,
    title: "Dados protegidos",
    text: "Cada conta acessa apenas os próprios registros usando autenticação Supabase.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f7fbf9] text-slate-950">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 py-6 sm:px-8">
        <header className="flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
            <span className="flex size-9 items-center justify-center rounded-lg bg-emerald-600 text-white">
              <Activity className="size-5" />
            </span>
            <span className="text-xl">Glix</span>
          </Link>
          <nav className="flex items-center gap-2">
            <Link href="/login" className={cn(buttonVariants({ variant: "ghost" }))}>
              Entrar
            </Link>
            <Link href="/register" className={cn(buttonVariants())}>
              Começar
            </Link>
          </nav>
        </header>

        <div className="grid flex-1 items-center gap-10 py-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="max-w-2xl">
            <p className="mb-4 text-sm font-medium uppercase tracking-[0.18em] text-emerald-700">
              Diário inteligente de glicemia
            </p>
            <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">
              Acompanhe sua glicemia com menos atrito e mais clareza.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              O Glix organiza seus registros em um painel simples para você entender sua rotina
              e conversar melhor com profissionais de saúde.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/register"
                className={cn(buttonVariants({ size: "lg" }), "h-11 px-5")}
              >
                Criar minha conta
              </Link>
              <Link
                href="/login"
                className={cn(buttonVariants({ size: "lg", variant: "outline" }), "h-11 px-5")}
              >
                Já tenho conta
              </Link>
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-emerald-100 bg-white p-5 shadow-xl shadow-emerald-950/5">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-slate-500">Resumo de hoje</p>
                <p className="mt-1 text-3xl font-semibold">112 mg/dL</p>
              </div>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
                Estável
              </span>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {["Jejum", "Pós-refeição", "Noite"].map((label, index) => (
                <div key={label} className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
                  <p className="mt-3 text-2xl font-semibold">{[98, 132, 106][index]}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 h-40 rounded-xl bg-gradient-to-b from-emerald-50 to-white p-4">
              <div className="flex h-full items-end gap-3">
                {[42, 62, 48, 76, 58, 68, 55].map((height, index) => (
                  <div key={index} className="flex flex-1 items-end rounded-full bg-white">
                    <div
                      className="w-full rounded-full bg-emerald-500"
                      style={{ height: `${height}%` }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <section className="grid gap-4 pb-8 md:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="rounded-2xl border border-slate-200 bg-white p-5">
              <feature.icon className="mb-4 size-5 text-emerald-700" />
              <h2 className="font-semibold">{feature.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{feature.text}</p>
            </div>
          ))}
        </section>
      </section>
    </main>
  );
}
