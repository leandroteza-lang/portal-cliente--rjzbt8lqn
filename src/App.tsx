import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import Layout from './components/Layout'
import Index from './pages/Index'
import Documents from './pages/Documents'
import Profile from './pages/Profile'
import NotFound from './pages/NotFound'
import Login from './pages/Login'
import { AuthProvider, useAuth } from './hooks/use-auth'

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50 dark:bg-slate-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!session) return <Navigate to="/login" replace />

  return <Layout />
}

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route element={<ProtectedRoute />}>
      <Route path="/" element={<Index />} />
      <Route path="/documentos" element={<Documents />} />
      <Route path="/impostos" element={<Placeholder title="Meus Impostos" />} />
      <Route path="/faturas" element={<Placeholder title="Faturas e Boletos" />} />
      <Route path="/mensagens" element={<Placeholder title="Central de Mensagens" />} />
      <Route path="/perfil" element={<Profile />} />
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
