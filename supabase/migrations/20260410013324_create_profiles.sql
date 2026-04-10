CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  document_number TEXT,
  company_name TEXT,
  email TEXT,
  phone TEXT,
  whatsapp TEXT,
  accountant_name TEXT,
  accountant_email TEXT,
  accountant_phone TEXT,
  notify_email BOOLEAN DEFAULT true,
  notify_whatsapp BOOLEAN DEFAULT false,
  notify_sms BOOLEAN DEFAULT false,
  last_sync_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.documents ADD COLUMN IF NOT EXISTS is_favorite BOOLEAN DEFAULT false;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "authenticated_select_profiles" ON public.profiles;
CREATE POLICY "authenticated_select_profiles" ON public.profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "authenticated_update_profiles" ON public.profiles;
CREATE POLICY "authenticated_update_profiles" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "authenticated_insert_profiles" ON public.profiles;
CREATE POLICY "authenticated_insert_profiles" ON public.profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Semeia perfis baseados nos usuários existentes
INSERT INTO public.profiles (id, email, full_name, company_name)
SELECT id, email, 'Cliente Exemplo', 'Empresa Exemplo LTDA' FROM auth.users
ON CONFLICT (id) DO NOTHING;
