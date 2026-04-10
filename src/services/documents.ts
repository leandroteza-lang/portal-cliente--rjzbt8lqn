import { supabase } from '@/lib/supabase/client'

export interface Document {
  id: string
  name: string
  category: string
  status: string
  file_url: string
  size: string
  created_at: string
}

export async function fetchDocuments(
  page: number,
  pageSize: number,
  search: string,
  category: string,
) {
  let query = supabase.from('documents').select('*', { count: 'exact' })

  if (search) {
    query = query.ilike('name', `%${search}%`)
  }

  if (category && category !== 'todas') {
    query = query.eq('category', category)
  }

  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  query = query.range(from, to).order('created_at', { ascending: false })

  const { data, error, count } = await query

  if (error) throw error

  return {
    data: data as Document[],
    count: count || 0,
  }
}

export async function deleteDocument(id: string) {
  const { error } = await supabase.from('documents').delete().eq('id', id)
  if (error) throw error
}
