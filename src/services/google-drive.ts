import { supabase } from '@/lib/supabase/client'

export interface GoogleDrivePdf {
  id: string
  nome: string
  base64: string
}

export const fetchGoogleDrivePdfs = async (
  pastaId?: string,
): Promise<{ success: boolean; data?: GoogleDrivePdf[]; error?: string }> => {
  try {
    const { data, error } = await supabase.functions.invoke('fetch-google-drive-pdfs', {
      body: pastaId ? { pasta_id: pastaId } : {},
    })

    if (error) throw error
    return data
  } catch (err: any) {
    console.error('Erro ao buscar PDFs do Google Drive:', err)
    return { success: false, error: err.message }
  }
}
