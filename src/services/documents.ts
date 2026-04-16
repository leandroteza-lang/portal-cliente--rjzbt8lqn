import { supabase } from '@/lib/supabase/client'

export interface Document {
  id: string
  nome: string
  categoria: string
  status: string | null
  arquivo_url: string | null
  data_upload: string | null
}

export async function fetchDocuments(
  page: number,
  pageSize: number,
  search: string,
  category: string,
  userId: string,
) {
  let query = supabase.from('documentos').select('*', { count: 'exact' }).eq('cliente_id', userId)

  if (search) {
    query = query.ilike('nome', `%${search}%`)
  }

  if (category && category !== 'todas') {
    query = query.eq('categoria', category)
  }

  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  query = query.range(from, to).order('data_upload', { ascending: false })

  const { data, error, count } = await query

  if (error) throw error

  return {
    data: (data || []) as Document[],
    count: count || 0,
  }
}

export async function deleteDocument(id: string) {
  const { error } = await supabase.from('documentos').delete().eq('id', id)
  if (error) throw error
}
