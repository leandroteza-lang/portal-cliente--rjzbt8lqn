-- Add admin policies for clientes to allow admins to insert, update and delete any client
DROP POLICY IF EXISTS "authenticated_admin_insert_clientes" ON public.clientes;
CREATE POLICY "authenticated_admin_insert_clientes" ON public.clientes
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS ( SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true ));

DROP POLICY IF EXISTS "authenticated_admin_update_clientes" ON public.clientes;
CREATE POLICY "authenticated_admin_update_clientes" ON public.clientes
  FOR UPDATE TO authenticated
  USING (EXISTS ( SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true ))
  WITH CHECK (EXISTS ( SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true ));

DROP POLICY IF EXISTS "authenticated_admin_delete_clientes" ON public.clientes;
CREATE POLICY "authenticated_admin_delete_clientes" ON public.clientes
  FOR DELETE TO authenticated
  USING (EXISTS ( SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true ));

-- Also fix admin RLS for profiles using a security definer function to avoid infinite recursion
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP POLICY IF EXISTS "authenticated_admin_select_profiles" ON public.profiles;
CREATE POLICY "authenticated_admin_select_profiles" ON public.profiles
  FOR SELECT TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "authenticated_admin_insert_profiles" ON public.profiles;
CREATE POLICY "authenticated_admin_insert_profiles" ON public.profiles
  FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "authenticated_admin_update_profiles" ON public.profiles;
CREATE POLICY "authenticated_admin_update_profiles" ON public.profiles
  FOR UPDATE TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "authenticated_admin_delete_profiles" ON public.profiles;
CREATE POLICY "authenticated_admin_delete_profiles" ON public.profiles
  FOR DELETE TO authenticated
  USING (public.is_admin());
