import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { supabase } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Bell, Calendar, FileText, Info, Check, Trash2 } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

type Notificacao = {
  id: string
  tipo: string
  mensagem: string
  lido: boolean
  data_criacao: string
}

export default function Notifications() {
  const { session } = useAuth()
  const { toast } = useToast()
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('Todos')

  const fetchNotificacoes = async () => {
    if (!session?.user?.id) return
    setLoading(true)
    const { data, error } = await supabase
      .from('notificacoes')
      .select('*')
      .eq('cliente_id', session.user.id)
      .order('data_criacao', { ascending: false })

    if (error) {
      toast({ title: 'Erro ao carregar notificações', variant: 'destructive' })
    } else {
      setNotificacoes(data as Notificacao[])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchNotificacoes()
  }, [session])

  const handleMarkAsRead = async (id: string) => {
    const { error } = await supabase.from('notificacoes').update({ lido: true }).eq('id', id)

    if (!error) {
      setNotificacoes((prev) => prev.map((n) => (n.id === id ? { ...n, lido: true } : n)))
    }
  }

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('notificacoes').delete().eq('id', id)

    if (!error) {
      setNotificacoes((prev) => prev.filter((n) => n.id !== id))
      toast({ title: 'Notificação excluída' })
    }
  }

  const filteredNotificacoes = notificacoes.filter((n) => {
    if (filter === 'Todos') return true
    if (filter === 'Vencimentos') return n.tipo === 'Vencimento'
    if (filter === 'Novos Documentos') return n.tipo === 'Documento'
    if (filter === 'Avisos do Escritório') return n.tipo === 'Aviso'
    return true
  })

  const getIcon = (tipo: string) => {
    switch (tipo) {
      case 'Vencimento':
        return <Calendar className="h-5 w-5 text-amber-500" />
      case 'Documento':
        return <FileText className="h-5 w-5 text-blue-500" />
      default:
        return <Info className="h-5 w-5 text-emerald-500" />
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <Bell className="h-6 w-6 text-primary" />
          Central de Notificações
        </h1>
        <p className="text-slate-500 mt-1">Gerencie seus avisos e alertas importantes.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {['Todos', 'Vencimentos', 'Novos Documentos', 'Avisos do Escritório'].map((f) => (
          <Button
            key={f}
            variant={filter === f ? 'default' : 'outline'}
            onClick={() => setFilter(f)}
            className="rounded-full"
            size="sm"
          >
            {f}
          </Button>
        ))}
      </div>

      <div className="space-y-3">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="shadow-sm">
              <CardContent className="p-4 flex gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-3 w-3/4" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : filteredNotificacoes.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-xl border border-dashed">
            <Bell className="h-10 w-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">Nenhuma notificação encontrada.</p>
          </div>
        ) : (
          filteredNotificacoes.map((notif) => (
            <Card
              key={notif.id}
              className={cn(
                'shadow-sm transition-all hover:border-slate-300',
                !notif.lido ? 'bg-primary/5 border-primary/20' : 'bg-white dark:bg-slate-900',
              )}
            >
              <CardContent className="p-4 flex items-start sm:items-center gap-4 flex-col sm:flex-row">
                <div
                  className={cn(
                    'p-2.5 rounded-full shrink-0',
                    !notif.lido ? 'bg-white' : 'bg-slate-100',
                  )}
                >
                  {getIcon(notif.tipo)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="text-xs bg-white">
                      {notif.tipo}
                    </Badge>
                    <span className="text-xs text-slate-500">
                      {format(new Date(notif.data_criacao), "dd 'de' MMM 'às' HH:mm", {
                        locale: ptBR,
                      })}
                    </span>
                    {!notif.lido && <span className="h-2 w-2 rounded-full bg-primary" />}
                  </div>
                  <p
                    className={cn(
                      'text-sm',
                      !notif.lido
                        ? 'font-semibold text-slate-800 dark:text-slate-200'
                        : 'text-slate-600 dark:text-slate-400',
                    )}
                  >
                    {notif.mensagem}
                  </p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto justify-end">
                  {!notif.lido && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleMarkAsRead(notif.id)}
                      className="text-primary hover:text-primary hover:bg-primary/10"
                    >
                      <Check className="h-4 w-4 mr-1" /> Lido
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(notif.id)}
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 mr-1" /> Excluir
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
