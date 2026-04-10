-- Create auth user safely
DO $DO_BLOCK$
DECLARE
  new_user_id uuid;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'leandro_teza@hotmail.com') THEN
    new_user_id := gen_random_uuid();
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at,
      created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
      is_super_admin, role, aud,
      confirmation_token, recovery_token, email_change_token_new,
      email_change, email_change_token_current,
      phone, phone_change, phone_change_token, reauthentication_token
    ) VALUES (
      new_user_id,
      '00000000-0000-0000-0000-000000000000',
      'leandro_teza@hotmail.com',
      crypt('Skip@Pass123!', gen_salt('bf')),
      NOW(), NOW(), NOW(),
      '{"provider": "email", "providers": ["email"]}',
      '{"name": "Leandro"}',
      false, 'authenticated', 'authenticated',
      '', '', '', '', '', NULL, '', '', ''
    );
  END IF;
END $DO_BLOCK$;

-- Create taxes table
CREATE TABLE IF NOT EXISTS public.taxes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  tax_type TEXT NOT NULL,
  due_date DATE NOT NULL,
  amount NUMERIC(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pendente',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS
ALTER TABLE public.taxes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "authenticated_select" ON public.taxes;
CREATE POLICY "authenticated_select" ON public.taxes 
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Seed Data
DO $DO_BLOCK$
DECLARE
  seed_user_id uuid;
BEGIN
  SELECT id INTO seed_user_id FROM auth.users WHERE email = 'leandro_teza@hotmail.com' LIMIT 1;

  IF seed_user_id IS NOT NULL THEN
    INSERT INTO public.taxes (id, user_id, title, tax_type, due_date, amount, status)
    VALUES
      (gen_random_uuid(), seed_user_id, 'Competência 03/2026', 'DARF', CURRENT_DATE + INTERVAL '2 days', 1500.50, 'Pendente'),
      (gen_random_uuid(), seed_user_id, 'Competência 03/2026', 'ICMS', CURRENT_DATE + INTERVAL '5 days', 3200.00, 'Pendente'),
      (gen_random_uuid(), seed_user_id, 'Competência 03/2026', 'ISS', CURRENT_DATE + INTERVAL '10 days', 850.25, 'Enviado'),
      (gen_random_uuid(), seed_user_id, 'Competência 03/2026', 'PIS/COFINS', CURRENT_DATE + INTERVAL '15 days', 2100.00, 'Pendente'),
      (gen_random_uuid(), seed_user_id, 'Competência 02/2026', 'IRPJ', CURRENT_DATE - INTERVAL '5 days', 4500.00, 'Pago'),
      (gen_random_uuid(), seed_user_id, 'Competência 04/2026', 'CSLL', CURRENT_DATE + INTERVAL '35 days', 1200.00, 'Pendente')
    ON CONFLICT DO NOTHING;
  END IF;
END $DO_BLOCK$;
