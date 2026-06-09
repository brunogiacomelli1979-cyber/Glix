import Link from "next/link";
import Image from "next/image";

const sections = [
  {
    title: "Finalidade do Glix",
    text: "O Glix é um diário digital para registrar e organizar medições pessoais de glicemia. Ele ajuda a visualizar histórico, resumo e tendências simples informadas pelo próprio usuário.",
  },
  {
    title: "Limitação médica",
    text: "O Glix não substitui orientação médica, consulta com profissional habilitado, diagnóstico, tratamento ou acompanhamento clínico. Em caso de dúvidas sobre saúde, procure um profissional de saúde.",
  },
  {
    title: "Responsabilidade do usuário",
    text: "O usuário é responsável pelas informações que registra, pela conferência dos dados inseridos e pelo uso dessas informações em sua rotina pessoal.",
  },
  {
    title: "Evolução do produto",
    text: "O Glix é um projeto em evolução. Funcionalidades, telas e regras de uso podem mudar ao longo do tempo para melhorar a experiência, segurança e clareza do serviço.",
  },
];

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#eefaff_0%,#f8fbfc_44%,#ffffff_100%)] px-4 py-8 text-[#082f49]">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <header className="flex flex-col gap-4 rounded-3xl border border-[#d8edf4] bg-white/85 p-5 shadow-sm shadow-sky-950/5">
          <Image
            src="/branding/glix-logo-main.png"
            alt="Glix"
            width={80}
            height={40}
            className="h-10 w-auto object-contain"
            priority
          />
          <div>
            <p className="text-sm font-semibold uppercase text-[#0f7897]">Versão inicial</p>
            <h1 className="text-3xl font-semibold tracking-tight text-[#062338]">Termos de uso</h1>
            <p className="mt-2 text-base leading-7 text-[#405968]">
              Estes termos apresentam uma visão simples e inicial sobre o uso do Glix.
            </p>
          </div>
        </header>

        <section className="space-y-4 rounded-3xl border border-[#d8edf4] bg-white/90 p-5 shadow-sm shadow-sky-950/5">
          {sections.map((section) => (
            <article key={section.title} className="border-b border-[#e3f1f5] pb-4 last:border-b-0 last:pb-0">
              <h2 className="text-xl font-semibold text-[#062338]">{section.title}</h2>
              <p className="mt-2 text-base leading-7 text-[#405968]">{section.text}</p>
            </article>
          ))}
        </section>

        <Link
          href="/conta"
          className="inline-flex h-12 items-center justify-center rounded-2xl border border-[#b8dce8] bg-white/85 px-4 text-base font-medium text-[#0f4864] shadow-sm shadow-sky-950/5 transition hover:bg-white"
        >
          Voltar para Conta
        </Link>
      </div>
    </main>
  );
}
