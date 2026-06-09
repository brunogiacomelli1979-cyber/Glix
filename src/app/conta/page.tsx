import Link from "next/link";
import { redirect } from "next/navigation";
import { CalendarDays, FileText, LogOut, Mail, ShieldCheck, UserRound } from "lucide-react";

import { logout } from "@/app/auth/actions";
import { updateProfileName } from "@/app/conta/actions";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/utils/supabase/server";

type AccountSearchParams = Promise<{
  error?: string;
  success?: string;
}>;

type ProfileSummary = {
  created_at: string | null;
  full_name: string | null;
};

function formatAccountDate(value?: string | null) {
  if (!value) {
    return "Não disponível";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Não disponível";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

export default async function AccountPage({
  searchParams,
}: {
  searchParams: AccountSearchParams;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("full_name, created_at")
    .eq("id", user.id)
    .maybeSingle<ProfileSummary>();

  const displayName = profile?.full_name?.trim() || "Nome não informado";
  const accountCreatedAt = profile?.created_at ?? user.created_at;

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#eefaff_0%,#f8fbfc_42%,#ffffff_100%)] text-[#082f49]">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-5 px-4 py-4 pb-[calc(2rem+env(safe-area-inset-bottom))] sm:px-6 sm:py-6">
        <DashboardHeader
          active="conta"
          email={user.email}
          eyebrow="Conta"
          fullName={profile?.full_name}
          title="Perfil do usuário"
        />

        {(params.error || params.success || profileError) && (
          <div
            className={`rounded-2xl border px-4 py-3 text-base leading-7 ${
              params.success
                ? "border-[#c7edf3] bg-[#eefaff] text-[#0f6f8f]"
                : "border-amber-100 bg-amber-50 text-amber-800"
            }`}
          >
            {params.success ??
              params.error ??
              "Não foi possível carregar todos os dados do perfil agora."}
          </div>
        )}

        <Card className="rounded-3xl border-[#d8edf4] bg-white/90 shadow-sm shadow-sky-950/5">
          <CardHeader>
            <CardTitle className="text-2xl text-[#062338]">Dados da conta</CardTitle>
            <CardDescription className="text-base leading-7 text-[#405968]">
              Informações básicas da sua conta no Glix.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3 rounded-2xl border border-[#e3f1f5] bg-[#f8fbfc] p-4">
              <UserRound className="mt-0.5 size-5 text-[#0f7897]" />
              <div>
                <p className="text-sm font-medium text-[#405968]">Nome</p>
                <p className="text-base font-semibold text-[#062338]">{displayName}</p>
              </div>
            </div>

            <form action={updateProfileName} className="rounded-2xl border border-[#e3f1f5] bg-white p-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Nome</Label>
                <Input
                  id="full_name"
                  name="full_name"
                  type="text"
                  minLength={2}
                  maxLength={80}
                  defaultValue={profile?.full_name ?? ""}
                  placeholder="Como você quer ser chamado?"
                  className="h-12 border-[#cfe5ed] bg-white text-base"
                  required
                />
              </div>
              <Button
                type="submit"
                className="mt-3 h-12 w-full rounded-2xl bg-[#0f6f8f] text-base font-semibold text-white hover:bg-[#0b5f7b]"
              >
                Salvar nome
              </Button>
            </form>

            <div className="flex items-start gap-3 rounded-2xl border border-[#e3f1f5] bg-[#f8fbfc] p-4">
              <Mail className="mt-0.5 size-5 text-[#0f7897]" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-[#405968]">E-mail</p>
                <p className="truncate text-base font-semibold text-[#062338]">{user.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-2xl border border-[#e3f1f5] bg-[#f8fbfc] p-4">
              <CalendarDays className="mt-0.5 size-5 text-[#0f7897]" />
              <div>
                <p className="text-sm font-medium text-[#405968]">Conta criada em</p>
                <p className="text-base font-semibold text-[#062338]">
                  {formatAccountDate(accountCreatedAt)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-[#d8edf4] bg-white/90 shadow-sm shadow-sky-950/5">
          <CardHeader>
            <CardTitle className="text-xl text-[#062338]">Privacidade e termos</CardTitle>
            <CardDescription className="text-base leading-7 text-[#405968]">
              O Glix funciona como diário digital de organização pessoal e não substitui orientação
              profissional de saúde.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            <Link
              href="/termos"
              className="flex min-h-14 items-center gap-3 rounded-2xl border border-[#b8dce8] bg-white px-4 text-base font-medium text-[#0f4864] transition hover:bg-[#eefaff]"
            >
              <FileText className="size-5 text-[#0f7897]" />
              Termos de uso
            </Link>
            <Link
              href="/privacidade"
              className="flex min-h-14 items-center gap-3 rounded-2xl border border-[#b8dce8] bg-white px-4 text-base font-medium text-[#0f4864] transition hover:bg-[#eefaff]"
            >
              <ShieldCheck className="size-5 text-[#0f7897]" />
              Privacidade
            </Link>
          </CardContent>
        </Card>

        <form action={logout}>
          <Button
            type="submit"
            variant="outline"
            className="h-12 w-full rounded-2xl border-[#b8dce8] bg-white/85 text-base font-semibold text-[#0f4864] shadow-sm shadow-sky-950/5 hover:bg-white"
          >
            <LogOut className="size-5" />
            Sair da conta
          </Button>
        </form>
      </div>
    </main>
  );
}
