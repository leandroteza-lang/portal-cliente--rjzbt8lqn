import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { supabase } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  LogOut,
  Building2,
  Mail,
  Phone,
  User,
  FileText,
  Star,
  Clock,
  AlertCircle,
} from 'lucide-react'

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
  last_sync_at: string | null
}

type Document = {
  id: string
  name: string
  category: string
  created_at: string
  is_favorite: boolean
}

const formatDate = (dateString: string) => {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateString))
}

const ProfileInfoCard = ({ profile }: { profile: Profile | null }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Building2 className="h-5 w-5 text-primary" />
        Informações do Cliente
      </CardTitle>
    </CardHeader>
    <CardContent className="grid sm:grid-cols-2 gap-4">
      <InfoItem label="Nome Completo" value={profile?.full_name} />
      <InfoItem label="Razão Social" value={profile?.company_name} />
      <InfoItem label="CNPJ / CPF" value={profile?.document_number} />
      <InfoItem label="E-mail" value={profile?.email} />
      <InfoItem label="Telefone" value={profile?.phone} />
      <InfoItem label="WhatsApp" value={profile?.whatsapp} />
    </CardContent>
  </Card>
)

const InfoItem = ({ label, value }: { label: string; value?: string | null }) => (
  <div>
    <p className="text-sm text-muted-foreground">{label}</p>
    <p className="font-medium">{value || 'Não informado'}</p>
  </div>
)

const AccountantCard = ({ profile }: { profile: Profile | null }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <User className="h-5 w-5 text-primary" />
        Contador Responsável
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
          {profile?.accountant_name?.charAt(0) || 'C'}
        </div>
        <div>
          <p className="font-medium">{profile?.accountant_name || 'Equipe COSTA'}</p>
          <p className="text-sm text-muted-foreground">Assessor de Conta</p>
        </div>
      </div>
      <Separator />
      <div className="grid gap-2">
        <div className="flex items-center gap-2 text-sm">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <span>{profile?.accountant_email || 'contato@costaassessoria.com.br'}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Phone className="h-4 w-4 text-muted-foreground" />
          <span>{profile?.accountant_phone || '(11) 9999-9999'}</span>
        </div>
      </div>
    </CardContent>
  </Card>
)

const NotificationsCard = ({
  profile,
  onToggle,
}: {
  profile: Profile | null
  onToggle: (k: keyof Profile, v: boolean) => void
}) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <AlertCircle className="h-5 w-5 text-primary" />
        Preferências de Notificação
      </CardTitle>
      <CardDescription>Como você deseja receber avisos sobre vencimentos.</CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <NotifyToggle
        label="Notificações por E-mail"
        desc="Receba alertas na sua caixa de entrada."
        checked={profile?.notify_email ?? false}
        onChange={(v: boolean) => onToggle('notify_email', v)}
      />
      <Separator />
      <NotifyToggle
        label="Alertas no WhatsApp"
        desc="Mensagens rápidas no seu celular."
        checked={profile?.notify_whatsapp ?? false}
        onChange={(v: boolean) => onToggle('notify_whatsapp', v)}
      />
      <Separator />
      <NotifyToggle
        label="Avisos por SMS"
        desc="Lembretes curtos via mensagem de texto."
        checked={profile?.notify_sms ?? false}
        onChange={(v: boolean) => onToggle('notify_sms', v)}
      />
    </CardContent>
  </Card>
)

const NotifyToggle = ({ label, desc, checked, onChange }: any) => (
  <div className="flex items-center justify-between">
    <div className="space-y-0.5">
      <Label>{label}</Label>
      <p className="text-sm text-muted-foreground">{desc}</p>
    </div>
    <Switch checked={checked} onCheckedChange={onChange} />
  </div>
)

