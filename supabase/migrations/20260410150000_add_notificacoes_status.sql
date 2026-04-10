DO $$
BEGIN
  ALTER TABLE public.notificacoes ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Enviado';
END $$;
