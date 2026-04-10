import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  FileText,
  Download,
  TrendingUp,
  Calendar as CalendarIcon,
  AlertCircle,
  ChevronRight,
  Building2,
  Files,
  Calculator,
  Scale,
  Users,
} from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { supabase } from '@/lib/supabase/client'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from 'recharts'
import { Badge } from '@/components/ui/badge'

const financialData = [
  { month: 'Jan', revenue: 45000, expenses: 32000 },
  { month: 'Fev', revenue: 52000, expenses: 34000 },
  { month: 'Mar', revenue: 48000, expenses: 31000 },
  { month: 'Abr', revenue: 61000, expenses: 36000 },
  { month: 'Mai', revenue: 59000, expenses: 35000 },
  { month: 'Jun', revenue: 65000, expenses: 38000 },
]

const chartConfig = {
  revenue: { label: 'Receitas', color: 'hsl(var(--secondary))' },
  expenses: { label: 'Despesas', color: 'hsl(var(--primary))' },
}

const upcomingDeadlines = [
  {
    id: 1,
    title: 'DAS - Simples Nacional',
    date: '20/10/2023',
    amount: 'R$ 4.520,00',
    isUrgent: true,
  },
  { id: 2, title: 'FGTS Mensal', date: '07/11/2023', amount: 'R$ 1.850,00', isUrgent: false },
  { id: 3, title: 'INSS Patronal', date: '20/11/2023', amount: 'R$ 3.200,00', isUrgent: false },
  {
    id: 4,
    title: 'Honorários Contábeis',
    date: '05/12/2023',
    amount: 'R$ 1.500,00',
    isUrgent: false,
  },
]

const recentDocuments = [
  { id: 1, title: 'Relatório Mensal - Jan', type: 'PDF', size: '2.4 MB', date: '01/10/2023' },
  { id: 2, title: 'Guia FGTS - Competência 09', type: 'PDF', size: '840 KB', date: '05/10/2023' },
  { id: 3, title: 'Contrato Social Consolidado', type: 'PDF', size: '4.1 MB', date: '12/10/2023' },
]