const FavoritesCard = ({ favorites, onManage, onToggle }: any) => (
  <Card>
    <CardHeader className="pb-3">
      <div className="flex items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
            Documentos Favoritos
          </CardTitle>
          <CardDescription className="mt-1.5">Acesso rápido aos seus arquivos.</CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={onManage}>
          Gerenciar
        </Button>
      </div>
    </CardHeader>
    <CardContent>
      {favorites.length === 0 ? (
        <div className="text-center py-6 text-muted-foreground">
          <FileText className="mx-auto h-8 w-8 opacity-20 mb-2" />
          <p className="text-sm">Nenhum documento favoritado ainda.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {favorites.map((doc: Document) => (
            <div
              key={doc.id}
              className="flex items-center justify-between p-3 rounded-lg border bg-slate-50 dark:bg-slate-900/50"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <FileText className="h-4 w-4 text-primary shrink-0" />
                <div className="truncate">
                  <p className="text-sm font-medium truncate">{doc.name}</p>
                  <p className="text-xs text-muted-foreground">{doc.category}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => onToggle(doc.id, true)}>
                <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </CardContent>
  </Card>
)

const EditDialog = ({ open, setOpen, data, onChange, onSave }: any) => (
  <Dialog open={open} onOpenChange={setOpen}>
    <DialogContent className="sm:max-w-[425px]">
      <form onSubmit={onSave}>
        <DialogHeader>
          <DialogTitle>Editar Perfil</DialogTitle>
          <DialogDescription>Atualize suas informações cadastrais.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="full_name">Nome Completo</Label>
            <Input id="full_name" value={data.full_name || ''} onChange={onChange} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="company_name">Razão Social</Label>
            <Input id="company_name" value={data.company_name || ''} onChange={onChange} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="document_number">CNPJ / CPF</Label>
            <Input id="document_number" value={data.document_number || ''} onChange={onChange} />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input id="phone" value={data.phone || ''} onChange={onChange} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="whatsapp">WhatsApp</Label>
              <Input id="whatsapp" value={data.whatsapp || ''} onChange={onChange} />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Salvar alterações</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
)

const FavDialog = ({ open, setOpen, docs, onToggle }: any) => (
  <Dialog open={open} onOpenChange={setOpen}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Gerenciar Documentos Favoritos</DialogTitle>
        <DialogDescription>Selecione os documentos que deseja fixar no perfil.</DialogDescription>
      </DialogHeader>
      <ScrollArea className="h-[300px] w-full pr-4 mt-2">
        <div className="space-y-2">
          {docs.length === 0 ? (
            <p className="text-sm text-center text-muted-foreground py-4">
              Nenhum documento encontrado.
            </p>
          ) : (
            docs.map((doc: Document) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded border border-transparent hover:border-border transition-colors"
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <FileText className="h-4 w-4 text-primary shrink-0" />
                  <span className="text-sm truncate">{doc.name}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => onToggle(doc.id, doc.is_favorite)}>
                  <Star
                    className={`h-4 w-4 ${
                      doc.is_favorite ? 'fill-amber-500 text-amber-500' : 'text-slate-300'
                    }`}
                  />
                </Button>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </DialogContent>
  </Dialog>
)

export default function Profile() {
  const { session, signOut } = useAuth()
  const { toast } = useToast()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [favorites, setFavorites] = useState<Document[]>([])
  const [allDocuments, setAllDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [editData, setEditData] = useState<Partial<Profile>>({})
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isFavDialogOpen, setIsFavDialogOpen] = useState(false)

  const fetchData = async () => {
    if (!session?.user?.id) return

    const { data: existingProfile } = await (supabase as any)
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single()

    if (existingProfile) {
      setProfile(existingProfile)
      setEditData(existingProfile)
    }

    const { data: docs } = await (supabase as any)
      .from('documents')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })

    if (docs) {
      setAllDocuments(docs)
      setFavorites(docs.filter((d: Document) => d.is_favorite))
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
    setEditData((prev: any) => ({ ...prev, [e.target.id]: e.target.value }))
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session?.user?.id) return

    const { error } = await (supabase as any)
      .from('profiles')
      .update({
        full_name: editData.full_name,
        company_name: editData.company_name,
        document_number: editData.document_number,
        phone: editData.phone,
        whatsapp: editData.whatsapp,
        last_sync_at: new Date().toISOString(),
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

  const handleToggleNotification = async (field: keyof Profile, value: boolean) => {
    if (!session?.user?.id) return
    setProfile((prev) => (prev ? { ...prev, [field]: value } : null))

    const { error } = await (supabase as any)
      .from('profiles')
      .update({ [field]: value, last_sync_at: new Date().toISOString() })
      .eq('id', session.user.id)

    if (error) {
      toast({ title: 'Erro ao atualizar preferência', variant: 'destructive' })
      fetchData()
    } else {
      setProfile((prev) => (prev ? { ...prev, last_sync_at: new Date().toISOString() } : null))
    }
  }

  const toggleFavorite = async (id: string, current: boolean) => {
    const newFavState = !current

    setAllDocuments((prev) =>
      prev.map((d) => (d.id === id ? { ...d, is_favorite: newFavState } : d)),
    )

    if (newFavState) {
      const doc = allDocuments.find((d) => d.id === id) || favorites.find((d) => d.id === id)
      if (doc && !favorites.some((f) => f.id === id)) {
        setFavorites((prev) => [...prev, { ...doc, is_favorite: true }])
      }
    } else {
      setFavorites((prev) => prev.filter((f) => f.id !== id))
    }

    const { error } = await (supabase as any)
      .from('documents')
      .update({ is_favorite: newFavState })
      .eq('id', id)

    if (error) {
      toast({ title: 'Erro ao atualizar favorito', variant: 'destructive' })
      fetchData()
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Meu Perfil</h1>
          <p className="text-muted-foreground">Gerencie suas informações e preferências.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button
            variant="outline"
            onClick={() => setIsEditDialogOpen(true)}
            className="flex-1 sm:flex-none"
          >
            Editar Perfil
          </Button>
          <Button variant="destructive" onClick={handleLogout} className="flex-1 sm:flex-none">
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <ProfileInfoCard profile={profile} />
          <AccountantCard profile={profile} />
        </div>
        <div className="space-y-6">
          <NotificationsCard profile={profile} onToggle={handleToggleNotification} />
          <FavoritesCard
            favorites={favorites}
            onManage={() => setIsFavDialogOpen(true)}
            onToggle={toggleFavorite}
          />

          <div className="flex items-center justify-center text-sm text-muted-foreground gap-2 pt-2">
            <Clock className="h-4 w-4" />
            Última sincronização de dados:{' '}
            {profile?.last_sync_at ? formatDate(profile.last_sync_at) : 'Desconhecida'}
          </div>
        </div>
      </div>

      <EditDialog
        open={isEditDialogOpen}
        setOpen={setIsEditDialogOpen}
        data={editData}
        onChange={handleChange}
        onSave={handleSaveProfile}
      />

      <FavDialog
        open={isFavDialogOpen}
        setOpen={setIsFavDialogOpen}
        docs={allDocuments}
        onToggle={toggleFavorite}
      />
    </div>
  )
}
