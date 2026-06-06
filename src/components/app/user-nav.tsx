import Link from "next/link";
import { LogOut } from "lucide-react";

import { logout } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type UserNavProps = {
  active: "dashboard" | "historico" | "registrar";
};

export function UserNav({ active }: UserNavProps) {
  const linkClass =
    "inline-flex h-10 items-center justify-center rounded-full px-4 text-sm font-medium transition";

  return (
    <nav className="flex flex-wrap items-center gap-2">
      <Link
        href="/registrar"
        className={cn(
          linkClass,
          active === "registrar"
            ? "bg-[#0f6f8f] text-white shadow-sm shadow-sky-950/10"
            : "border border-[#b8dce8] bg-white/70 text-[#0f4864] hover:bg-white"
        )}
      >
        Registrar
      </Link>
      <Link
        href="/dashboard"
        className={cn(
          linkClass,
          active === "dashboard"
            ? "bg-[#0f6f8f] text-white shadow-sm shadow-sky-950/10"
            : "border border-[#b8dce8] bg-white/70 text-[#0f4864] hover:bg-white"
        )}
      >
        Resumo
      </Link>
      <Link
        href="/historico"
        className={cn(
          linkClass,
          active === "historico"
            ? "bg-[#0f6f8f] text-white shadow-sm shadow-sky-950/10"
            : "border border-[#b8dce8] bg-white/70 text-[#0f4864] hover:bg-white"
        )}
      >
        Histórico
      </Link>
      <form action={logout}>
        <Button
          variant="outline"
          type="submit"
          className="h-10 rounded-full border-[#b8dce8] bg-white/70 px-4 text-[#0f4864]"
        >
          <LogOut className="size-4" />
          Sair
        </Button>
      </form>
    </nav>
  );
}
