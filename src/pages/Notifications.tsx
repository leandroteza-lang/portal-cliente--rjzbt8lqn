import { Bell, CheckCircle, AlertTriangle, Info } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const notifications = [
  {
    id: 1,
    title: 'Novo boleto disponível',
    description: 'A guia DAS referente ao mês 09/2023 já está disponível para pagamento.',
    date: 'Hoje, 09:30',
    type: 'alert',
    read: false,
  },
  {
    id: 2,
    title: 'Documento aprovado',
    description: 'O documento "Alteração Contratual.pdf" foi processado e aprovado com sucesso.',
    date: 'Ontem, 14:15',
    type: 'success',
    read: true,
  },
  {
    id: 3,
    title: 'Aviso de Vencimento',
    description: 'Faltam 2 dias para o fechamento da folha de pagamento.',
    date: '12 Out, 08:00',
    type: 'warning',
    read: true,
  },
  {
    id: 4,
    title: 'Atualização no sistema',
    description: 'Novas funcionalidades de filtro adicionadas à aba Meus Documentos.',
    date: '10 Out, 10:00',
    type: 'info',
    read: true,
  },
]

export default function Notifications() {
  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notificações</h1>
          <p className="text-muted-foreground">
            Fique por dentro das atualizações e alertas da sua conta.
          </p>
        </div>
        {unreadCount > 0 && (
          <Badge variant="secondary" className="px-3 py-1">
            {unreadCount} não {unreadCount === 1 ? 'lida' : 'lidas'}
          </Badge>
        )}
      </div>

      <Card>
        <CardHeader className="border-b bg-muted/10">
          <CardTitle className="text-lg flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Central de Avisos
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-4 md:p-6 flex gap-4 transition-colors hover:bg-muted/50 ${!notif.read ? 'bg-primary/5' : ''}`}
              >
                <div className="shrink-0 mt-1">
                  {notif.type === 'alert' && <Bell className="h-5 w-5 text-primary" />}
                  {notif.type === 'success' && <CheckCircle className="h-5 w-5 text-emerald-500" />}
                  {notif.type === 'warning' && <AlertTriangle className="h-5 w-5 text-amber-500" />}
                  {notif.type === 'info' && <Info className="h-5 w-5 text-blue-500" />}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <p
                      className={`text-sm font-medium leading-none ${!notif.read ? 'text-foreground' : 'text-muted-foreground'}`}
                    >
                      {notif.title}
                    </p>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {notif.date}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{notif.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
