"use client";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ reset }: GlobalErrorProps) {
  return (
    <html lang="pt-BR">
      <body>
        <main className="flex min-h-screen items-center justify-center bg-[#f8fbfc] px-4 text-[#082f49]">
          <section className="w-full max-w-md rounded-3xl border border-[#d8edf4] bg-white p-6 text-center shadow-sm shadow-sky-950/5">
            <p className="text-sm font-semibold uppercase text-[#0f7897]">Glix</p>
            <h1 className="mt-3 text-2xl font-semibold tracking-tight text-[#062338]">
              Algo saiu do esperado
            </h1>
            <p className="mt-3 text-base leading-7 text-[#405968]">
              Recarregue a pagina. Se o problema continuar, tente novamente em alguns instantes.
            </p>
            <button
              type="button"
              onClick={reset}
              className="mt-6 inline-flex h-11 items-center justify-center rounded-lg bg-[#0f6f8f] px-4 text-sm font-semibold text-white transition hover:bg-[#0b5f7b]"
            >
              Tentar novamente
            </button>
          </section>
        </main>
      </body>
    </html>
  );
}
