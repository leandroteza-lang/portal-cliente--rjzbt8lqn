ALTER TABLE public.clientes 
  ADD COLUMN IF NOT EXISTS tipo_cliente text DEFAULT 'PJ',
  ADD COLUMN IF NOT EXISTS responsavel_nome text,
  ADD COLUMN IF NOT EXISTS responsavel_cpf text,
  ADD COLUMN IF NOT EXISTS responsavel_telefone text;
