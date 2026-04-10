import { z } from 'zod'

export const formSchema = z.object({
  id: z.string().optional(),
  ativo: z.boolean().default(true),
  tipo_cliente: z.enum(['PF', 'PJ']).default('PJ'),

  nome: z.string().min(1, 'Nome é obrigatório'),
  cnpj: z.string().min(1, 'Documento (CPF/CNPJ) é obrigatório'),
  razao_social: z.string().optional(),
  data_abertura: z.string().optional(),

  nacionalidade: z.string().optional(),
  estado_civil: z.string().optional(),
  profissao: z.string().optional(),

  email: z.string().email('E-mail inválido').optional().or(z.literal('')),
  email_secundario: z.string().email('E-mail inválido').optional().or(z.literal('')),
  telefone: z.string().optional(),
  whatsapp: z.string().optional(),
  cep: z.string().optional(),
  logradouro: z.string().optional(),
  numero: z.string().optional(),
  complemento: z.string().optional(),
  bairro: z.string().optional(),
  cidade: z.string().optional(),
  estado: z.string().optional(),

  regime_tributario: z.string().optional(),
  inscricao_estadual: z.string().optional(),
  inscricao_municipal: z.string().optional(),
  cnae: z.string().optional(),
  enquadramento: z.string().optional(),

  responsavel_nome: z.string().optional(),
  responsavel_cpf: z.string().optional(),
  responsavel_telefone: z.string().optional(),

  banco: z.string().optional(),
  agencia: z.string().optional(),
  conta: z.string().optional(),
  tipo_conta: z.string().optional(),
  titular_conta: z.string().optional(),

  observacoes: z.string().optional(),
  sincronizado_rfb: z.boolean().optional(),
  data_ultima_sincronizacao: z.string().optional(),
})

export type ClienteFormValues = z.infer<typeof formSchema>
