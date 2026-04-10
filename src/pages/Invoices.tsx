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
        <Card className="flex h-[50vh] flex-col items-center justify-center text-center shadow-sm border-dashed group">
          <div className="relative w-28 h-28 mb-6 animate-fade-in-up">
            <div className="absolute inset-0 bg-[#10B981]/10 dark:bg-[#10B981]/20 rounded-full animate-ping" />
            <div className="absolute inset-4 bg-[#10B981]/20 dark:bg-[#10B981]/30 rounded-full" />
            <FileText className="absolute inset-0 m-auto w-12 h-12 text-[#10B981] transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110" />
            <div className="absolute bottom-2 right-2 w-8 h-8 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center shadow-sm border border-slate-100 dark:border-slate-800">
              <CheckCircle2 className="w-5 h-5 text-[#3B82F6]" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">
            Nenhuma fatura no momento
          </h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm">
            Tudo certo por aqui! Você não possui faturas ou boletos pendentes.
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
                    <TableCell colSpan={5} className="h-64 text-center">
                      <div className="flex flex-col items-center justify-center py-8 animate-fade-in-up group">
                        <div className="relative w-20 h-20 mb-4">
                          <div className="absolute inset-0 bg-[#F59E0B]/10 dark:bg-[#F59E0B]/20 rounded-full" />
                          <Search className="absolute inset-0 m-auto w-8 h-8 text-[#F59E0B] transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110" />
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 font-medium">
                          Nenhuma fatura encontrada para este filtro.
                        </p>
                      </div>
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
                              className="group hover:border-[#3B82F6] hover:text-[#3B82F6]"
                              onClick={() => handleCopyBarcode(f.codigo_barras!)}
                              title="Copiar código"
                            >
                              <Copy className="h-4 w-4 sm:mr-1 transition-transform duration-300 group-hover:scale-110" />
                              <span className="hidden sm:inline">Copiar</span>
                            </Button>
                          )}
                          {f.link_boleto && (
                            <Button
                              variant="default"
                              size="sm"
                              className="group bg-[#10B981] hover:bg-[#059669] text-white"
                              onClick={() => window.open(f.link_boleto!, '_blank')}
                              title="Baixar"
                            >
                              <Download className="h-4 w-4 sm:mr-1 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-0.5" />
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
