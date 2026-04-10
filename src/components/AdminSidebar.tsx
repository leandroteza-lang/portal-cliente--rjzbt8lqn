import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Users, FileText, Calendar, Bell, Settings, LogOut } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'

const navItems = [
  { title: 'Dashboard', url: '/admin', icon: LayoutDashboard },
  { title: 'Clientes', url: '/admin/clientes', icon: Users },
  { title: 'Documentos', url: '/admin/documentos', icon: FileText },
  { title: 'Vencimentos', url: '/admin/vencimentos', icon: Calendar },
  { title: 'Notificações', url: '/admin/notificacoes', icon: Bell },
  { title: 'Configurações', url: '/admin/configuracoes', icon: Settings },
]

export function AdminSidebar() {
  const location = useLocation()
  const { state } = useSidebar()
  const { signOut } = useAuth()

  return (
    <Sidebar className="border-r border-emerald-100 bg-white shadow-sm">
      <SidebarHeader className="h-24 flex items-center justify-center border-b border-slate-100 py-4">
        <div className="flex flex-col items-center justify-center px-4 w-full h-full">
          <span
            className={`font-bold text-emerald-600 text-lg transition-all ${state === 'collapsed' ? 'opacity-0 hidden' : 'opacity-100'}`}
          >
            Painel do Escritório
          </span>
          <span
            className={`text-xs text-slate-500 font-medium ${state === 'collapsed' ? 'opacity-0 hidden' : 'opacity-100'}`}
          >
            Área do Contador
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent className="bg-white">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="mt-4 gap-2 px-3">
              {navItems.map((item) => {
                const isActive = location.pathname === item.url
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                      className={`h-11 rounded-lg transition-all duration-200 ${
                        isActive
                          ? 'bg-emerald-50 text-emerald-600 font-semibold'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-emerald-600'
                      }`}
                    >
                      <Link to={item.url} className="flex items-center gap-3 px-3 w-full">
                        <item.icon className="h-5 w-5 shrink-0" />
                        <span className="text-[15px]">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 bg-white border-t border-slate-100">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => signOut()}
              tooltip="Sair"
              className="text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors rounded-lg h-11"
            >
              <LogOut className="h-5 w-5" />
              <span className="font-medium text-[15px]">Sair do Painel</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
