import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { corsHeaders } from '../_shared/cors.ts'

function arrayBufferToBase64(buffer: ArrayBuffer) {
  let binary = ''
  const bytes = new Uint8Array(buffer)
  const len = bytes.byteLength
  for (let i = 0; i < len; i += 32768) {
    binary += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + 32768)))
  }
  return btoa(binary)
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    let body = {}
    try {
      body = await req.json()
    } catch (e) {
      // Ignora erro de JSON vazio (caso não envie body)
    }

    const { pasta_id } = body as any

    const apiKey = Deno.env.get('GOOGLE_DRIVE_API_KEY')
    const folderId = pasta_id || Deno.env.get('GOOGLE_DRIVE_FOLDER_ID')

    if (!apiKey) {
      throw new Error('GOOGLE_DRIVE_API_KEY não configurada no Supabase Secrets.')
    }
    if (!folderId) {
      throw new Error('folderId não fornecido e GOOGLE_DRIVE_FOLDER_ID não configurado.')
    }

    // List files from Google Drive
    const listUrl = `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents+and+mimeType='application/pdf'&key=${apiKey}&fields=files(id,name)`
    const listResponse = await fetch(listUrl)

    if (!listResponse.ok) {
      throw new Error(`Falha ao listar arquivos: ${listResponse.statusText}`)
    }

    const listData = await listResponse.json()
    const files = listData.files || []

    const pdfs = []

    // Download each file and convert to Base64
    for (const file of files) {
      const downloadUrl = `https://www.googleapis.com/drive/v3/files/${file.id}?alt=media&key=${apiKey}`
      const downloadResponse = await fetch(downloadUrl)

      if (downloadResponse.ok) {
        const arrayBuffer = await downloadResponse.arrayBuffer()
        const base64 = arrayBufferToBase64(arrayBuffer)
        pdfs.push({
          id: file.id,
          nome: file.name,
          base64: base64,
        })
      }
    }

    return new Response(JSON.stringify({ success: true, data: pdfs }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