export default function Index() {
  const { session } = useAuth()
  const [cliente, setCliente] = useState<any>(null)
  const [documentos, setDocumentos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      if (session?.user?.id) {
        const [clienteRes, docsRes] = await Promise.all([
          supabase.from('clientes').select('*').eq('id', session.user.id).single(),
          supabase
            .from('documentos')
            .select('*')
            .eq('cliente_id', session.user.id)
            .order('data_upload', { ascending: false }),
        ])

        if (clienteRes.data) setCliente(clienteRes.data)
        if (docsRes.data) setDocumentos(docsRes.data)
        setLoading(false)
      }
    }
    fetchData()
  }, [session])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  const totalDocs = documentos.length
  const docsFiscais = documentos.filter((d) => d.categoria === 'Impostos').length
  const docsContabeis = documentos.filter((d) => d.categoria === 'Contábeis').length
  const docsLegais = documentos.filter((d) => d.categoria === 'Legais').length
  const docsFolha = documentos.filter((d) => d.categoria === 'Folha de Pagamento').length

  const docsRecentes = documentos.slice(0, 5)

  return (
    <div className="space-y-8 pb-8">
      {/* Boas-vindas e Dados do Cliente */}
      {cliente && (
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between animate-fade-in-up bg-white/60 dark:bg-slate-900/60 p-6 rounded-2xl border border-white/60 dark:border-slate-800 shadow-sm backdrop-blur-md">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
              Olá, {cliente.nome || 'Cliente'}! 👋
            </h1>
            <p className="text-slate-500 font-medium mt-1">
              Bem-vindo ao seu painel contábil. Aqui está o resumo das suas operações.
            </p>
          </div>
          <div className="flex items-center gap-4 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
            <div className="p-3 bg-primary/10 text-primary rounded-lg hidden sm:block">
              <Building2 className="h-6 w-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                {cliente.razao_social || 'Razão Social não informada'}
              </span>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                CNPJ: {cliente.cnpj || 'Não informado'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Cards de Resumo */}
      <div className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        <Card className="rounded-2xl shadow-elevation border-white/60 bg-white/95 backdrop-blur-md dark:bg-slate-900/95 dark:border-slate-800 transition-all hover:-translate-y-1 hover:shadow-xl duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">
              Total
            </CardTitle>
            <div className="p-2 bg-primary/10 text-primary rounded-xl">
              <Files className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800 dark:text-slate-100">{totalDocs}</div>
            <p className="text-xs text-slate-500 mt-1 font-medium">Documentos</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-elevation border-white/60 bg-white/95 backdrop-blur-md dark:bg-slate-900/95 dark:border-slate-800 transition-all hover:-translate-y-1 hover:shadow-xl duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">
              Fiscais
            </CardTitle>
            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-xl">
              <FileText className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800 dark:text-slate-100">
              {docsFiscais}
            </div>
            <p className="text-xs text-slate-500 mt-1 font-medium">Impostos</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-elevation border-white/60 bg-white/95 backdrop-blur-md dark:bg-slate-900/95 dark:border-slate-800 transition-all hover:-translate-y-1 hover:shadow-xl duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">
              Contábeis
            </CardTitle>
            <div className="p-2 bg-blue-100 text-blue-600 rounded-xl">
              <Calculator className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800 dark:text-slate-100">
              {docsContabeis}
            </div>
            <p className="text-xs text-slate-500 mt-1 font-medium">Balanços e DREs</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-elevation border-white/60 bg-white/95 backdrop-blur-md dark:bg-slate-900/95 dark:border-slate-800 transition-all hover:-translate-y-1 hover:shadow-xl duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">
              Legais
            </CardTitle>
            <div className="p-2 bg-amber-100 text-amber-600 rounded-xl">
              <Scale className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800 dark:text-slate-100">
              {docsLegais}
            </div>
            <p className="text-xs text-slate-500 mt-1 font-medium">Contratos e Atos</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-elevation border-white/60 bg-white/95 backdrop-blur-md dark:bg-slate-900/95 dark:border-slate-800 transition-all hover:-translate-y-1 hover:shadow-xl duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">
              Folha
            </CardTitle>
            <div className="p-2 bg-purple-100 text-purple-600 rounded-xl">
              <Users className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800 dark:text-slate-100">{docsFolha}</div>
            <p className="text-xs text-slate-500 mt-1 font-medium">RH e Pagamento</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        {/* Resumo Financeiro */}
        <Card className="md:col-span-7 lg:col-span-8 rounded-2xl shadow-elevation border-white/60 bg-white/95 backdrop-blur-md dark:bg-slate-900/95 dark:border-slate-800 flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-bold text-slate-800 dark:text-slate-100">
              Resumo Financeiro
            </CardTitle>
            <CardDescription className="text-sm font-medium">
              Evolução de receitas e despesas nos últimos 6 meses
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-6 pt-4">
            <ChartContainer config={chartConfig} className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={financialData}
                  margin={{ top: 20, right: 20, left: -10, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 13, fontWeight: 500 }}
                    dy={15}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 13, fontWeight: 500 }}
                    tickFormatter={(value) => `R$ ${value / 1000}k`}
                    dx={-10}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="var(--color-revenue)"
                    strokeWidth={3}
                    dot={{ r: 4, strokeWidth: 2 }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="expenses"
                    stroke="var(--color-expenses)"
                    strokeWidth={3}
                    dot={{ r: 4, strokeWidth: 2 }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Próximos Vencimentos */}
        <Card className="md:col-span-5 lg:col-span-4 rounded-2xl shadow-elevation border-white/60 bg-white/95 backdrop-blur-md dark:bg-slate-900/95 dark:border-slate-800 flex flex-col">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-slate-800 dark:text-slate-100">
              Próximos Vencimentos
            </CardTitle>
            <CardDescription className="text-sm font-medium">
              Fique atento aos prazos importantes
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 px-6">
            <div className="space-y-3">
              {upcomingDeadlines.map((deadline) => (
                <div
                  key={deadline.id}
                  className="flex flex-col p-4 rounded-xl border border-slate-200/60 bg-slate-50/50 shadow-sm dark:bg-slate-800/50 dark:border-slate-700/60 transition-colors hover:border-slate-300"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-semibold text-[15px] text-slate-800 dark:text-slate-200">
                      {deadline.title}
                    </span>
                    {deadline.isUrgent && (
                      <Badge
                        variant="destructive"
                        className="text-[10px] px-2 py-0.5 uppercase tracking-wider font-bold rounded-md"
                      >
                        Urgente
                      </Badge>
                    )}
                  </div>
                  <div className="flex justify-between items-end mt-1">
                    <div className="flex items-center text-slate-600 text-[13px] font-semibold bg-white px-2.5 py-1.5 rounded-md border border-slate-200 shadow-sm dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600">
                      <CalendarIcon className="h-3.5 w-3.5 mr-1.5 text-primary" />
                      {deadline.date}
                    </div>
                    <span className="font-bold text-primary dark:text-primary text-lg tracking-tight">
                      {deadline.amount}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="pt-2 pb-5">
            <Button
              variant="ghost"
              className="w-full text-secondary hover:text-secondary hover:bg-secondary/10 font-bold group rounded-xl"
            >
              Ver todos os impostos
              <ChevronRight className="h-4 w-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Documentos Recentes */}
      <Card className="rounded-2xl shadow-elevation border-white/60 bg-white/95 backdrop-blur-md dark:bg-slate-900/95 dark:border-slate-800">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div>
            <CardTitle className="text-xl font-bold text-slate-800 dark:text-slate-100">
              Documentos Recentes
            </CardTitle>
            <CardDescription className="text-sm font-medium mt-1">
              Últimos arquivos disponibilizados pela assessoria
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            asChild
            className="hidden sm:flex rounded-full border-slate-200 shadow-sm font-semibold hover:bg-slate-50"
          >
            <Link to="/documentos">Acessar Pasta</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {docsRecentes.length === 0 ? (
            <div className="text-center py-10">
              <div className="mx-auto w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-3">
                <FileText className="h-6 w-6 text-slate-400" />
              </div>
              <p className="text-slate-500 font-medium">Nenhum documento enviado ainda</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {docsRecentes.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-4 rounded-xl border border-slate-200/60 bg-white shadow-sm hover:border-slate-300 hover:shadow-md transition-all dark:bg-slate-800/80 dark:border-slate-700 group"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3.5 bg-rose-50 text-rose-600 rounded-xl group-hover:bg-rose-100 transition-colors">
                      <FileText className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-slate-200 text-[15px]">
                        {doc.nome}
                      </h4>
                      <p className="text-[13px] text-slate-500 font-semibold flex items-center gap-2.5 mt-1">
                        <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                          {doc.categoria}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                        <span>
                          {doc.data_upload
                            ? new Date(doc.data_upload).toLocaleDateString('pt-BR')
                            : 'Data indisponível'}
                        </span>
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="text-slate-600 hover:text-primary hover:bg-primary/5 hover:border-primary/30 rounded-full font-semibold gap-2 hidden md:flex"
                    onClick={() => {
                      if (doc.arquivo_url) window.open(doc.arquivo_url, '_blank')
                    }}
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-slate-400 hover:text-primary hover:bg-primary/10 rounded-full h-10 w-10 md:hidden"
                    onClick={() => {
                      if (doc.arquivo_url) window.open(doc.arquivo_url, '_blank')
                    }}
                  >
                    <Download className="h-5 w-5" />
                  </Button>
                </div>
              ))}
            </div>
          )}
          {docsRecentes.length > 0 && (
            <Button
              variant="outline"
              className="w-full mt-4 sm:hidden font-semibold rounded-xl"
              asChild
            >
              <Link to="/documentos">Acessar Pasta de Documentos</Link>
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
