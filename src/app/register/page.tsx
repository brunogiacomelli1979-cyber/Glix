import Image from "next/image";
import Link from "next/link";

import { signup } from "@/app/auth/actions";
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

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
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
              Crie sua conta
            </CardTitle>
            <CardDescription className="mt-1 text-[#607585]">
              Comece seu diário pessoal de glicemia.
            </CardDescription>
          </div>
        </CardHeader>
        <form action={signup}>
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
              <Input
                id="password"
                name="password"
                type="password"
                minLength={6}
                className="h-11 border-[#cfe5ed] bg-white"
                required
              />
            </div>
            <p className="rounded-lg border border-[#c7edf3] bg-[#eefaff] px-3 py-2 text-sm leading-6 text-[#0f4864]">
              Depois do cadastro, confirme sua conta pelo link enviado ao seu e-mail.
            </p>
            {resolvedParams?.error && (
              <div className="rounded-lg border border-rose-100 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">
                {resolvedParams.error}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button className="h-11 w-full bg-[#0f6f8f] font-semibold text-white hover:bg-[#0b5f7b]" type="submit">
              Cadastrar
            </Button>
            <div className="text-center text-sm text-[#607585]">
              Já tem uma conta?{" "}
              <Link href="/login" className="font-medium text-[#0f6f8f] hover:underline">
                Faça login
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </main>
  );
}
