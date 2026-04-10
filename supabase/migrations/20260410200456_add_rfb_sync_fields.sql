-- Add fields to clientes for RFB integration
ALTER TABLE public.clientes ADD COLUMN IF NOT EXISTS sincronizado_rfb BOOLEAN DEFAULT false;
ALTER TABLE public.clientes ADD COLUMN IF NOT EXISTS data_ultima_sincronizacao TIMESTAMPTZ;
ALTER TABLE public.clientes ADD COLUMN IF NOT EXISTS situacao_cadastral TEXT;
ALTER TABLE public.clientes ADD COLUMN IF NOT EXISTS endereco TEXT;
ALTER TABLE public.clientes ADD COLUMN IF NOT EXISTS data_abertura DATE;

-- Create history table
CREATE TABLE IF NOT EXISTS public.historico_clientes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
  data_sincronizacao TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  dados_antigos JSONB,
  dados_novos JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS
ALTER TABLE public.historico_clientes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "authenticated_admin_select_historico" ON public.historico_clientes;
CREATE POLICY "authenticated_admin_select_historico" ON public.historico_clientes
  FOR SELECT TO authenticated USING (
    EXISTS ( SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true )
  );

DROP POLICY IF EXISTS "authenticated_insert_historico" ON public.historico_clientes;
CREATE POLICY "authenticated_insert_historico" ON public.historico_clientes
  FOR INSERT TO authenticated WITH CHECK (
    EXISTS ( SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true )
  );
