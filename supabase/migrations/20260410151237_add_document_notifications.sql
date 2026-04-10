CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

CREATE OR REPLACE FUNCTION public.handle_new_document()
RETURNS trigger AS $function$
DECLARE
  v_email text;
  v_whatsapp text;
  v_assunto text := 'Novo Documento Recebido';
  v_mensagem text;
  v_supabase_url text := 'https://gdrwxnsrfshibtvrnsbn.supabase.co';
  v_anon_key text := 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdkcnd4bnNyZnNoaWJ0dnJuc2JuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3ODE2NTUsImV4cCI6MjA5MTM1NzY1NX0.g4jsxO4jaRHx9aUrPFI4OygW4dC3dH04eIQ3DhoZnEA';
BEGIN
  -- Busque o e-mail e WhatsApp do cliente na tabela "clientes"
  SELECT email, whatsapp INTO v_email, v_whatsapp
  FROM public.clientes
  WHERE id = NEW.cliente_id;

  v_mensagem := 'Um novo documento foi disponibilizado no seu portal: ' || NEW.nome || ' (Categoria: ' || NEW.categoria || ').';

  -- Envie um e-mail via Edge Function "send-email"
  IF v_email IS NOT NULL AND v_email != '' THEN
    PERFORM net.http_post(
      url := v_supabase_url || '/functions/v1/send-email',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || v_anon_key
      ),
      body := jsonb_build_object(
        'cliente_email', v_email,
        'assunto', v_assunto,
        'mensagem', v_mensagem
      )
    );
  END IF;

  -- Envie uma mensagem WhatsApp via Edge Function "send-whatsapp"
  IF v_whatsapp IS NOT NULL AND v_whatsapp != '' THEN
    PERFORM net.http_post(
      url := v_supabase_url || '/functions/v1/send-whatsapp',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || v_anon_key
      ),
      body := jsonb_build_object(
        'cliente_whatsapp', v_whatsapp,
        'mensagem', v_mensagem
      )
    );
  END IF;

  -- Registre a notificação na tabela "notificacoes" com tipo "Novo Documento" e status "Enviado"
  INSERT INTO public.notificacoes (cliente_id, tipo, mensagem, status, lido, data_criacao)
  VALUES (NEW.cliente_id, 'Novo Documento', v_mensagem, 'Enviado', false, now());

  RETURN NEW;
END;
$function$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_document_created ON public.documentos;
CREATE TRIGGER on_document_created
  AFTER INSERT ON public.documentos
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_document();
