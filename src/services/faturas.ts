import { supabase } from '@/lib/supabase/client'

export interface Fatura {
  id: string
  cliente_id: string
  descricao: string
  valor: number
  data_vencimento: string
  status: 'Pendente' | 'Pago' | 'Atrasado'
  codigo_barras: string | null
  link_boleto: string | null
  data_pagamento: string | null
  created_at: string
}

export const getFaturas = async () => {
  const { data, error } = await supabase
    .from('faturas' as any)
    .select('*')
    .order('data_vencimento', { ascending: false })

  if (error) throw error
  return data as Fatura[]
}
