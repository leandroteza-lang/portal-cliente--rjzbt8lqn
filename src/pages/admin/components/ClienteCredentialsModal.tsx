import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase/client'
import { Send } from 'lucide-react'
import { generatePassword } from '@/lib/password'

export default function ClienteCredentialsModal({ open, onOpenChange, cliente }: any) {
  const [newPassword, setNewPassword] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    if (open && cliente) setNewPassword('')
  }, [open, cliente])

  const sendCredentials = async (clienteInfo: any, tempPassword: string) => {
    const mensagem = `Olá ${clienteInfo.nome}! Suas credenciais de acesso ao Portal do Cliente foram geradas.\n\nE-mail: ${clienteInfo.email}\nSenha: ${tempPassword}\n\nAcesse o portal para conferir seus documentos e faturas.`
    let emailSent = false,
      whatsappSent = false

    if (clienteInfo.email) {
      const { data } = await supabase.functions.invoke('send-email', {
        body: { cliente_email: clienteInfo.email, assunto: 'Acesso Portal', mensagem },
      })
      if (data?.success) emailSent = true
    }

    if (clienteInfo.whatsapp) {
      const { data } = await supabase.functions.invoke('send-whatsapp', {
        body: { cliente_whatsapp: clienteInfo.whatsapp, mensagem },
      })
      if (data?.success) whatsappSent = true
    }

    await supabase.from('historico_clientes').insert({
      cliente_id: clienteInfo.id,
      dados_novos: {
        tipo: 'Envio de Credenciais',
        data: new Date().toISOString(),
        email_enviado: emailSent,
        whatsapp_enviado: whatsappSent,
      },
    })
    return { emailSent, whatsappSent }
  }

  const handleSave = async (send: boolean) => {
    if (!cliente || newPassword.length < 8) return
    setIsProcessing(true)

    const { error } = await supabase.functions.invoke('update-user-password', {
      body: { action: 'admin-update', userId: cliente.id, newPassword },
    })

    if (error) {
      toast.error('Erro: ' + error.message)
      setIsProcessing(false)
      return
    }

    toast.success('Senha atualizada!')

    if (send) {
      toast.info('Enviando...')
      const { emailSent, whatsappSent } = await sendCredentials(cliente, newPassword)
      toast.success(
        `Envio concluído! (Email: ${emailSent ? 'Sim' : 'Não'}, Whats: ${whatsappSent ? 'Sim' : 'Não'})`,
      )
    }

    setIsProcessing(false)
    setNewPassword('')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Credenciais - {cliente?.nome}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <Label>Nova Senha (mínimo 8 caracteres)</Label>
          <div className="flex gap-2">
            <Input
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              type="text"
            />
            <Button variant="outline" onClick={() => setNewPassword(generatePassword())}>
              Gerar
            </Button>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="secondary"
              onClick={() => handleSave(false)}
              disabled={newPassword.length < 8 || isProcessing}
            >
              Apenas Salvar
            </Button>
            <Button
              onClick={() => handleSave(true)}
              disabled={newPassword.length < 8 || isProcessing}
              className="bg-emerald-500 hover:bg-emerald-600"
            >
              <Send className="w-4 h-4 mr-2" /> Salvar e Enviar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
