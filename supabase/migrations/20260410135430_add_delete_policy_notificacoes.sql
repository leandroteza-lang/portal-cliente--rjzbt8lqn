DROP POLICY IF EXISTS "authenticated_delete_notificacoes" ON public.notificacoes;

CREATE POLICY "authenticated_delete_notificacoes" ON public.notificacoes
  FOR DELETE TO authenticated USING (auth.uid() = cliente_id);
