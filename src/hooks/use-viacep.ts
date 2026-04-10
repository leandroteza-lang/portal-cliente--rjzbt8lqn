import { useState } from 'react'
import { toast } from 'sonner'

export function useViaCep(form: any) {
  const [isFetchingCep, setIsFetchingCep] = useState(false)

  const handleCepBlur = async (e: any) => {
    const val = e.target.value
    if (!val) return
    const cep = val.replace(/\D/g, '')
    if (cep.length !== 8) return

    setIsFetchingCep(true)
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
      const data = await res.json()

      if (data.erro) {
        toast.error('CEP não encontrado.')
        return
      }

      form.setValue('logradouro', data.logradouro)
      form.setValue('bairro', data.bairro)
      form.setValue('cidade', data.localidade)
      form.setValue('estado', data.uf)
      toast.success('Endereço preenchido via CEP!')
    } catch (err) {
      toast.error('Erro ao consultar o CEP.')
    } finally {
      setIsFetchingCep(false)
    }
  }

  return { isFetchingCep, handleCepBlur }
}
