import { Link } from 'react-router-dom'
import { Receipt, PieChart, Scale, Users, Settings, Download, Eye, FileText } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
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
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'

const summaryCards = [
  { title: 'Impostos', count: 12, icon: Receipt, color: 'text-blue-600' },
  { title: 'Contábeis', count: 5, icon: PieChart, color: 'text-emerald-600' },
  { title: 'Legais', count: 2, icon: Scale, color: 'text-amber-600' },
  { title: 'Folha de Pagamento', count: 24, icon: Users, color: 'text-indigo-600' },
  { title: 'Operacionais', count: 8, icon: Settings, color: 'text-slate-600' },
]

const recentDocuments = [
  {
    id: 1,
    name: 'Guia de GPS - 10/2023',
    category: 'Impostos',
    date: '15/10/2023',
    status: 'Aprovado',
  },
  {
    id: 2,
    name: 'Balanço Patrimonial 2022',
    category: 'Contábeis',
    date: '10/10/2023',
    status: 'Pendente',
  },
  {
    id: 3,
    name: 'Alteração Contratual',
    category: 'Legais',
    date: '05/10/2023',
    status: 'Arquivado',
  },
  {
    id: 4,
    name: 'Recibos de Férias',
    category: 'Folha de Pagamento',
    date: '01/10/2023',
    status: 'Aprovado',
  },
  {
    id: 5,
    name: 'Notas Fiscais Set/23',
    category: 'Operacionais',
    date: '28/09/2023',
    status: 'Aprovado',
  },
]

const chartData = [
  { name: 'Aprovados', value: 45, fill: 'var(--color-aprovado)' },
  { name: 'Pendentes', value: 12, fill: 'var(--color-pendente)' },
  { name: 'Arquivados', value: 28, fill: 'var(--color-arquivado)' },
]

const chartConfig = {
  aprovado: { label: 'Aprovados', color: 'hsl(var(--primary))' },
  pendente: { label: 'Pendentes', color: 'hsl(var(--chart-2))' },
  arquivado: { label: 'Arquivados', color: 'hsl(var(--muted-foreground))' },
  value: { label: 'Quantidade' },
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'Aprovado':
      return (
        <Badge
          variant="outline"
          className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-800 font-medium"
        >
          Aprovado
        </Badge>
      )
    case 'Pendente':
      return (
        <Badge
          variant="outline"
          className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-800 font-medium"
        >
          Pendente
        </Badge>
      )
    default:
      return (
        <Badge
          variant="outline"
          className="bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 font-medium"
        >
          {status}
        </Badge>
      )
  }
}

export default function Index() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Bem-vindo de volta, João!</h1>
        <p className="text-muted-foreground">Aqui está o resumo da sua empresa hoje.</p>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {summaryCards.map((card) => (
          <Card
            key={card.title}
            className="hover:shadow-md transition-all duration-200 bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-800/50 border-slate-200/60 dark:border-slate-800"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                {card.title}
              </CardTitle>
              <div
                className={`p-2 rounded-lg bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 ${card.color}`}
              >
                <card.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                {card.count}
              </div>
              <Link
                to="/documentos"
                className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors mt-1 inline-block"
              >
                Ver detalhes &rarr;
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-5 flex flex-col">
          <CardHeader>
            <CardTitle>Documentos Recentes</CardTitle>
            <CardDescription>Últimos arquivos enviados ou processados.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome do Arquivo</TableHead>
                  <TableHead className="hidden md:table-cell">Categoria</TableHead>
                  <TableHead className="hidden md:table-cell">Data</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentDocuments.map((doc) => (
                  <TableRow
                    key={doc.id}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 bg-blue-50 dark:bg-blue-950 rounded-md">
                          <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <span className="text-slate-700 dark:text-slate-300">{doc.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-slate-500">
                      {doc.category}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-slate-500">
                      {doc.date}
                    </TableCell>
                    <TableCell>{getStatusBadge(doc.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Visualizar"
                          className="hover:text-blue-600 dark:hover:text-blue-400"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Baixar"
                          className="hover:text-blue-600 dark:hover:text-blue-400"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 flex flex-col">
          <CardHeader>
            <CardTitle>Status Mensal</CardTitle>
            <CardDescription>Distribuição de tarefas no mês atual.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex items-center justify-center pb-8">
            <ChartContainer config={chartConfig} className="w-full h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
