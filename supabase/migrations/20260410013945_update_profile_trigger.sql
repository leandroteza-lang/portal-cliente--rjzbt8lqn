CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $function$
BEGIN
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
  RETURN NEW;
END;
$function$ LANGUAGE plpgsql SECURITY DEFINER;
