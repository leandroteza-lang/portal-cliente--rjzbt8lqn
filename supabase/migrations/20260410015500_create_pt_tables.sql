-- 1. Criação da Tabela Clientes
CREATE TABLE IF NOT EXISTS public.clientes (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT,
  cnpj TEXT,
  razao_social TEXT,
  email TEXT,
  telefone TEXT,
  whatsapp TEXT,
  ativo BOOLEAN DEFAULT true,
  data_criacao TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Criação da Tabela Documentos
CREATE TABLE IF NOT EXISTS public.documentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID REFERENCES public.clientes(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  categoria TEXT NOT NULL,
  arquivo_url TEXT,
  status TEXT DEFAULT 'Processando',
  data_upload TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Criação da Tabela Vencimentos
CREATE TABLE IF NOT EXISTS public.vencimentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID REFERENCES public.clientes(id) ON DELETE CASCADE,
  tipo_guia TEXT NOT NULL,
  data_vencimento DATE NOT NULL,
  valor NUMERIC(10,2) NOT NULL,
  status TEXT DEFAULT 'Pendente'
);

-- 4. Criação da Tabela Notificacoes
CREATE TABLE IF NOT EXISTS public.notificacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID REFERENCES public.clientes(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL,
  mensagem TEXT NOT NULL,
  lido BOOLEAN DEFAULT false,
  data_criacao TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vencimentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notificacoes ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para Clientes
DROP POLICY IF EXISTS "authenticated_select_clientes" ON public.clientes;
CREATE POLICY "authenticated_select_clientes" ON public.clientes
  FOR SELECT TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "authenticated_update_clientes" ON public.clientes;
CREATE POLICY "authenticated_update_clientes" ON public.clientes
  FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "authenticated_insert_clientes" ON public.clientes;
CREATE POLICY "authenticated_insert_clientes" ON public.clientes
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- Políticas RLS para Documentos
DROP POLICY IF EXISTS "authenticated_select_documentos" ON public.documentos;
CREATE POLICY "authenticated_select_documentos" ON public.documentos
  FOR SELECT TO authenticated USING (auth.uid() = cliente_id);

DROP POLICY IF EXISTS "authenticated_insert_documentos" ON public.documentos;
CREATE POLICY "authenticated_insert_documentos" ON public.documentos
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = cliente_id);

DROP POLICY IF EXISTS "authenticated_update_documentos" ON public.documentos;
CREATE POLICY "authenticated_update_documentos" ON public.documentos
  FOR UPDATE TO authenticated USING (auth.uid() = cliente_id);

DROP POLICY IF EXISTS "authenticated_delete_documentos" ON public.documentos;
CREATE POLICY "authenticated_delete_documentos" ON public.documentos
  FOR DELETE TO authenticated USING (auth.uid() = cliente_id);

-- Políticas RLS para Vencimentos
DROP POLICY IF EXISTS "authenticated_select_vencimentos" ON public.vencimentos;
CREATE POLICY "authenticated_select_vencimentos" ON public.vencimentos
  FOR SELECT TO authenticated USING (auth.uid() = cliente_id);

-- Políticas RLS para Notificacoes
DROP POLICY IF EXISTS "authenticated_select_notificacoes" ON public.notificacoes;
CREATE POLICY "authenticated_select_notificacoes" ON public.notificacoes
  FOR SELECT TO authenticated USING (auth.uid() = cliente_id);

DROP POLICY IF EXISTS "authenticated_update_notificacoes" ON public.notificacoes;
CREATE POLICY "authenticated_update_notificacoes" ON public.notificacoes
  FOR UPDATE TO authenticated USING (auth.uid() = cliente_id) WITH CHECK (auth.uid() = cliente_id);

-- Atualizar Trigger para manter a tabela clientes e profiles em sincronia
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $function$
BEGIN
  -- Popula profiles
  INSERT INTO public.profiles (
    id, 
    email, 
    full_name, 
    document_number, 
    company_name, 
    phone
  )
  VALUES (
    NEW.id, 
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'document_number',
    NEW.raw_user_meta_data->>'company_name',
    NEW.raw_user_meta_data->>'phone'
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name),
    document_number = COALESCE(EXCLUDED.document_number, public.profiles.document_number),
    company_name = COALESCE(EXCLUDED.company_name, public.profiles.company_name),
    phone = COALESCE(EXCLUDED.phone, public.profiles.phone);

  -- Popula clientes
  INSERT INTO public.clientes (
    id, 
    email, 
    nome, 
    cnpj, 
    razao_social, 
    telefone
  )
  VALUES (
    NEW.id, 
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'document_number',
    NEW.raw_user_meta_data->>'company_name',
    NEW.raw_user_meta_data->>'phone'
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    nome = COALESCE(EXCLUDED.nome, public.clientes.nome),
    cnpj = COALESCE(EXCLUDED.cnpj, public.clientes.cnpj),
    razao_social = COALESCE(EXCLUDED.razao_social, public.clientes.razao_social),
    telefone = COALESCE(EXCLUDED.telefone, public.clientes.telefone);

  RETURN NEW;
END;
$function$ LANGUAGE plpgsql SECURITY DEFINER;

-- Semeia clientes baseados nos usuários existentes para evitar quebra de chave estrangeira
INSERT INTO public.clientes (id, email, nome, razao_social)
SELECT id, email, full_name, company_name FROM public.profiles
ON CONFLICT (id) DO NOTHING;

-- Semeia dados fictícios nas novas tabelas para usuários existentes
DO $DO_BLOCK$
DECLARE
  seed_user_id uuid;
BEGIN
  SELECT id INTO seed_user_id FROM auth.users WHERE email = 'leandro_teza@hotmail.com' LIMIT 1;
  
  IF seed_user_id IS NOT NULL THEN
    -- Garante a inserção do cliente caso não tenha sido gerado
    INSERT INTO public.clientes (id, nome, cnpj, razao_social, email, telefone, whatsapp, ativo)
    VALUES (seed_user_id, 'Leandro Teza', '12.345.678/0001-90', 'Teza Tech LTDA', 'leandro_teza@hotmail.com', '(11) 99999-9999', '(11) 99999-9999', true)
    ON CONFLICT (id) DO NOTHING;

    -- Documentos
    INSERT INTO public.documentos (id, cliente_id, nome, categoria, arquivo_url, status)
    VALUES 
      (gen_random_uuid(), seed_user_id, 'Contrato Social Registrado', 'Legais', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', 'Concluído'),
      (gen_random_uuid(), seed_user_id, 'Balanço Patrimonial 2025', 'Contábeis', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', 'Processando'),
      (gen_random_uuid(), seed_user_id, 'Recibos Férias 02/2026', 'Folha de Pagamento', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', 'Concluído')
    ON CONFLICT DO NOTHING;

    -- Vencimentos
    INSERT INTO public.vencimentos (id, cliente_id, tipo_guia, data_vencimento, valor, status)
    VALUES
      (gen_random_uuid(), seed_user_id, 'DAS', CURRENT_DATE + INTERVAL '5 days', 1500.50, 'Pendente'),
      (gen_random_uuid(), seed_user_id, 'IRPJ', CURRENT_DATE + INTERVAL '10 days', 3200.00, 'Pendente'),
      (gen_random_uuid(), seed_user_id, 'PIS/COFINS', CURRENT_DATE - INTERVAL '2 days', 450.00, 'Pago'),
      (gen_random_uuid(), seed_user_id, 'ISS', CURRENT_DATE + INTERVAL '15 days', 2100.00, 'Enviado')
    ON CONFLICT DO NOTHING;

    -- Notificações
    INSERT INTO public.notificacoes (id, cliente_id, tipo, mensagem, lido)
    VALUES
      (gen_random_uuid(), seed_user_id, 'In-app', 'Seu documento Balanço Patrimonial 2025 está sendo processado.', false),
      (gen_random_uuid(), seed_user_id, 'Email', 'Lembrete: Guia DAS vence em 5 dias.', false),
      (gen_random_uuid(), seed_user_id, 'WhatsApp', 'Confirmação de recebimento da folha de pagamento.', true)
    ON CONFLICT DO NOTHING;
  END IF;
END $DO_BLOCK$;
