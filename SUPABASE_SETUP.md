-- ==========================================
-- Setup do Banco de Dados Supabase — Glix
-- ==========================================

-- ==========================================
-- 1. Criação das Tabelas
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
-- 2. Habilitando Row Level Security
-- ==========================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.glucose_records ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- 3. Policies — profiles
-- ==========================================

CREATE POLICY "Usuários podem ver o próprio perfil"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Usuários podem atualizar o próprio perfil"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ==========================================
-- 4. Policies — glucose_records
-- ==========================================

CREATE POLICY "Usuários podem ver seus próprios registros"
  ON public.glucose_records
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem inserir registros em seu próprio nome"
  ON public.glucose_records
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seus próprios registros"
  ON public.glucose_records
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar seus próprios registros"
  ON public.glucose_records
  FOR DELETE
  USING (auth.uid() = user_id);

-- ==========================================
-- 5. Trigger de Criação Automática de Perfil
-- ==========================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email)
  ON CONFLICT (id) DO NOTHING;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE PROCEDURE public.handle_new_user();