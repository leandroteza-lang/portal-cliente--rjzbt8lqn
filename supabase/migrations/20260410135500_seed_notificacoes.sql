DO $$
DECLARE
  v_user_id uuid;
BEGIN
  SELECT id INTO v_user_id FROM auth.users WHERE email = 'leandro_teza@hotmail.com' LIMIT 1;

  IF v_user_id IS NOT NULL THEN
    INSERT INTO public.notificacoes (id, cliente_id, tipo, mensagem, lido, data_criacao)
    VALUES
      (gen_random_uuid(), v_user_id, 'vencimento', 'A guia DAS referente ao mês anterior já está disponível para pagamento.', false, NOW() - INTERVAL '2 hours'),
      (gen_random_uuid(), v_user_id, 'documento', 'O documento "Alteração Contratual.pdf" foi processado e aprovado com sucesso.', false, NOW() - INTERVAL '1 day'),
      (gen_random_uuid(), v_user_id, 'aviso', 'Faltam 2 dias para o fechamento da folha de pagamento.', false, NOW() - INTERVAL '2 days'),
      (gen_random_uuid(), v_user_id, 'aviso', 'Novas funcionalidades de filtro adicionadas à aba Meus Documentos.', true, NOW() - INTERVAL '5 days')
    ON CONFLICT DO NOTHING;
  END IF;
END $$;
