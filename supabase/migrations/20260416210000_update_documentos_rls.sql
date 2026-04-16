DO $$
BEGIN
  -- Drop existing admin policies if any
  DROP POLICY IF EXISTS "authenticated_admin_insert_documentos" ON public.documentos;
  DROP POLICY IF EXISTS "authenticated_admin_update_documentos" ON public.documentos;
  DROP POLICY IF EXISTS "authenticated_admin_delete_documentos" ON public.documentos;

  -- Create policies
  CREATE POLICY "authenticated_admin_insert_documentos" ON public.documentos
    FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true));

  CREATE POLICY "authenticated_admin_update_documentos" ON public.documentos
    FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true));

  CREATE POLICY "authenticated_admin_delete_documentos" ON public.documentos
    FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true));
END $$;
