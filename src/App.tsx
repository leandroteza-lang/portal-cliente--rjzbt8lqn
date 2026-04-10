import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import Layout from './components/Layout'
import Index from './pages/Index'
import Documents from './pages/Documents'
import Upload from './pages/Upload'
import Profile from './pages/Profile'
import Taxes from './pages/Taxes'
import Invoices from './pages/Invoices'
import Notifications from './pages/Notifications'
import NotFound from './pages/NotFound'
import Login from './pages/Login'
import AdminLayout from './components/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminClientes from './pages/admin/AdminClientes'
import AdminDocumentos from './pages/admin/AdminDocumentos'
import AdminVencimentos from './pages/admin/AdminVencimentos'
import AdminNotificacoes from './pages/admin/AdminNotificacoes'
import AdminConfiguracoes from './pages/admin/AdminConfiguracoes'
import { AuthProvider, useAuth } from './hooks/use-auth'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'

const Placeholder = ({ title }: { title: string }) => (
  <div className="flex flex-col items-center justify-center h-[50vh] text-center max-w-md mx-auto animate-fade-in-up">
    <div className="w-16 h-16 bg-primary/10 text-primary flex items-center justify-center rounded-2xl mb-6 shadow-sm">
      <span className="text-2xl font-bold">{title.charAt(0)}</span>
    </div>
    <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-3">{title}</h1>
    <p className="text-slate-500 font-medium leading-relaxed">
      Esta seção do portal está sendo preparada e estará disponível em breve com novas
      funcionalidades.
    </p>
  </div>
)

const ProtectedRoute = () => {
  const { session, loading } = useAuth()
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)

  useEffect(() => {
    if (session?.user?.id) {
      supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', session.user.id)
        .single()
        .then(({ data }) => {
          setIsAdmin(!!data?.is_admin)
        })
    } else if (!loading) {
      setIsAdmin(false)
    }
  }, [session, loading])

  if (loading || isAdmin === null) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50 dark:bg-slate-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!session) return <Navigate to="/login" replace />

  if (isAdmin) return <Navigate to="/admin" replace />

  return <Layout />
}

const AdminRoute = () => {
  const { session, loading } = useAuth()
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)

  useEffect(() => {
    if (session?.user?.id) {
      supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', session.user.id)
        .single()
        .then(({ data }) => {
          setIsAdmin(!!data?.is_admin)
        })
    } else if (!loading) {
      setIsAdmin(false)
    }
  }, [session, loading])

  if (loading || isAdmin === null) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    )
  }

  if (!session) return <Navigate to="/login" replace />
  if (!isAdmin) return <Navigate to="/" replace />

  return <AdminLayout />
}

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route element={<ProtectedRoute />}>
      <Route path="/" element={<Index />} />
      <Route path="/documentos" element={<Documents />} />
      <Route path="/upload" element={<Upload />} />
      <Route path="/impostos" element={<Taxes />} />
      <Route path="/faturas" element={<Invoices />} />
      <Route path="/notificacoes" element={<Notifications />} />
      <Route path="/perfil" element={<Profile />} />
    </Route>
    <Route path="/admin" element={<AdminRoute />}>
      <Route index element={<AdminDashboard />} />
      <Route path="clientes" element={<AdminClientes />} />
      <Route path="documentos" element={<AdminDocumentos />} />
      <Route path="vencimentos" element={<AdminVencimentos />} />
      <Route path="notificacoes" element={<AdminNotificacoes />} />
      <Route path="configuracoes" element={<AdminConfiguracoes />} />
    </Route>
    <Route path="*" element={<NotFound />} />
  </Routes>
)

const App = () => (
  <AuthProvider>
    <BrowserRouter future={{ v7_startTransition: false, v7_relativeSplatPath: false }}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AppRoutes />
      </TooltipProvider>
    </BrowserRouter>
  </AuthProvider>
)

export default App
