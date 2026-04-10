import { Outlet } from 'react-router-dom'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AdminSidebar } from './AdminSidebar'
import { useAuth } from '@/hooks/use-auth'
import { User } from 'lucide-react'

export default function AdminLayout() {
  const { session } = useAuth()
  const userName = session?.user?.user_metadata?.full_name || 'Contador'

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-slate-50">
        <AdminSidebar />
        <div className="flex-1 flex flex-col w-full h-screen overflow-hidden">
          <header className="h-16 flex items-center justify-between px-6 border-b border-slate-200 bg-white shrink-0 shadow-sm z-10">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="text-slate-500 hover:text-emerald-600" />
            </div>
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-end">
                <span className="text-sm font-semibold text-slate-800">{userName}</span>
                <span className="text-xs font-medium text-emerald-600">Administrador</span>
              </div>
              <div className="h-9 w-9 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center border border-emerald-200">
                <User className="h-5 w-5" />
              </div>
            </div>
          </header>
          <main className="flex-1 overflow-auto p-6 md:p-8">
            <div className="mx-auto max-w-7xl w-full h-full">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
