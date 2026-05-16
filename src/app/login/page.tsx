import Link from "next/link";

import { login } from "@/app/auth/actions";
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
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
      <Card className="w-full max-w-md border-slate-200 bg-white/70 shadow-xl backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/50">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold tracking-tight">Bem-vindo de volta</CardTitle>
          <CardDescription>Insira seu e-mail e senha para acessar o Glix.</CardDescription>
        </CardHeader>
        <form action={login}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" name="email" type="email" placeholder="nome@exemplo.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            {resolvedParams?.error && (
              <div className="text-sm font-medium text-destructive dark:text-red-400">
                {resolvedParams.error}
              </div>
            )}
            {resolvedParams?.success && (
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-800">
                {resolvedParams.success}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button className="w-full font-semibold" type="submit">
              Entrar
            </Button>
            <div className="text-center text-sm text-muted-foreground">
              Não tem uma conta?{" "}
              <Link href="/register" className="font-medium text-primary hover:underline">
                Cadastre-se
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
