import { useState, useEffect, useMemo } from 'react'
import { format, addDays, isBefore, isSameMonth } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  Calendar as CalendarIcon,
  AlertCircle,
  FileText,
  CheckCircle2,
  Clock,
  Landmark,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar } from '@/components/ui/calendar'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { getTaxes, Tax } from '@/services/taxes'

const TAX_COLORS: Record<string, string> = {
  DARF: 'bg-blue-100 text-blue-900 border-blue-200 dark:bg-blue-900/40 dark:text-blue-200',
  ICMS: 'bg-orange-100 text-orange-900 border-orange-200 dark:bg-orange-900/40 dark:text-orange-200',
  ISS: 'bg-green-100 text-green-900 border-green-200 dark:bg-green-900/40 dark:text-green-200',
  'PIS/COFINS':
    'bg-purple-100 text-purple-900 border-purple-200 dark:bg-purple-900/40 dark:text-purple-200',
  IRPJ: 'bg-red-100 text-red-900 border-red-200 dark:bg-red-900/40 dark:text-red-200',
  CSLL: 'bg-teal-100 text-teal-900 border-teal-200 dark:bg-teal-900/40 dark:text-teal-200',
}

const MODIFIER_CLASSES: Record<string, string> = {
  DARF: 'bg-blue-100 font-bold text-blue-900 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-100',
  ICMS: 'bg-orange-100 font-bold text-orange-900 hover:bg-orange-200 dark:bg-orange-900 dark:text-orange-100',
  ISS: 'bg-green-100 font-bold text-green-900 hover:bg-green-200 dark:bg-green-900 dark:text-green-100',
  'PIS/COFINS':
    'bg-purple-100 font-bold text-purple-900 hover:bg-purple-200 dark:bg-purple-900 dark:text-purple-100',
  IRPJ: 'bg-red-100 font-bold text-red-900 hover:bg-red-200 dark:bg-red-900 dark:text-red-100',
  CSLL: 'bg-teal-100 font-bold text-teal-900 hover:bg-teal-200 dark:bg-teal-900 dark:text-teal-100',
}

const parseLocalDate = (dateStr: string) => {
  const [year, month, day] = dateStr.split('T')[0].split('-')
  return new Date(Number(year), Number(month) - 1, Number(day))
}

export default function Taxes() {
  const [taxes, setTaxes] = useState<Tax[]>([])
  const [viewMonth, setViewMonth] = useState<Date>(new Date())
  const [selectedTax, setSelectedTax] = useState<Tax | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getTaxes().then((data) => {
      setTaxes(data)
      setLoading(false)
    })
  }, [])

  const { modifiers, upcoming, monthTaxes } = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const thirtyDaysFromNow = addDays(today, 30)

    const upcoming = taxes
      .filter((t) => {
        const date = parseLocalDate(t.due_date)
        return t.status !== 'Pago' && isBefore(date, thirtyDaysFromNow)
      })
      .sort((a, b) => parseLocalDate(a.due_date).getTime() - parseLocalDate(b.due_date).getTime())

    const monthTaxes = taxes.filter((t) => isSameMonth(parseLocalDate(t.due_date), viewMonth))

    const modifiers: Record<string, Date[]> = {}
    taxes.forEach((t) => {
      if (!modifiers[t.tax_type]) modifiers[t.tax_type] = []
      modifiers[t.tax_type].push(parseLocalDate(t.due_date))
    })

    return { modifiers, upcoming, monthTaxes }
  }, [taxes, viewMonth])

  const TaxItem = ({ tax }: { tax: Tax }) => {
    const isUrgent =
      tax.status !== 'Pago' && isBefore(parseLocalDate(tax.due_date), addDays(new Date(), 7))
    return (
      <div
        onClick={() => setSelectedTax(tax)}
        className="flex items-center gap-4 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors cursor-pointer group"
      >
        <div className={`p-2 rounded-full shrink-0 ${TAX_COLORS[tax.tax_type] || 'bg-slate-100'}`}>
          <Landmark className="h-4 w-4" />
        </div>
        <div className="flex-1 space-y-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="font-medium text-sm truncate">{tax.title}</p>
            {isUrgent && <AlertCircle className="h-4 w-4 text-destructive shrink-0" />}
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <CalendarIcon className="h-3 w-3" />
            <span>{format(parseLocalDate(tax.due_date), 'dd/MM/yyyy')}</span>
            <span>•</span>
            <span className="font-medium text-foreground">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                tax.amount,
              )}
            </span>
          </div>
        </div>
        <Badge
          variant={
            tax.status === 'Pago' ? 'default' : tax.status === 'Enviado' ? 'secondary' : 'outline'
          }
          className={
            tax.status === 'Pago'
              ? 'bg-green-600'
              : tax.status === 'Pendente'
                ? 'text-amber-600 border-amber-200'
                : ''
          }
        >
          {tax.status}
        </Badge>
      </div>
    )
  }

  if (loading) return <div className="p-8 text-center animate-pulse">Carregando impostos...</div>

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Calendário de Impostos</h1>
        <p className="text-muted-foreground">Gerencie seus vencimentos e guias tributárias.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        <div className="md:col-span-7 lg:col-span-8 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Visão Mensal</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center pb-6">
              <Calendar
                mode="single"
                month={viewMonth}
                onMonthChange={setViewMonth}
                modifiers={modifiers}
                modifiersClassNames={MODIFIER_CLASSES}
                className="rounded-md border shadow-sm p-3 w-full max-w-sm"
                locale={ptBR}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Vencimentos de {format(viewMonth, 'MMMM/yyyy', { locale: ptBR })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {monthTaxes.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Nenhum imposto neste mês.
                </p>
              ) : (
                <div className="space-y-3">
                  {monthTaxes.map((tax) => (
                    <TaxItem key={tax.id} tax={tax} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-5 lg:col-span-4">
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Próximos 30 Dias
              </CardTitle>
              <CardDescription>Vencimentos pendentes e próximos</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 p-0">
              <ScrollArea className="h-[500px] px-6 pb-6">
                {upcoming.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    Tudo em dia! Nenhum vencimento próximo.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {upcoming.map((tax) => (
                      <TaxItem key={tax.id} tax={tax} />
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={!!selectedTax} onOpenChange={(o) => !o && setSelectedTax(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalhes da Guia</DialogTitle>
            <DialogDescription>Informações completas do imposto selecionado.</DialogDescription>
          </DialogHeader>
          {selectedTax && (
            <div className="space-y-4 pt-4">
              <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Tipo de Guia</p>
                  <p className="text-lg font-bold">{selectedTax.tax_type}</p>
                </div>
                <Badge className={TAX_COLORS[selectedTax.tax_type]} variant="outline">
                  {selectedTax.tax_type}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Competência/Título</p>
                  <p className="font-medium">{selectedTax.title}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Valor</p>
                  <p className="font-medium">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                      selectedTax.amount,
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Data Limite</p>
                  <p className="font-medium">
                    {format(parseLocalDate(selectedTax.due_date), "dd 'de' MMMM, yyyy", {
                      locale: ptBR,
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status Atual</p>
                  <Badge
                    variant={selectedTax.status === 'Pago' ? 'default' : 'outline'}
                    className="mt-1"
                  >
                    {selectedTax.status}
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
