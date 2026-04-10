import { useState, useEffect } from 'react'
import {
  Building2,
  Mail,
  MessageSquare,
  Power,
  Settings2,
  ShieldCheck,
  Phone,
  FileText,
} from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function AdminConfiguracoes() {
  const { session, signOut } = useAuth()
  const { toast } = useToast()

  const [profile, setProfile] = useState<any>(null)
  const [preferences, setPreferences] = useState({
    auto_notifications: true,
    due_date_alerts: true,
    auto_document_sending: false,
    whatsapp_connected: true,
    email_connected: true,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session?.user?.id) {
      supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()
        .then(({ data }) => {
          if (data) {
            setProfile(data)
            if (data.office_preferences) {
              setPreferences({
                ...preferences,
                ...data.office_preferences,
              })
            }
          }
          setLoading(false)
        })
    }
  }, [session])

  const updatePreference = async (key: string, value: boolean) => {
    const newPrefs = { ...preferences, [key]: value }
    setPreferences(newPrefs)

    if (session?.user?.id) {
      const { error } = await supabase
        .from('profiles')
        .update({ office_preferences: newPrefs })
        .eq('id', session.user.id)

      if (error) {
        toast({
          title: 'Erro',
          description: 'Não foi possível salvar a preferência.',
          variant: 'destructive',
        })
      } else {
        toast({
          title: 'Sucesso',
          description: 'Preferência atualizada no sistema.',
        })
      }
    }
  }

  const handleReconnect = (type: 'whatsapp' | 'email') => {
    toast({
      title: 'Conectando...',
      description: `Iniciando autenticação com ${type === 'whatsapp' ? 'WhatsApp' : 'E-mail'}.`,
    })

    setTimeout(() => {
      updatePreference(`${type}_connected`, true)
      toast({
        title: 'Sucesso',
        description: `${type === 'whatsapp' ? 'WhatsApp' : 'E-mail'} conectado e sincronizado.`,
      })
    }, 1500)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Configurações</h1>
        <p className="text-slate-500">
          Gerencie as informações e preferências do sistema do escritório.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-600" />
                Informações do Escritório
              </CardTitle>
              <CardDescription>
                Dados cadastrais vinculados à sua conta (somente leitura).
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Nome do Escritório</Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    value={profile?.company_name || 'Escritório Contábil Padrão'}
                    disabled
                    className="pl-9 bg-slate-50 text-slate-700 font-medium"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>CNPJ</Label>
                <div className="relative">
                  <FileText className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    value={profile?.document_number || '00.000.000/0001-00'}
                    disabled
                    className="pl-9 bg-slate-50 text-slate-700 font-medium"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>E-mail Corporativo</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    value={profile?.email || 'contato@escritorio.com'}
                    disabled
                    className="pl-9 bg-slate-50 text-slate-700 font-medium"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Telefone Principal</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    value={profile?.phone || '(11) 99999-9999'}
                    disabled
                    className="pl-9 bg-slate-50 text-slate-700 font-medium"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings2 className="w-5 h-5 text-emerald-600" />
                Preferências de Sistema
              </CardTitle>
              <CardDescription>Controle o comportamento automático do painel.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5 max-w-[80%]">
                  <Label className="text-sm font-medium text-slate-800">
                    Notificações Automáticas
                  </Label>
                  <p className="text-xs text-slate-500">
                    Enviar alertas gerais para os clientes automaticamente via sistema.
                  </p>
                </div>
                <Switch
                  checked={preferences.auto_notifications}
                  onCheckedChange={(c) => updatePreference('auto_notifications', c)}
                  className="data-[state=checked]:bg-emerald-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5 max-w-[80%]">
                  <Label className="text-sm font-medium text-slate-800">
                    Alertas de Vencimento
                  </Label>
                  <p className="text-xs text-slate-500">
                    Avisar os clientes sobre guias próximas ao vencimento (D-3).
                  </p>
                </div>
                <Switch
                  checked={preferences.due_date_alerts}
                  onCheckedChange={(c) => updatePreference('due_date_alerts', c)}
                  className="data-[state=checked]:bg-emerald-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5 max-w-[80%]">
                  <Label className="text-sm font-medium text-slate-800">
                    Envio Automático de Documentos
                  </Label>
                  <p className="text-xs text-slate-500">
                    Encaminhar os documentos assim que processados com sucesso.
                  </p>
                </div>
                <Switch
                  checked={preferences.auto_document_sending}
                  onCheckedChange={(c) => updatePreference('auto_document_sending', c)}
                  className="data-[state=checked]:bg-emerald-500"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                Integrações
              </CardTitle>
              <CardDescription>
                Gerencie as conexões ativas com canais de comunicação.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col gap-4 p-4 border border-slate-200 rounded-lg bg-white shadow-sm transition-all hover:border-emerald-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-100">
                      <MessageSquare className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 text-sm">WhatsApp Business</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-slate-500">Status:</span>
                        {preferences.whatsapp_connected ? (
                          <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-0 text-[10px] px-1.5 py-0">
                            Conectado
                          </Badge>
                        ) : (
                          <Badge
                            variant="secondary"
                            className="bg-slate-100 text-slate-600 hover:bg-slate-200 border-0 text-[10px] px-1.5 py-0"
                          >
                            Desconectado
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleReconnect('whatsapp')}
                    className="text-emerald-700 border-emerald-200 hover:bg-emerald-50 hover:text-emerald-800 transition-colors"
                  >
                    Reconectar
                  </Button>
                </div>
              </div>

              <div className="flex flex-col gap-4 p-4 border border-slate-200 rounded-lg bg-white shadow-sm transition-all hover:border-emerald-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center border border-slate-200">
                      <Mail className="w-5 h-5 text-slate-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 text-sm">Servidor de E-mail</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-slate-500">Status:</span>
                        {preferences.email_connected ? (
                          <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-0 text-[10px] px-1.5 py-0">
                            Conectado
                          </Badge>
                        ) : (
                          <Badge
                            variant="secondary"
                            className="bg-slate-100 text-slate-600 hover:bg-slate-200 border-0 text-[10px] px-1.5 py-0"
                          >
                            Desconectado
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleReconnect('email')}
                    className="text-emerald-700 border-emerald-200 hover:bg-emerald-50 hover:text-emerald-800 transition-colors"
                  >
                    Reconectar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="pt-4 flex justify-end">
            <Button variant="destructive" onClick={signOut} className="gap-2 shadow-sm">
              <Power className="w-4 h-4" />
              Sair do Sistema
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
