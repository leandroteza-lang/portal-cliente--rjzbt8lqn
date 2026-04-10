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
import { LogOut, Building2, User, AlertCircle, Edit2 } from 'lucide-react'

type Profile = {
  id: string
  full_name: string | null
  document_number: string | null
  company_name: string | null
  email: string | null
  phone: string | null
  whatsapp: string | null
  accountant_name: string | null
  accountant_email: string | null
  accountant_phone: string | null
  notify_email: boolean
  notify_whatsapp: boolean
  notify_sms: boolean
}

export default function Profile() {
  const { session, signOut } = useAuth()
  const { toast } = useToast()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [editData, setEditData] = useState<Partial<Profile>>({})
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const fetchData = async () => {
    if (!session?.user?.id) return
    const { data } = await (supabase as any)
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single()

    if (data) {
      setProfile(data)
      setEditData(data)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [session])

  const handleLogout = async () => {
    await signOut()
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditData((prev) => ({ ...prev, [e.target.id]: e.target.value }))
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session?.user?.id) return

    if (!editData.full_name || !editData.email) {
      toast({ title: 'Nome e E-mail são obrigatórios', variant: 'destructive' })
      return
    }

    if (!/^\S+@\S+\.\S+$/.test(editData.email)) {
      toast({ title: 'E-mail inválido', variant: 'destructive' })
      return
    }

    const { error } = await (supabase as any)
      .from('profiles')
      .update({
        full_name: editData.full_name,
        email: editData.email,
        phone: editData.phone,
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

  const handleToggle = async (field: keyof Profile, value: boolean) => {
    if (!session?.user?.id) return
    setProfile((prev) => (prev ? { ...prev, [field]: value } : null))

    const { error } = await (supabase as any)
      .from('profiles')
      .update({ [field]: value })
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

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-10 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#2563EB]">Perfil do Cliente</h1>
          <p className="text-[#6B7280]">Gerencie suas informações e preferências de conta.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Coluna 1: Informações do Cliente */}
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
                    value={profile?.full_name || ''}
                    className="bg-gray-50 text-gray-900 border-gray-200 focus-visible:ring-0 cursor-default"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[#6B7280]">E-mail</Label>
                  <Input
                    readOnly
                    value={profile?.email || ''}
                    className="bg-gray-50 text-gray-900 border-gray-200 focus-visible:ring-0 cursor-default"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[#6B7280]">CNPJ / CPF</Label>
                  <Input
                    readOnly
                    value={profile?.document_number || ''}
                    className="bg-gray-50 text-gray-900 border-gray-200 focus-visible:ring-0 cursor-default"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[#6B7280]">Razão Social</Label>
                  <Input
                    readOnly
                    value={profile?.company_name || ''}
                    className="bg-gray-50 text-gray-900 border-gray-200 focus-visible:ring-0 cursor-default"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[#6B7280]">Telefone</Label>
                  <Input
                    readOnly
                    value={profile?.phone || ''}
                    className="bg-gray-50 text-gray-900 border-gray-200 focus-visible:ring-0 cursor-default"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[#6B7280]">WhatsApp</Label>
                  <Input
                    readOnly
                    value={profile?.whatsapp || ''}
                    className="bg-gray-50 text-gray-900 border-gray-200 focus-visible:ring-0 cursor-default"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Coluna 2: Notificações e Contador */}
        <div className="space-y-6">
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
                <Switch
                  checked={profile?.notify_email ?? false}
                  onCheckedChange={(v) => handleToggle('notify_email', v)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-gray-900 font-medium">WhatsApp</Label>
                  <p className="text-xs text-[#6B7280]">Mensagens rápidas</p>
                </div>
                <Switch
                  checked={profile?.notify_whatsapp ?? false}
                  onCheckedChange={(v) => handleToggle('notify_whatsapp', v)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-gray-900 font-medium">SMS</Label>
                  <p className="text-xs text-[#6B7280]">Avisos via texto</p>
                </div>
                <Switch
                  checked={profile?.notify_sms ?? false}
                  onCheckedChange={(v) => handleToggle('notify_sms', v)}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#FFFFFF] border-gray-200 shadow-sm">
            <CardHeader className="pb-4 border-b border-gray-100">
              <CardTitle className="text-[#2563EB] flex items-center gap-2 text-lg">
                <User className="h-5 w-5" /> Dados do Contador Responsável
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-1.5">
                <Label className="text-[#6B7280] text-xs uppercase tracking-wider">Nome</Label>
                <p className="text-sm font-medium text-gray-900">
                  {profile?.accountant_name || 'Equipe COSTA'}
                </p>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[#6B7280] text-xs uppercase tracking-wider">E-mail</Label>
                <p className="text-sm font-medium text-gray-900 break-all">
                  {profile?.accountant_email || 'contato@costaassessoria.com.br'}
                </p>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[#6B7280] text-xs uppercase tracking-wider">Telefone</Label>
                <p className="text-sm font-medium text-gray-900">
                  {profile?.accountant_phone || '(11) 9999-9999'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-center pt-10 border-t mt-10">
        <Button
          variant="outline"
          onClick={handleLogout}
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
                Atualize as informações de contato do seu perfil.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="full_name" className="text-gray-900">
                  Nome <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="full_name"
                  value={editData.full_name || ''}
                  onChange={handleChange}
                  placeholder="Seu nome completo"
                />
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
                  placeholder="seu@email.com"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone" className="text-gray-900">
                  Telefone
                </Label>
                <Input
                  id="phone"
                  value={editData.phone || ''}
                  onChange={handleChange}
                  placeholder="(00) 0000-0000"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="whatsapp" className="text-gray-900">
                  WhatsApp
                </Label>
                <Input
                  id="whatsapp"
                  value={editData.whatsapp || ''}
                  onChange={handleChange}
                  placeholder="(00) 90000-0000"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsEditDialogOpen(false)}
                className="text-[#6B7280]"
              >
                Cancelar
              </Button>
              <Button type="submit" className="bg-[#2563EB] hover:bg-blue-700 text-white">
                Salvar alterações
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
