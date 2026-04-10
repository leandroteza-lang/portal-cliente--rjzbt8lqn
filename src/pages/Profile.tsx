import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { supabase } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { LogOut, Building2, User, AlertCircle, Edit2, Key } from 'lucide-react'

type Cliente = {
  id: string
  nome: string | null
  cnpj: string | null
  razao_social: string | null
  email: string | null
  telefone: string | null
  whatsapp: string | null
  preferencias_notificacao: {
    email: boolean
    whatsapp: boolean
    sms: boolean
  } | null
}

export default function Profile() {
  const { session, signOut } = useAuth()
  const { toast } = useToast()
  const [cliente, setCliente] = useState<Cliente | null>(null)
  const [loading, setLoading] = useState(true)
  const [editData, setEditData] = useState<Partial<Cliente>>({})
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  const validatePasswordStrength = (pwd: string) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&.])[A-Za-z\d@$!%*#?&.]{8,}$/
    return regex.test(pwd)
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session?.user?.id) return

    if (newPassword !== confirmPassword) {
      toast({ title: 'As senhas não coincidem', variant: 'destructive' })
      return
    }

    if (!validatePasswordStrength(newPassword)) {
      toast({
        title: 'Senha fraca',
        description:
          'A senha deve ter no mínimo 8 caracteres, contendo letras, números e pelo menos um caractere especial.',
        variant: 'destructive',
      })
      return
    }

    setIsChangingPassword(true)

    const { data, error } = await supabase.functions.invoke('update-user-password', {
      body: { action: 'client-update', userId: session.user.id, oldPassword, newPassword },
    })

    if (error || !data?.success) {
      toast({
        title: 'Erro ao alterar senha',
        description: data?.error || error?.message || 'Verifique se a senha atual está correta.',
        variant: 'destructive',
      })
    } else {
      toast({ title: 'Senha alterada com sucesso!' })
      setOldPassword('')
      setNewPassword('')
      setConfirmPassword('')
    }
    setIsChangingPassword(false)
  }

  const fetchData = async () => {
    if (!session?.user?.id) return
    const { data } = await supabase.from('clientes').select('*').eq('id', session.user.id).single()

    if (data) {
      const prefs = data.preferencias_notificacao || { email: true, whatsapp: false, sms: false }
      setCliente({ ...data, preferencias_notificacao: prefs as any })
      setEditData(data)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [session])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditData((prev) => ({ ...prev, [e.target.id]: e.target.value }))
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session?.user?.id) return

    if (!editData.nome || !editData.email) {
      toast({ title: 'Nome e E-mail são obrigatórios', variant: 'destructive' })
      return
    }

    const { error } = await supabase
      .from('clientes')
      .update({
        nome: editData.nome,
        email: editData.email,
        telefone: editData.telefone,
        whatsapp: editData.whatsapp,
      })
      .eq('id', session.user.id)

    if (error) {
      toast({ title: 'Erro ao salvar', description: error.message, variant: 'destructive' })
    } else {
      toast({ title: 'Perfil atualizado com sucesso' })
      setIsEditDialogOpen(false)
      fetchData()
    }
  }

  const handleToggle = async (field: 'email' | 'whatsapp' | 'sms', value: boolean) => {
    if (!session?.user?.id || !cliente) return
    const novasPrefs = { ...(cliente.preferencias_notificacao || {}), [field]: value }

    setCliente({ ...cliente, preferencias_notificacao: novasPrefs as any })

    const { error } = await supabase
      .from('clientes')
      .update({ preferencias_notificacao: novasPrefs as any })
      .eq('id', session.user.id)

    if (error) {
      toast({ title: 'Erro ao atualizar preferência', variant: 'destructive' })
      fetchData()
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2563EB]"></div>
      </div>
    )
  }

  const prefs = cliente?.preferencias_notificacao || { email: true, whatsapp: false, sms: false }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-10 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#2563EB]">Perfil do Cliente</h1>
          <p className="text-[#6B7280]">Gerencie suas informações e preferências de conta.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card className="bg-[#FFFFFF] border-gray-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-gray-100">
              <CardTitle className="text-[#2563EB] flex items-center gap-2 text-lg">
                <Building2 className="h-5 w-5" /> Informações do Cliente
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditDialogOpen(true)}
                className="text-[#2563EB] border-[#2563EB] hover:bg-blue-50"
              >
                <Edit2 className="h-4 w-4 mr-2" /> Editar Perfil
              </Button>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <Label className="text-[#6B7280]">Nome</Label>
                  <Input
                    readOnly
                    value={cliente?.nome || ''}
                    className="bg-gray-50 border-gray-200"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[#6B7280]">E-mail</Label>
                  <Input
                    readOnly
                    value={cliente?.email || ''}
                    className="bg-gray-50 border-gray-200"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[#6B7280]">CNPJ / CPF</Label>
                  <Input
                    readOnly
                    value={cliente?.cnpj || ''}
                    className="bg-gray-50 border-gray-200"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[#6B7280]">Razão Social</Label>
                  <Input
                    readOnly
                    value={cliente?.razao_social || ''}
                    className="bg-gray-50 border-gray-200"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[#6B7280]">Telefone</Label>
                  <Input
                    readOnly
                    value={cliente?.telefone || ''}
                    className="bg-gray-50 border-gray-200"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[#6B7280]">WhatsApp</Label>
                  <Input
                    readOnly
                    value={cliente?.whatsapp || ''}
                    className="bg-gray-50 border-gray-200"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-[#FFFFFF] border-gray-200 shadow-sm">
            <CardHeader className="pb-4 border-b border-gray-100">
              <CardTitle className="text-[#2563EB] flex items-center gap-2 text-lg">
                <Key className="h-5 w-5" /> Segurança da Conta
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-[#6B7280]">Senha Atual</Label>
                  <Input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    required
                    className="bg-gray-50"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[#6B7280]">Nova Senha</Label>
                  <Input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="bg-gray-50"
                  />
                  <p className="text-xs text-slate-500">
                    Mín. 8 caracteres, com letras, números e caractere especial.
                  </p>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[#6B7280]">Confirmar Nova Senha</Label>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="bg-gray-50"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-[#2563EB] hover:bg-blue-700 text-white mt-2"
                  disabled={isChangingPassword || !oldPassword || !newPassword || !confirmPassword}
                >
                  {isChangingPassword ? 'Alterando...' : 'Alterar Senha'}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="bg-[#FFFFFF] border-gray-200 shadow-sm">
            <CardHeader className="pb-4 border-b border-gray-100">
              <CardTitle className="text-[#2563EB] flex items-center gap-2 text-lg">
                <AlertCircle className="h-5 w-5" /> Preferências de Notificação
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-gray-900 font-medium">E-mail</Label>
                  <p className="text-xs text-[#6B7280]">Receber avisos no e-mail</p>
                </div>
                <Switch checked={prefs.email} onCheckedChange={(v) => handleToggle('email', v)} />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-gray-900 font-medium">WhatsApp</Label>
                  <p className="text-xs text-[#6B7280]">Mensagens rápidas</p>
                </div>
                <Switch
                  checked={prefs.whatsapp}
                  onCheckedChange={(v) => handleToggle('whatsapp', v)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-gray-900 font-medium">SMS</Label>
                  <p className="text-xs text-[#6B7280]">Avisos via texto</p>
                </div>
                <Switch checked={prefs.sms} onCheckedChange={(v) => handleToggle('sms', v)} />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#FFFFFF] border-gray-200 shadow-sm">
            <CardHeader className="pb-4 border-b border-gray-100">
              <CardTitle className="text-[#2563EB] flex items-center gap-2 text-lg">
                <User className="h-5 w-5" /> Dados do Contador
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-1.5">
                <Label className="text-[#6B7280] text-xs uppercase tracking-wider">Nome</Label>
                <p className="text-sm font-medium text-gray-900">Equipe COSTA</p>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[#6B7280] text-xs uppercase tracking-wider">E-mail</Label>
                <p className="text-sm font-medium text-gray-900 break-all">
                  contato@costaassessoria.com.br
                </p>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[#6B7280] text-xs uppercase tracking-wider">Telefone</Label>
                <p className="text-sm font-medium text-gray-900">(11) 9999-9999</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-center pt-10 border-t mt-10">
        <Button
          variant="outline"
          onClick={() => signOut()}
          className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 w-full sm:w-auto px-12 py-6 text-base font-medium"
        >
          <LogOut className="mr-2 h-5 w-5" /> Logout
        </Button>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-[#FFFFFF]">
          <form onSubmit={handleSaveProfile}>
            <DialogHeader>
              <DialogTitle className="text-[#2563EB]">Editar Perfil</DialogTitle>
              <DialogDescription className="text-[#6B7280]">
                Atualize suas informações.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="nome" className="text-gray-900">
                  Nome <span className="text-red-500">*</span>
                </Label>
                <Input id="nome" value={editData.nome || ''} onChange={handleChange} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-gray-900">
                  E-mail <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={editData.email || ''}
                  onChange={handleChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="telefone" className="text-gray-900">
                  Telefone
                </Label>
                <Input id="telefone" value={editData.telefone || ''} onChange={handleChange} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="whatsapp" className="text-gray-900">
                  WhatsApp
                </Label>
                <Input id="whatsapp" value={editData.whatsapp || ''} onChange={handleChange} />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setIsEditDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-[#2563EB] hover:bg-blue-700 text-white">
                Salvar
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
