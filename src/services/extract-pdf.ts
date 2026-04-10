import { supabase } from '@/lib/supabase/client'

export interface ExtractedPdfData {
  cliente: string
  valor: string
  tipo_documento: string
  data_vencimento: string
}

export interface ExtractPdfResponse {
  success: boolean
  data?: ExtractedPdfData
  error?: string
}

export async function extractPdfData(
  fileBase64?: string,
  fileUrl?: string,
): Promise<ExtractPdfResponse> {
  const { data, error } = await supabase.functions.invoke('extract-pdf-data', {
    body: {
      file: fileBase64,
      fileUrl: fileUrl,
    },
  })

  if (error) {
    console.error('Erro ao invocar a função extract-pdf-data:', error)
    return { success: false, error: error.message }
  }

  return data as ExtractPdfResponse
}
