DO $$
BEGIN
  -- 1. Create Documents Table
  CREATE TABLE IF NOT EXISTS public.documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Pendente',
    file_url TEXT,
    size TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  -- 2. Enable RLS
  ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

  -- 3. RLS Policies
  DROP POLICY IF EXISTS "authenticated_select" ON public.documents;
  CREATE POLICY "authenticated_select" ON public.documents
    FOR SELECT TO authenticated USING (auth.uid() = user_id);

  DROP POLICY IF EXISTS "authenticated_insert" ON public.documents;
  CREATE POLICY "authenticated_insert" ON public.documents
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

  DROP POLICY IF EXISTS "authenticated_update" ON public.documents;
  CREATE POLICY "authenticated_update" ON public.documents
    FOR UPDATE TO authenticated USING (auth.uid() = user_id);

  DROP POLICY IF EXISTS "authenticated_delete" ON public.documents;
  CREATE POLICY "authenticated_delete" ON public.documents
    FOR DELETE TO authenticated USING (auth.uid() = user_id);

END $$;

-- Seed Data using another block
DO $$
DECLARE
  new_user_id uuid;
BEGIN
  -- Seed Auth User
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
      new_user_id, '00000000-0000-0000-0000-000000000000', 'leandro_teza@hotmail.com',
      crypt('Skip@Pass', gen_salt('bf')), NOW(), NOW(), NOW(),
      '{"provider": "email", "providers": ["email"]}', '{"name": "Leandro"}',
      false, 'authenticated', 'authenticated',
      '', '', '', '', '', NULL, '', '', ''
    );
  ELSE
    SELECT id INTO new_user_id FROM auth.users WHERE email = 'leandro_teza@hotmail.com' LIMIT 1;
  END IF;

  -- Seed Documents if empty
  IF NOT EXISTS (SELECT 1 FROM public.documents WHERE user_id = new_user_id) THEN
    INSERT INTO public.documents (id, user_id, name, category, status, file_url, size, created_at) VALUES
      (gen_random_uuid(), new_user_id, 'Guia de GPS - 10/2023', 'Impostos', 'Aprovado', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', '124 KB', NOW() - INTERVAL '10 days'),
      (gen_random_uuid(), new_user_id, 'Balanço Patrimonial 2022', 'Contábeis', 'Pendente', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', '1.2 MB', NOW() - INTERVAL '15 days'),
      (gen_random_uuid(), new_user_id, 'Alteração Contratual', 'Legais', 'Arquivado', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', '4.5 MB', NOW() - INTERVAL '20 days'),
      (gen_random_uuid(), new_user_id, 'Recibos de Férias', 'Folha de Pagamento', 'Aprovado', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', '340 KB', NOW() - INTERVAL '25 days'),
      (gen_random_uuid(), new_user_id, 'Notas Fiscais Set/23', 'Operacionais', 'Aprovado', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', '890 KB', NOW() - INTERVAL '30 days'),
      (gen_random_uuid(), new_user_id, 'Guia FGTS - 09/2023', 'Impostos', 'Arquivado', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', '150 KB', NOW() - INTERVAL '35 days'),
      (gen_random_uuid(), new_user_id, 'DRE - 3º Trimestre', 'Contábeis', 'Aprovado', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', '500 KB', NOW() - INTERVAL '40 days'),
      (gen_random_uuid(), new_user_id, 'Folha de Ponto - Agosto', 'Folha de Pagamento', 'Arquivado', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', '2.1 MB', NOW() - INTERVAL '45 days'),
      (gen_random_uuid(), new_user_id, 'Contrato de Prestação de Serviços', 'Legais', 'Aprovado', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', '1.8 MB', NOW() - INTERVAL '2 days'),
      (gen_random_uuid(), new_user_id, 'Holerites - Outubro', 'Folha de Pagamento', 'Pendente', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', '800 KB', NOW() - INTERVAL '5 days'),
      (gen_random_uuid(), new_user_id, 'DAS - 10/2023', 'Impostos', 'Pendente', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', '110 KB', NOW() - INTERVAL '1 day'),
      (gen_random_uuid(), new_user_id, 'Relatório Gerencial Set', 'Operacionais', 'Aprovado', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', '3.2 MB', NOW() - INTERVAL '8 days');
  END IF;

END $$;
