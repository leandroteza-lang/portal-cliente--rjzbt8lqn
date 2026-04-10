import 'jsr:@supabase/functions-js/edge-runtime.d.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, x-supabase-client-platform, apikey, content-type',
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { cnpj } = await req.json()
    if (!cnpj) throw new Error('CNPJ ou CPF é obrigatório.')

    const cleanDoc = cnpj.replace(/\D/g, '')

    if (cleanDoc.length === 14) {
      const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cleanDoc}`)

      if (!response.ok) {
        throw new Error('CNPJ não encontrado na base de dados da Receita Federal.')
      }

      const data = await response.json()

      const result = {
        razao_social: data.razao_social,
        nome_fantasia: data.nome_fantasia || data.razao_social,
        situacao_cadastral: data.descricao_situacao_cadastral,
        data_abertura: data.data_inicio_atividade,
        telefone: data.ddd_telefone_1 || data.ddd_telefone_2 || '',
        email: data.email || '',
        endereco:
          `${data.logradouro || ''}, ${data.numero || ''} - ${data.bairro || ''}, ${data.municipio || ''} - ${data.uf || ''}, ${data.cep || ''}`.replace(
            /^[,\s-]+|[,\s-]+$/g,
            '',
          ),
        cep: data.cep || '',
        logradouro: data.logradouro || '',
        numero: data.numero || '',
        complemento: data.complemento || '',
        bairro: data.bairro || '',
        cidade: data.municipio || '',
        estado: data.uf || '',
        cnae: data.cnae_fiscal_descricao
          ? `${data.cnae_fiscal} - ${data.cnae_fiscal_descricao}`
          : data.cnae_fiscal || '',
        natureza_juridica: data.natureza_juridica || '',
      }

      return new Response(JSON.stringify({ success: true, data: result }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    } else {
      throw new Error('Apenas CNPJ (14 dígitos) é suportado no momento pela API.')
    }
  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
