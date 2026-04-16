DO $$
BEGIN
  -- Confirma automaticamente usuários existentes que estão com e-mail não confirmado
  UPDATE auth.users 
  SET email_confirmed_at = NOW() 
  WHERE email_confirmed_at IS NULL;
END $$;

-- Cria a função para confirmar automaticamente novos usuários
CREATE OR REPLACE FUNCTION public.auto_confirm_user()
RETURNS trigger AS $$
BEGIN
  NEW.email_confirmed_at = COALESCE(NEW.email_confirmed_at, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Cria o trigger na tabela auth.users
DROP TRIGGER IF EXISTS on_auth_user_created_auto_confirm ON auth.users;
CREATE TRIGGER on_auth_user_created_auto_confirm
  BEFORE INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.auto_confirm_user();
