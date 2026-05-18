-- ==========================================
-- Setup do Banco de Dados Supabase - Glix
-- ==========================================

-- ==========================================
-- 1. Criacao das tabelas
-- ==========================================

CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  full_name text,
  plan text DEFAULT 'free' NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.glucose_records (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  value_mgdl integer NOT NULL CHECK (value_mgdl > 0 AND value_mgdl < 1500),
  context text NOT NULL CHECK (
    context IN (
      'jejum',
      'antes_refeicao',
      'pos_refeicao',
      'antes_dormir',
      'outro'
    )
  ),
  notes text,
  recorded_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 2. Row Level Security
-- ==========================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.glucose_records ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- 3. Policies - profiles
-- Reexecutavel: remove a policy antes de recriar.
-- ==========================================

DROP POLICY IF EXISTS "Usuarios podem ver o proprio perfil" ON public.profiles;
DROP POLICY IF EXISTS "Usuarios podem atualizar o proprio perfil" ON public.profiles;
DROP POLICY IF EXISTS "Usuários podem ver o próprio perfil" ON public.profiles;
DROP POLICY IF EXISTS "Usuários podem atualizar o próprio perfil" ON public.profiles;

CREATE POLICY "Usuarios podem ver o proprio perfil"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Usuarios podem atualizar o proprio perfil"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ==========================================
-- 4. Policies - glucose_records
-- Reexecutavel: remove a policy antes de recriar.
-- ==========================================

DROP POLICY IF EXISTS "Usuarios podem ver seus proprios registros" ON public.glucose_records;
DROP POLICY IF EXISTS "Usuarios podem inserir registros em seu proprio nome" ON public.glucose_records;
DROP POLICY IF EXISTS "Usuarios podem atualizar seus proprios registros" ON public.glucose_records;
DROP POLICY IF EXISTS "Usuarios podem deletar seus proprios registros" ON public.glucose_records;
DROP POLICY IF EXISTS "Usuários podem ver seus próprios registros" ON public.glucose_records;
DROP POLICY IF EXISTS "Usuários podem inserir registros em seu próprio nome" ON public.glucose_records;
DROP POLICY IF EXISTS "Usuários podem atualizar seus próprios registros" ON public.glucose_records;
DROP POLICY IF EXISTS "Usuários podem deletar seus próprios registros" ON public.glucose_records;

CREATE POLICY "Usuarios podem ver seus proprios registros"
  ON public.glucose_records
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuarios podem inserir registros em seu proprio nome"
  ON public.glucose_records
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuarios podem atualizar seus proprios registros"
  ON public.glucose_records
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuarios podem deletar seus proprios registros"
  ON public.glucose_records
  FOR DELETE
  USING (auth.uid() = user_id);

-- ==========================================
-- 5. Trigger de criacao automatica de perfil
-- Reexecutavel: remove o trigger antes de recriar.
-- ==========================================

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email)
  ON CONFLICT (id) DO NOTHING;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE PROCEDURE public.handle_new_user();
