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
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
      <Card className="w-full max-w-md border-slate-200 bg-white/70 shadow-xl backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/50">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold tracking-tight">Crie sua conta</CardTitle>
          <CardDescription>Insira suas informações para começar no Glix.</CardDescription>
        </CardHeader>
        <form action={signup}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" name="email" type="email" placeholder="nome@exemplo.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input id="password" name="password" type="password" minLength={6} required />
            </div>
            <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm leading-6 text-emerald-800">
              Depois do cadastro, confirme sua conta pelo link enviado ao seu e-mail.
            </p>
            {resolvedParams?.error && (
              <div className="text-sm font-medium text-destructive dark:text-red-400">
                {resolvedParams.error}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button className="w-full font-semibold" type="submit">
              Cadastrar
            </Button>
            <div className="text-center text-sm text-muted-foreground">
              Já tem uma conta?{" "}
              <Link href="/login" className="font-medium text-primary hover:underline">
                Faça login
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
