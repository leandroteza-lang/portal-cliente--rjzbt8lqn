import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, FileText, Clock, CalendarClock, CheckCircle } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState({
    totalClientes: 0,
    totalDocs: 0,
    docsPendentes: 0,
    proximosVencimentos: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDashboardData() {
      setLoading(true)

      const sevenDaysFromNow = new Date()
      sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7)
      const nextWeekDate = sevenDaysFromNow.toISOString().split('T')[0]
      const today = new Date().toISOString().split('T')[0]

      const [clientesRes, docsRes, docsPendentesRes, vencimentosRes] = await Promise.all([
        supabase.from('clientes').select('id', { count: 'exact', head: true }).eq('ativo', true),
        supabase.from('documentos').select('id', { count: 'exact', head: true }),
        supabase
          .from('documentos')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'Processando'),
        supabase
          .from('vencimentos')
          .select('id', { count: 'exact', head: true })
          .gte('data_vencimento', today)
          .lte('data_vencimento', nextWeekDate),
      ])

      setMetrics({
        totalClientes: clientesRes.count || 0,
        totalDocs: docsRes.count || 0,
        docsPendentes: docsPendentesRes.count || 0,
        proximosVencimentos: vencimentosRes.count || 0,
      })

      setLoading(false)
    }

    fetchDashboardData()
  }, [])

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Visão Geral do Escritório</h1>
        <p className="text-slate-500 mt-1">Acompanhe as métricas principais da sua operação.</p>
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total de Clientes"
          value={metrics.totalClientes}
          icon={<Users className="h-5 w-5 text-emerald-600" />}
          loading={loading}
          bgIcon="bg-emerald-100"
        />
        <MetricCard
          title="Documentos Recebidos"
          value={metrics.totalDocs}
          icon={<FileText className="h-5 w-5 text-blue-600" />}
          loading={loading}
          bgIcon="bg-blue-100"
        />
        <MetricCard
          title="Pendentes Processamento"
          value={metrics.docsPendentes}
          icon={<Clock className="h-5 w-5 text-amber-600" />}
          loading={loading}
          bgIcon="bg-amber-100"
        />
        <MetricCard
          title="Vencimentos (7 dias)"
          value={metrics.proximosVencimentos}
          icon={<CalendarClock className="h-5 w-5 text-rose-600" />}
          loading={loading}
          bgIcon="bg-rose-100"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 mt-8">
        <Card className="border-slate-200 shadow-sm bg-white overflow-hidden group">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100">
            <CardTitle className="text-lg text-slate-800 flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#3B82F6] transition-transform group-hover:scale-110" />
              Últimos Documentos
            </CardTitle>
          </CardHeader>
          <CardContent className="h-64 flex flex-col items-center justify-center m-4">
            <div className="relative w-20 h-20 mb-4 animate-fade-in-up">
              <div className="absolute inset-0 bg-[#3B82F6]/10 rounded-full" />
              <FileText className="absolute inset-0 m-auto w-10 h-10 text-[#3B82F6] transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110" />
            </div>
            <p className="text-slate-600 font-medium text-center">
              Nenhum documento processado recentemente.
            </p>
          </CardContent>
        </Card>
        <Card className="border-slate-200 shadow-sm bg-white overflow-hidden group">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100">
            <CardTitle className="text-lg text-slate-800 flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#F59E0B] transition-transform group-hover:scale-110" />
              Vencimentos Próximos
            </CardTitle>
          </CardHeader>
          <CardContent className="h-64 flex flex-col items-center justify-center m-4">
            <div className="relative w-20 h-20 mb-4 animate-fade-in-up">
              <div className="absolute inset-0 bg-[#10B981]/10 rounded-full" />
              <CheckCircle className="absolute inset-0 m-auto w-10 h-10 text-[#10B981] transition-transform duration-500 group-hover:scale-110" />
            </div>
            <p className="text-slate-600 font-medium text-center">
              Tudo em dia! Nenhum vencimento crítico para esta semana.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function MetricCard({
  title,
  value,
  icon,
  loading,
  bgIcon,
}: {
  title: string
  value: number
  icon: React.ReactNode
  loading: boolean
  bgIcon: string
}) {
  return (
    <Card className="border-slate-200 shadow-sm bg-white">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <div className={`p-2.5 rounded-lg ${bgIcon}`}>{icon}</div>
        </div>
        <div className="mt-4">
          {loading ? (
            <Skeleton className="h-8 w-16" />
          ) : (
            <span className="text-3xl font-bold text-slate-800">{value}</span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
