import { useState, useEffect } from 'react'
import { getFaturas, Fatura } from '@/services/faturas'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import {
  Copy,
  Download,
  Search,
  FileText,
  CheckCircle2,
  AlertCircle,
  Clock,
  Calendar,
} from 'lucide-react'
import { format, parseISO } from 'date-fns'

const safeDate = (dateStr: string) =>
  parseISO(dateStr.includes('T') ? dateStr : `${dateStr}T12:00:00`)
const formatCurrency = (val: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)

export default function Invoices() {
  const [faturas, setFaturas] = useState<Fatura[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('aberto')
  const { toast } = useToast()

  useEffect(() => {
    getFaturas()
      .then(setFaturas)
      .catch(() => {
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar as faturas.',
          variant: 'destructive',
        })
      })
      .finally(() => setLoading(false))
  }, [toast])

  const handleCopyBarcode = (barcode: string) => {
    navigator.clipboard.writeText(barcode)
    toast({ title: 'Copiado', description: 'Código de barras copiado.' })
  }

  const getStatusBadge = (status: string) => {
    if (status === 'Pago')
      return (
        <Badge className="bg-emerald-500 hover:bg-emerald-600">
          <CheckCircle2 className="w-3 h-3 mr-1" /> Pago
        </Badge>
      )
    if (status === 'Atrasado')
      return (
        <Badge variant="destructive">
          <AlertCircle className="w-3 h-3 mr-1" /> Atrasado
        </Badge>
      )
    return (
      <Badge className="bg-amber-500 hover:bg-amber-600">
        <Clock className="w-3 h-3 mr-1" /> Pendente
      </Badge>
    )
  }

  const filtered = faturas.filter(
    (f) =>
      f.descricao.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (activeTab === 'aberto' ? ['Pendente', 'Atrasado'].includes(f.status) : f.status === 'Pago'),
  )

  const pendentes = faturas.filter((f) => ['Pendente', 'Atrasado'].includes(f.status))
  const totalAberto = pendentes.reduce((acc, f) => acc + f.valor, 0)
  const proximoVenc = pendentes.sort(
    (a, b) => new Date(a.data_vencimento).getTime() - new Date(b.data_vencimento).getTime(),
  )[0]

  if (loading)
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center gap-4 animate-fade-in">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-sm text-muted-foreground font-medium">Carregando informações...</p>
      </div>
    )

  if (!faturas.length)
    return (
      <div className="flex-1 p-4 md:p-8 pt-6 animate-fade-in">
        <h2 className="text-3xl font-bold tracking-tight mb-8 text-slate-800 dark:text-slate-100">
          Faturas e Boletos
        </h2>
        <Card className="flex h-[50vh] flex-col items-center justify-center text-center shadow-sm border-dashed">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 flex items-center justify-center rounded-full mb-4">
            <FileText className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
            Nenhuma fatura encontrada
          </h3>
          <p className="text-sm text-muted-foreground mt-2 max-w-sm">
            Você não possui faturas no momento. Elas aparecerão aqui quando forem geradas.
          </p>
        </Card>
      </div>
    )

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
          Faturas e Boletos
        </h2>
        <p className="text-muted-foreground mt-1">
          Gerencie seus pagamentos e histórico financeiro.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total em Aberto</CardTitle>
            <FileText className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalAberto)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Referente a {pendentes.length} faturas
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Próximo Vencimento</CardTitle>
            <Calendar className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            {proximoVenc ? (
              <>
                <div className="text-2xl font-bold">
                  {format(safeDate(proximoVenc.data_vencimento), 'dd/MM/yyyy')}
                </div>
                <p className="text-xs text-muted-foreground mt-1 truncate">
                  {proximoVenc.descricao}
                </p>
              </>
            ) : (
              <>
                <div className="text-2xl font-bold">-</div>
                <p className="text-xs text-muted-foreground mt-1">Nenhuma fatura pendente</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Histórico Financeiro</CardTitle>
          <CardDescription>Visualize e gerencie seus boletos e pagamentos.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <Tabs
              defaultValue="aberto"
              onValueChange={setActiveTab}
              className="w-full sm:w-[400px]"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="aberto">Em Aberto</TabsTrigger>
                <TabsTrigger value="historico">Histórico</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar fatura..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50 dark:bg-slate-900/50">
                <TableRow>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Vencimento</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!filtered.length ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                      Nenhuma fatura encontrada para este filtro.
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((f) => (
                    <TableRow key={f.id} className="group">
                      <TableCell className="font-medium">{f.descricao}</TableCell>
                      <TableCell>{format(safeDate(f.data_vencimento), 'dd/MM/yyyy')}</TableCell>
                      <TableCell className="font-medium">{formatCurrency(f.valor)}</TableCell>
                      <TableCell>{getStatusBadge(f.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                          {f.codigo_barras && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCopyBarcode(f.codigo_barras!)}
                              title="Copiar código"
                            >
                              <Copy className="h-4 w-4 sm:mr-1" />
                              <span className="hidden sm:inline">Copiar</span>
                            </Button>
                          )}
                          {f.link_boleto && (
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => window.open(f.link_boleto!, '_blank')}
                              title="Baixar"
                            >
                              <Download className="h-4 w-4 sm:mr-1" />
                              <span className="hidden sm:inline">Boleto</span>
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
