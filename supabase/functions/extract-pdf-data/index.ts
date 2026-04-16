import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { GoogleGenerativeAI } from 'npm:@google/generative-ai@0.11.4';
import { corsHeaders } from '../_shared/cors.ts';

function arrayBufferToBase64(buffer: ArrayBuffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i += 32768) {
    binary += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + 32768)));
  }
  return btoa(binary);
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('GEMINI_API_KEY');
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY não configurada no Supabase Secrets.');
    }

    const body = await req.json();
    const { file, fileUrl } = body;

    if (!file && !fileUrl) {
      throw new Error('É necessário fornecer um arquivo (base64) ou uma URL (fileUrl).');
    }

    let base64Data = file;
    let mimeType = 'application/pdf';

    if (fileUrl) {
      const response = await fetch(fileUrl);
      if (!response.ok) {
        throw new Error(`Falha ao baixar o arquivo da URL: ${response.statusText}`);
      }
      const arrayBuffer = await response.arrayBuffer();
      base64Data = arrayBufferToBase64(arrayBuffer);
      mimeType = response.headers.get('content-type') || 'application/pdf';
    }

    // Remover prefixo de data URI caso venha no base64
    const base64Clean = base64Data ? base64Data.replace(/^data:.*?;base64,/, '') : '';

    const genAI = new GoogleGenerativeAI(apiKey);
    // Modelo otimizado para tarefas multimodais rápidas e eficientes
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `Analise este documento e extraia as seguintes informações em formato JSON estrito:
- cliente (Nome ou CNPJ)
- valor (valor monetário numérico ou string formatada, ex: "1500.50" ou "1.500,50")
- tipo_documento (ex: DARF, ICMS, ISS, Fatura, Boleto, NF-e, etc)
- data_vencimento (data de vencimento do documento, preferencialmente YYYY-MM-DD ou DD/MM/YYYY)

Retorne APENAS um JSON válido e nada mais. Exemplo de saída:
{
  "cliente": "Empresa XPTO / 00.000.000/0001-00",
  "valor": "1500.50",
  "tipo_documento": "DARF",
  "data_vencimento": "2023-12-31"
}`;

    const documentPart = {
      inlineData: {
        data: base64Clean,
        mimeType: mimeType
      },
    };

    const result = await model.generateContent([prompt, documentPart]);
    const responseText = result.response.text();
    
    // Limpar formatação Markdown caso a IA retorne blocos de código
    const cleanedText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    
    let extractedData;
    try {
      extractedData = JSON.parse(cleanedText);
    } catch (e) {
      throw new Error('Falha ao processar o retorno do Gemini como JSON: ' + cleanedText);
    }

    return new Response(JSON.stringify({ success: true, data: extractedData }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
