import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase/client'
import { Loader2 } from 'lucide-react'
import { formSchema, ClienteFormValues } from './cliente-schema'
import { ClienteTabs } from './ClienteTabs'
import { generatePassword } from '@/lib/password'

export default function ClienteFormModal({ open, onOpenChange, cliente, onSuccess }: any) {
  const [isSaving, setIsSaving] = useState(false)

  const form = useForm<ClienteFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { ativo: true, tipo_cliente: 'PJ' },
  })

  useEffect(() => {
    if (open) {
      if (cliente) {
        const safeData = Object.keys(formSchema.shape).reduce((acc: any, key) => {
          acc[key] = cliente[key] === null ? '' : cliente[key]
          return acc
        }, {})
        form.reset({
          ...safeData,
          ativo: cliente.ativo ?? true,
          tipo_cliente: cliente.tipo_cliente || 'PJ',
        })
      } else {
        form.reset({ ativo: true, tipo_cliente: 'PJ' })
      }
    }
  }, [open, cliente, form])

  const onSubmit = async (values: ClienteFormValues) => {
    setIsSaving(true)
    try {
      let clienteId = values.id
      if (!clienteId) {
        if (!values.email) throw new Error('E-mail é obrigatório para cadastrar um novo cliente.')
        const tempPassword = generatePassword()
        const { data, error } = await supabase.functions.invoke('admin-create-user', {
          body: {
            email: values.email,
            password: tempPassword,
            nome: values.nome,
            cnpj: values.cnpj,
          },
        })
        if (error || !data?.success) {
          throw new Error(data?.error || error?.message || 'Erro ao criar credenciais de acesso.')
        }
        clienteId = data.userId
        toast.success('Usuário criado. Credenciais podem ser enviadas depois.')
      }

      const { error } = await supabase.from('clientes').upsert({ ...values, id: clienteId })
      if (error) throw error

      toast.success('Cliente salvo com sucesso!')
      onOpenChange(false)
      onSuccess()
    } catch (err: any) {
      toast.error(err.message || 'Erro ao salvar cliente.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{form.watch('id') ? 'Editar Cliente' : 'Novo Cliente'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <ClienteTabs form={form} />
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-emerald-500 hover:bg-emerald-600"
                disabled={isSaving}
              >
                {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Salvar Cadastro
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
