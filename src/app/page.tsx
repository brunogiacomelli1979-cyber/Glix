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

export default function Home() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#effaff_0%,#f8fbfc_48%,#ffffff_100%)] text-[#082f49]">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 py-5 sm:px-8">
        <header className="flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/branding/glix-logo-main.png"
              alt="Glix"
              width={44}
              height={44}
              className="size-11 rounded-xl object-contain"
              priority
            />
            <span className="text-xl font-semibold tracking-tight">Glix</span>
          </Link>
          <nav className="flex items-center gap-2">
            <Link
              href="/login"
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "text-[#0f4864] hover:bg-white/70"
              )}
            >
              Entrar
            </Link>
            <Link
              href="/register"
              className={cn(
                buttonVariants(),
                "bg-[#0f6f8f] text-white shadow-sm shadow-sky-900/10 hover:bg-[#0b5f7b]"
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
                  "h-11 bg-[#0f6f8f] px-5 text-white shadow-lg shadow-sky-900/10 hover:bg-[#0b5f7b]"
                )}
              >
                Criar minha conta
              </Link>
              <Link
                href="/login"
                className={cn(
                  buttonVariants({ size: "lg", variant: "outline" }),
                  "h-11 border-[#b8dce8] bg-white/70 px-5 text-[#0f4864] hover:bg-white"
                )}
              >
                Já tenho conta
              </Link>
            </div>
            <p className="mt-5 text-sm text-[#6d7f8c]">
              O Glix não substitui orientação médica.
            </p>
          </div>

          <div className="relative">
            <div className="absolute inset-8 rounded-[2rem] bg-[#8fd7e8]/30 blur-3xl" />
            <div className="relative overflow-hidden rounded-[1.75rem] border border-white bg-white shadow-2xl shadow-sky-950/10">
              <Image
                src="/branding/glix-landing-hero.png"
                alt="Interface visual do Glix"
                width={960}
                height={540}
                className="h-auto w-full object-cover"
                priority
              />
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
              <p className="mt-2 text-sm leading-6 text-[#5f7481]">{feature.text}</p>
            </div>
          ))}
        </section>
      </section>
    </main>
  );
}
