import Image from "next/image";
import Link from "next/link";

import { login } from "@/app/auth/actions";
import { PasswordField } from "@/components/auth/password-field";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  const resolvedParams = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-[linear-gradient(160deg,#eefaff_0%,#f8fbfc_52%,#ffffff_100%)] px-4 py-8 text-[#082f49]">
      <Card className="w-full max-w-md rounded-2xl border-[#d8edf4] bg-white/90 shadow-2xl shadow-sky-950/10 backdrop-blur">
        <CardHeader className="items-center space-y-3 text-center">
          <Image
            src="/branding/glix-logo-main.png"
            alt="Glix"
            width={72}
            height={72}
            className="size-16 rounded-2xl object-contain"
            priority
          />
          <div>
            <CardTitle className="text-2xl font-semibold tracking-tight text-[#062338]">
              Bem-vindo de volta
            </CardTitle>
            <CardDescription className="mt-1 text-[#607585]">
              Acesse seu histórico pessoal de glicemia.
            </CardDescription>
          </div>
        </CardHeader>
        <form action={login}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="nome@exemplo.com"
                className="h-11 border-[#cfe5ed] bg-white"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <PasswordField />
            </div>
            {resolvedParams?.error && (
              <div className="rounded-lg border border-rose-100 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">
                {resolvedParams.error}
              </div>
            )}
            {resolvedParams?.success && (
              <div className="rounded-lg border border-[#c7edf3] bg-[#eefaff] px-3 py-2 text-sm font-medium text-[#0f6f8f]">
                {resolvedParams.success}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button className="h-11 w-full bg-[#0f6f8f] font-semibold text-white hover:bg-[#0b5f7b]" type="submit">
              Entrar
            </Button>
            <div className="text-center text-sm text-[#607585]">
              Não tem uma conta?{" "}
              <Link href="/register" className="font-medium text-[#0f6f8f] hover:underline">
                Cadastre-se
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </main>
  );
}
