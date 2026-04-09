import { useState } from 'react'
import { Calendar as CalendarIcon, Clock, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar } from '@/components/ui/calendar'
import { Badge } from '@/components/ui/badge'

const mockEvents = [
  { id: 1, date: new Date(), title: 'Vencimento GPS', type: 'imposto', time: '18:00' },
  {
    id: 2,
    date: new Date(new Date().setDate(new Date().getDate() + 2)),
    title: 'Fechamento da Folha',
    type: 'folha',
    time: '12:00',
  },
  {
    id: 3,
    date: new Date(new Date().setDate(new Date().getDate() + 5)),
    title: 'Pagamento DAS',
    type: 'imposto',
    time: '18:00',
  },
]

export default function CalendarPage() {
  const [date, setDate] = useState<Date | undefined>(new Date())

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Calendário de Vencimentos</h1>
        <p className="text-muted-foreground">
          Acompanhe prazos importantes de impostos e obrigações.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        <Card className="md:col-span-5 lg:col-span-4 flex flex-col">
          <CardHeader>
            <CardTitle className="text-lg">Selecione uma data</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex justify-center pb-6">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border shadow-sm w-fit"
            />
          </CardContent>
        </Card>

        <Card className="md:col-span-7 lg:col-span-8 flex flex-col">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Eventos e Prazos
            </CardTitle>
            <CardDescription>
              {date
                ? `Mostrando eventos próximos a ${date.toLocaleDateString('pt-BR')}`
                : 'Selecione uma data para ver os eventos.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="space-y-4">
              {mockEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-start gap-4 p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                >
                  <div className="bg-primary/10 p-3 rounded-full shrink-0">
                    {event.type === 'imposto' ? (
                      <AlertCircle className="h-5 w-5 text-primary" />
                    ) : (
                      <Clock className="h-5 w-5 text-primary" />
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium leading-none">{event.title}</p>
                      <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">
                        {event.date.toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Até às {event.time}
                    </p>
                    <div className="pt-2">
                      <Badge
                        variant="outline"
                        className={
                          event.type === 'imposto'
                            ? 'text-amber-600 border-amber-200 bg-amber-50'
                            : 'text-purple-600 border-purple-200 bg-purple-50'
                        }
                      >
                        {event.type === 'imposto' ? 'Impostos' : 'Folha'}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
