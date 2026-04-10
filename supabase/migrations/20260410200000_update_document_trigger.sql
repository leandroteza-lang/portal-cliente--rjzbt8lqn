-- Adiciona colunas valor e data_vencimento na tabela documentos se precisarmos armazenar
ALTER TABLE public.documentos ADD COLUMN IF NOT EXISTS valor numeric;
ALTER TABLE public.documentos ADD COLUMN IF NOT EXISTS data_vencimento date;

CREATE OR REPLACE FUNCTION public.handle_new_document()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  v_email text;
  v_whatsapp text;
  v_assunto text := 'Novo Documento Processado';
  v_mensagem text;
  v_valor numeric;
  v_vencimento date;
  v_supabase_url text := current_setting('app.settings.supabase_url', true);
  v_anon_key text := current_setting('app.settings.supabase_anon_key', true);
BEGIN
  -- Fallback para chaves baseadas no ambiente original (caso não haja custom settings)
  IF v_supabase_url IS NULL OR v_supabase_url = '' THEN
    v_supabase_url := 'https://gdrwxnsrfshibtvrnsbn.supabase.co';
  END IF;
  
  IF v_anon_key IS NULL OR v_anon_key = '' THEN
    v_anon_key := 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdkcnd4bnNyZnNoaWJ0dnJuc2JuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3ODE2NTUsImV4cCI6MjA5MTM1NzY1NX0.g4jsxO4jaRHx9aUrPFI4OygW4dC3dH04eIQ3DhoZnEA';
  END IF;

  -- Busca o e-mail e WhatsApp do cliente na tabela "clientes"
  SELECT email, whatsapp INTO v_email, v_whatsapp
  FROM public.clientes
  WHERE id = NEW.cliente_id;

  v_valor := NULL;
  v_vencimento := NULL;
  
  -- Extrai os valores usando EXECUTE para garantir que veja as colunas adicionadas independentemente do cache do tipo de ROW
  EXECUTE 'SELECT valor, data_vencimento FROM public.documentos WHERE id = $1'
  INTO v_valor, v_vencimento
  USING NEW.id;

  -- Se não encontrar na tabela documentos, tenta buscar na tabela de vencimentos cruzando pelo cliente_id
  IF (v_valor IS NULL OR v_vencimento IS NULL) AND NEW.cliente_id IS NOT NULL THEN
    SELECT valor, data_vencimento INTO v_valor, v_vencimento
    FROM public.vencimentos
    WHERE cliente_id = NEW.cliente_id AND tipo_guia = NEW.categoria
    ORDER BY data_vencimento DESC
    LIMIT 1;
  END IF;

  -- Monta a mensagem estruturada e final para notificação
  v_mensagem := 'Olá! Um novo documento foi processado e disponibilizado no seu portal.' || CHR(10) ||
                'Nome do Documento: ' || NEW.nome || CHR(10) ||
                'Tipo: ' || NEW.categoria;
                
  IF v_valor IS NOT NULL THEN
    v_mensagem := v_mensagem || CHR(10) || 'Valor: R$ ' || v_valor;
  END IF;
  
  IF v_vencimento IS NOT NULL THEN
    v_mensagem := v_mensagem || CHR(10) || 'Vencimento: ' || TO_CHAR(v_vencimento, 'DD/MM/YYYY');
  END IF;

  -- Dispara o e-mail via net.http_post consumindo a Edge Function "send-email"
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

  -- Dispara a mensagem via net.http_post consumindo a Edge Function "send-whatsapp"
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

  -- Registra a notificação final na tabela
  INSERT INTO public.notificacoes (cliente_id, tipo, mensagem, status, lido, data_criacao)
  VALUES (NEW.cliente_id, 'Documento do Google Drive', v_mensagem, 'Enviado', false, now());

  RETURN NEW;
END;
$function$;
