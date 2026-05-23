import Image from "next/image";

import { logout } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";

type DashboardHeaderProps = {
  email?: string;
};

export function DashboardHeader({ email }: DashboardHeaderProps) {
  return (
    <header className="rounded-3xl border border-[#d8edf4] bg-white/80 px-4 py-4 shadow-sm shadow-sky-950/5 backdrop-blur sm:px-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <Image
              src="/branding/glix-logo-main.png"
              alt="Glix"
              width={48}
              height={48}
              className="size-12 rounded-2xl object-contain"
              priority
            />
            <div>
              <p className="text-sm font-semibold uppercase text-[#0f7897]">Glix</p>
              <h1 className="text-2xl font-semibold tracking-tight text-[#062338]">
                Painel de glicemia
              </h1>
            </div>
          </div>
          {email && (
            <p className="mt-3 truncate text-[0.95rem] text-[#405968]">
              Conta conectada: <span className="font-medium text-[#0f4864]">{email}</span>
            </p>
          )}
        </div>
        <form action={logout}>
          <Button
            variant="outline"
            type="submit"
            className="h-10 border-[#b8dce8] bg-white/70 px-4 text-[#0f4864]"
          >
            Sair
          </Button>
        </form>
      </div>
    </header>
  );
}
