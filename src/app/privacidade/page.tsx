import Link from "next/link";
import Image from "next/image";

const sections = [
  {
    title: "Dados utilizados",
    text: "O Glix utiliza dados básicos de conta, como e-mail, nome opcional e os registros de glicemia que o próprio usuário decide inserir.",
  },
  {
    title: "Como os dados são usados",
    text: "Os dados são usados para exibir histórico, resumo, filtros, gráficos simples e organização pessoal dentro da conta do usuário.",
  },
  {
    title: "Autenticação e armazenamento",
    text: "O projeto utiliza Supabase para autenticação e banco de dados. O acesso aos registros privados depende de login e das regras de segurança configuradas no banco.",
  },
  {
    title: "Cuidados com dados sensíveis",
    text: "Registros de glicemia podem ser dados sensíveis. Eles não devem ser compartilhados publicamente pelo usuário, e o Glix não deve ser usado como substituto de acompanhamento médico.",
  },
  {
    title: "Evolução futura",
    text: "Opções de exportação, exclusão de dados e controles adicionais de privacidade podem ser adicionados em versões futuras do produto.",
  },
];

export default function PrivacyPage() {
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
            <h1 className="text-3xl font-semibold tracking-tight text-[#062338]">
              Política de privacidade
            </h1>
            <p className="mt-2 text-base leading-7 text-[#405968]">
              Esta política explica, em linguagem simples, como o Glix trata dados na versão atual.
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
