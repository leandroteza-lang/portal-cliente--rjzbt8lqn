DO $$
DECLARE
  v_user_id uuid;
BEGIN
  -- Check if costa.assessoria@hotmail.com already exists
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'costa.assessoria@hotmail.com') THEN
    v_user_id := gen_random_uuid();
    
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at,
      created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
      is_super_admin, role, aud,
      confirmation_token, recovery_token, email_change_token_new,
      email_change, email_change_token_current,
      phone, phone_change, phone_change_token, reauthentication_token
    ) VALUES (
      v_user_id,
      '00000000-0000-0000-0000-000000000000',
      'costa.assessoria@hotmail.com',
      crypt('Skip@Pass', gen_salt('bf')),
      NOW(), NOW(), NOW(),
      '{"provider": "email", "providers": ["email"]}',
      '{"full_name": "Administrador Costa Assessoria"}',
      false, 'authenticated', 'authenticated',
      '', '', '', '', '',
      NULL, '', '', ''
    );

    -- Insert or update into profiles table to ensure admin rights
    INSERT INTO public.profiles (id, email, full_name, is_admin)
    VALUES (v_user_id, 'costa.assessoria@hotmail.com', 'Administrador Costa Assessoria', true)
    ON CONFLICT (id) DO UPDATE SET is_admin = true;
    
  ELSE
    -- If user exists, get the ID and ensure they have admin privileges
    SELECT id INTO v_user_id FROM auth.users WHERE email = 'costa.assessoria@hotmail.com';
    
    UPDATE public.profiles 
    SET is_admin = true 
    WHERE id = v_user_id;
  END IF;
END $$;
