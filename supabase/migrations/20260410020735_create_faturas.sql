DO $$
BEGIN
  CREATE TABLE IF NOT EXISTS public.faturas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cliente_id UUID REFERENCES public.clientes(id) ON DELETE CASCADE,
    descricao TEXT NOT NULL,
    valor NUMERIC NOT NULL,
    data_vencimento DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'Pendente',
    codigo_barras TEXT,
    link_boleto TEXT,
    data_pagamento TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );
EXCEPTION
  WHEN duplicate_table THEN NULL;
END $$;

ALTER TABLE public.faturas ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "authenticated_select_faturas" ON public.faturas;
CREATE POLICY "authenticated_select_faturas" ON public.faturas
  FOR SELECT TO authenticated USING (auth.uid() = cliente_id);

DO $$
DECLARE
  v_cliente_id UUID;
  v_count INT;
BEGIN
  -- Search for an existing active client to seed faturas
  SELECT id INTO v_cliente_id FROM public.clientes LIMIT 1;
  
  IF v_cliente_id IS NOT NULL THEN
    -- Check if client already has faturas
    SELECT count(*) INTO v_count FROM public.faturas WHERE cliente_id = v_cliente_id;
    
    IF v_count = 0 THEN
      INSERT INTO public.faturas (cliente_id, descricao, valor, data_vencimento, status, codigo_barras, link_boleto)
      VALUES 
        (v_cliente_id, 'Mensalidade Contábil - Março', 550.00, CURRENT_DATE - INTERVAL '5 days', 'Atrasado', '34191.09008 63396.931004 07164.710006 3 90000000000550', 'https://example.com/boleto1.pdf'),
        (v_cliente_id, 'Mensalidade Contábil - Abril', 550.00, CURRENT_DATE + INTERVAL '10 days', 'Pendente', '34191.09008 63396.931004 07164.710006 4 90000000000550', 'https://example.com/boleto2.pdf'),
        (v_cliente_id, 'Mensalidade Contábil - Fevereiro', 550.00, CURRENT_DATE - INTERVAL '35 days', 'Pago', NULL, NULL);
    END IF;
  END IF;
END $$;
