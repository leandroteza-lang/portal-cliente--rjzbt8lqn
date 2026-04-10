import { useState } from 'react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase/client'

export function useRfb(form: any) {
  const [isFetchingRfb, setIsFetchingRfb] = useState(false)

  const handleBuscarRfb = async () => {
    const cnpj = form.getValues('cnpj')
    if (!cnpj) return toast.error('Informe o documento (CPF/CNPJ) para buscar.')

    setIsFetchingRfb(true)
    try {
      const { data, error } = await supabase.functions.invoke('fetch-rfb-data', { body: { cnpj } })
      if (error || !data?.success) throw new Error(data?.error || error?.message || 'Erro na busca')

      const rfbData = data.data
      form.setValue('razao_social', rfbData.razao_social || '')
      form.setValue('nome', rfbData.nome_fantasia || rfbData.razao_social || form.getValues('nome'))

      if (rfbData.data_abertura) form.setValue('data_abertura', rfbData.data_abertura)
      if (rfbData.telefone) form.setValue('telefone', rfbData.telefone)
      if (rfbData.email) form.setValue('email', rfbData.email)
      if (rfbData.cep) form.setValue('cep', rfbData.cep.replace(/\D/g, ''))
      if (rfbData.logradouro) form.setValue('logradouro', rfbData.logradouro)
      if (rfbData.numero) form.setValue('numero', rfbData.numero)
      if (rfbData.complemento) form.setValue('complemento', rfbData.complemento)
      if (rfbData.bairro) form.setValue('bairro', rfbData.bairro)
      if (rfbData.cidade) form.setValue('cidade', rfbData.cidade)
      if (rfbData.estado) form.setValue('estado', rfbData.estado)
      if (rfbData.cnae) form.setValue('cnae', rfbData.cnae)
      if (rfbData.natureza_juridica) form.setValue('enquadramento', rfbData.natureza_juridica)

      form.setValue('sincronizado_rfb', true)
      form.setValue('data_ultima_sincronizacao', new Date().toISOString())
      toast.success('Dados importados com sucesso!')
    } catch (err: any) {
      toast.error(err.message || 'Erro na busca. Verifique se o documento é válido.')
    } finally {
      setIsFetchingRfb(false)
    }
  }

  return { isFetchingRfb, handleBuscarRfb }
}
