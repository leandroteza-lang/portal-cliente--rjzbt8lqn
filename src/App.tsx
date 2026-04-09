import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import Layout from './components/Layout'
import Index from './pages/Index'
import Documents from './pages/Documents'
import CalendarPage from './pages/CalendarPage'
import Upload from './pages/Upload'
import Notifications from './pages/Notifications'
import Profile from './pages/Profile'
import NotFound from './pages/NotFound'

const App = () => (
  <BrowserRouter future={{ v7_startTransition: false, v7_relativeSplatPath: false }}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Index />} />
          <Route path="/documentos" element={<Documents />} />
          <Route path="/calendario" element={<CalendarPage />} />
          <Route path="/enviar" element={<Upload />} />
          <Route path="/notificacoes" element={<Notifications />} />
          <Route path="/perfil" element={<Profile />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </TooltipProvider>
  </BrowserRouter>
)

export default App
