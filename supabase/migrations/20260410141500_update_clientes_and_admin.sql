DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clientes' AND column_name = 'preferencias_notificacao') THEN
        ALTER TABLE public.clientes ADD COLUMN preferencias_notificacao JSONB DEFAULT '{"email": true, "whatsapp": false, "sms": false}'::jsonb;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'is_admin') THEN
        ALTER TABLE public.profiles ADD COLUMN is_admin BOOLEAN DEFAULT false;
    END IF;
END $$;

DROP POLICY IF EXISTS "authenticated_admin_select_clientes" ON public.clientes;
CREATE POLICY "authenticated_admin_select_clientes" ON public.clientes
  FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
  );

DROP POLICY IF EXISTS "authenticated_admin_select_documentos" ON public.documentos;
CREATE POLICY "authenticated_admin_select_documentos" ON public.documentos
  FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
  );

DROP POLICY IF EXISTS "authenticated_admin_select_vencimentos" ON public.vencimentos;
CREATE POLICY "authenticated_admin_select_vencimentos" ON public.vencimentos
  FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
  );

DO $$
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
      crypt('Skip@Pass', gen_salt('bf')),
      NOW(), NOW(), NOW(),
      '{"provider": "email", "providers": ["email"]}',
      '{"full_name": "Leandro Teza", "company_name": "Escritório Costa"}',
      false, 'authenticated', 'authenticated',
      '', '', '', '', '', NULL, '', '', ''
    );

    INSERT INTO public.profiles (id, email, full_name, is_admin)
    VALUES (new_user_id, 'leandro_teza@hotmail.com', 'Leandro Teza', true)
    ON CONFLICT (id) DO UPDATE SET is_admin = true;
    
    INSERT INTO public.clientes (id, email, nome)
    VALUES (new_user_id, 'leandro_teza@hotmail.com', 'Leandro Teza')
    ON CONFLICT (id) DO NOTHING;
  ELSE
    UPDATE public.profiles 
    SET is_admin = true 
    WHERE email = 'leandro_teza@hotmail.com';
  END IF;
END $$;
