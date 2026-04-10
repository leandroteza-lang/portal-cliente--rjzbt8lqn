import { useEffect, useState } from 'react'
import { Bell, CheckCircle, AlertTriangle, FileText, Trash2, Check } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuth } from '@/hooks/use-auth'
import { supabase } from '@/lib/supabase/client'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { toast } from 'sonner'
import { Database } from '@/lib/supabase/types'

type Notification = Database['public']['Tables']['notificacoes']['Row']

export default function Notifications() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('todos')

  const fetchNotifications = async () => {
    if (!user) return
    setLoading(true)
    const { data, error } = await supabase
      .from('notificacoes')
      .select('*')
      .eq('cliente_id', user.id)
      .order('data_criacao', { ascending: false })

    if (error) {
      toast.error('Erro ao carregar notificações')
    } else {
      setNotifications(data || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchNotifications()
  }, [user])

  const notifySidebar = () => {
    window.dispatchEvent(new Event('notifications-updated'))
  }

  const markAsRead = async (id: string) => {
    const { error } = await supabase.from('notificacoes').update({ lido: true }).eq('id', id)

    if (error) {
      toast.error('Erro ao marcar como lida')
    } else {
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, lido: true } : n)))
      notifySidebar()
    }
  }

  const deleteNotification = async (id: string) => {
    const { error } = await supabase.from('notificacoes').delete().eq('id', id)

    if (error) {
      toast.error('Erro ao excluir notificação')
    } else {
      setNotifications((prev) => prev.filter((n) => n.id !== id))
      toast.success('Notificação excluída')
      notifySidebar()
    }
  }

  const getNotificationIcon = (tipo: string) => {
    const t = tipo.toLowerCase()
    if (t.includes('vencimento') || t.includes('fatura'))
      return <AlertTriangle className="h-5 w-5 text-amber-500" />
    if (t.includes('documento')) return <FileText className="h-5 w-5 text-blue-500" />
    if (t.includes('sucesso')) return <CheckCircle className="h-5 w-5 text-emerald-500" />
    return <Bell className="h-5 w-5 text-primary" />
  }

  const getNotificationTitle = (tipo: string) => {
    const t = tipo.toLowerCase()
    if (t.includes('vencimento') || t.includes('fatura')) return 'Aviso de Vencimento'
    if (t.includes('documento')) return 'Novo Documento'
    if (t.includes('aviso')) return 'Aviso do Escritório'
    return tipo.charAt(0).toUpperCase() + tipo.slice(1)
  }

  const filteredNotifications = notifications.filter((n) => {
    const t = n.tipo.toLowerCase()
    if (filter === 'vencimentos') return t.includes('vencimento') || t.includes('fatura')
    if (filter === 'documentos') return t.includes('documento')
    if (filter === 'avisos')
      return (
        t.includes('aviso') ||
        (!t.includes('vencimento') && !t.includes('fatura') && !t.includes('documento'))
      )
    return true
  })

  const unreadCount = notifications.filter((n) => !n.lido).length

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Notificações
          </h1>
          <p className="text-muted-foreground mt-1">
            Fique por dentro das atualizações e alertas da sua conta.
          </p>
        </div>
        {unreadCount > 0 && (
          <Badge
            variant="secondary"
            className="px-3 py-1.5 text-sm bg-primary/10 text-primary hover:bg-primary/20 border-0"
          >
            {unreadCount} não {unreadCount === 1 ? 'lida' : 'lidas'}
          </Badge>
        )}
      </div>

      <Tabs defaultValue="todos" value={filter} onValueChange={setFilter} className="w-full">
        <TabsList className="w-full sm:w-auto grid grid-cols-2 sm:flex sm:flex-wrap h-auto bg-slate-100/50 dark:bg-slate-800/50">
          <TabsTrigger value="todos" className="py-2.5">
            Todas
          </TabsTrigger>
          <TabsTrigger value="vencimentos" className="py-2.5">
            Vencimentos
          </TabsTrigger>
          <TabsTrigger value="documentos" className="py-2.5">
            Documentos
          </TabsTrigger>
          <TabsTrigger value="avisos" className="py-2.5">
            Avisos
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <Card className="border-slate-200/60 dark:border-slate-800/60 shadow-sm overflow-hidden bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
        <CardHeader className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/80 py-4">
          <CardTitle className="text-lg flex items-center gap-2 text-slate-800 dark:text-slate-200">
            <Bell className="h-5 w-5 text-slate-500" />
            Central de Avisos
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="p-4 md:p-6 flex gap-4">
                  <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                  <div className="flex-1 space-y-2.5">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-4/5" />
                  </div>
                </div>
              ))
            ) : filteredNotifications.length === 0 ? (
              <div className="p-12 text-center flex flex-col items-center justify-center animate-fade-in">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800/50 text-slate-400 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">
                  Tudo limpo por aqui!
                </h3>
                <p className="text-slate-500 max-w-sm mt-2">
                  Você não tem nenhuma notificação{' '}
                  {filter !== 'todos' ? 'nesta categoria' : 'no momento'}.
                </p>
              </div>
            ) : (
              filteredNotifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-4 md:p-6 flex gap-4 transition-all duration-200 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 group ${!notif.lido ? 'bg-primary/[0.03] dark:bg-primary/5' : ''}`}
                >
                  <div className="shrink-0 mt-1">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${!notif.lido ? 'bg-white dark:bg-slate-950 shadow-sm ring-1 ring-black/5 dark:ring-white/10' : 'bg-slate-100 dark:bg-slate-800/80'}`}
                    >
                      {getNotificationIcon(notif.tipo)}
                    </div>
                  </div>
                  <div className="flex-1 space-y-1.5 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
                      <p
                        className={`text-sm font-semibold truncate ${!notif.lido ? 'text-slate-900 dark:text-slate-100' : 'text-slate-600 dark:text-slate-300'}`}
                      >
                        {getNotificationTitle(notif.tipo)}
                      </p>
                      <span className="text-xs text-slate-500 whitespace-nowrap font-medium">
                        {notif.data_criacao
                          ? format(new Date(notif.data_criacao), "dd 'de' MMM, HH:mm", {
                              locale: ptBR,
                            })
                          : ''}
                      </span>
                    </div>
                    <p
                      className={`text-sm leading-relaxed ${!notif.lido ? 'text-slate-700 dark:text-slate-300' : 'text-slate-500 dark:text-slate-400'}`}
                    >
                      {notif.mensagem}
                    </p>

                    <div className="flex items-center gap-2 pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {!notif.lido && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2.5 text-primary hover:text-primary hover:bg-primary/10"
                          onClick={() => markAsRead(notif.id)}
                        >
                          <Check className="h-4 w-4 mr-1.5" />
                          Marcar como lida
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2.5 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                        onClick={() => deleteNotification(notif.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1.5" />
                        Excluir
                      </Button>
                    </div>
                  </div>
                  {!notif.lido && (
                    <div className="shrink-0 self-center sm:self-start mt-2 sm:mt-0">
                      <div className="w-2.5 h-2.5 bg-primary rounded-full shadow-sm animate-pulse"></div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
