import { createClient } from '@/utils/supabase/server'
import { logout } from '@/app/auth/actions'
import { Button } from '@/components/ui/button'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950 space-y-6">
      <div className="p-8 bg-white dark:bg-slate-900 rounded-xl shadow-lg text-center max-w-lg w-full">
        <h1 className="text-3xl font-bold mb-2">Painel de Controle</h1>
        <p className="text-muted-foreground mb-6">
          Autenticado como: <span className="font-medium text-slate-900 dark:text-slate-100">{user?.email}</span>
        </p>
        <form action={logout}>
          <Button variant="destructive" type="submit" className="w-full">
            Sair da Conta
          </Button>
        </form>
      </div>
    </div>
  )
}
