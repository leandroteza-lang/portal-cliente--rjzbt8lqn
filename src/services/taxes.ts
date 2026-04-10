import { supabase } from '@/lib/supabase/client'

export type Tax = {
  id: string
  user_id: string
  title: string
  tax_type: string
  due_date: string
  amount: number
  status: string
  created_at: string
  updated_at: string
}

export const getTaxes = async () => {
  const { data, error } = await supabase
    .from('taxes')
    .select('*')
    .order('due_date', { ascending: true })

  if (error) throw error
  return data as Tax[]
}
