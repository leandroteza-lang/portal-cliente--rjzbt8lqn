import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { fetchGoogleDrivePdfs } from '@/services/google-drive'
import { useToast } from '@/hooks/use-toast'
import { DownloadCloud, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'

export function GoogleDriveSync() {
  const [isSyncing, setIsSyncing] = useState(false)
  const { toast } = useToast()

  const handleSync = async () => {
    setIsSyncing(true)
    try {
      const result = await fetchGoogleDrivePdfs()

      if (!result.success || !result.data) {
        throw new Error(result.error || 'Erro desconhecido ao buscar arquivos do Google Drive')
      }

      const pdfs = result.data

      if (pdfs.length === 0) {
        toast({
          title: 'Sincronização concluída',
          description: 'Nenhum PDF novo encontrado no Google Drive.',
        })
        return
      }

      let processados = 0

      for (const pdf of pdfs) {
        // Usa a edge function do Gemini para extrair dados estruturados
        const extractRes = await supabase.functions.invoke('extract-pdf-data', {
          body: { file: pdf.base64 },
        })

        const extractedData = extractRes.data?.data

        let valor = 0
        let data_vencimento = new Date().toISOString().split('T')[0]
        let categoria = 'Outros'

        if (extractedData) {
          valor = parseFloat(extractedData.valor?.replace(',', '.') || '0')
          if (!isNaN(Date.parse(extractedData.data_vencimento))) {
            data_vencimento = extractedData.data_vencimento
          }
          categoria = extractedData.tipo_documento || 'Outros'
        }

        // Insere na tabela documentos (o trigger 'on_document_created' no BD disparará as notificações automaticamente)
        await supabase.from('documentos').insert({
          nome: pdf.nome,
          categoria,
          valor,
          data_vencimento,
          status: 'Processado',
        } as any)

        processados++
      }

      toast({
        title: 'Sincronização concluída',
        description: `${processados} documento(s) processado(s) e notificação(ões) enviada(s).`,
      })
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erro na sincronização',
        description: error.message || 'Falha ao buscar arquivos do Google Drive.',
      })
    } finally {
      setIsSyncing(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DownloadCloud className="w-5 h-5 text-primary" />
          Sincronização Google Drive
        </CardTitle>
        <CardDescription>
          Busque novos documentos em PDF da sua pasta configurada, extraia dados via IA e notifique
          os clientes automaticamente.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={handleSync} disabled={isSyncing} className="w-full sm:w-auto">
          {isSyncing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Sincronizando PDFs...
            </>
          ) : (
            <>Buscar e Processar Documentos</>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
