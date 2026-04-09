import { Link, useLocation } from 'react-router-dom'
import { Home, FileText, Calendar, Upload, Bell, User, Briefcase } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

const navItems = [
  { title: 'Início', url: '/', icon: Home },
  { title: 'Meus Documentos', url: '/documentos', icon: FileText },
  { title: 'Calendário', url: '/calendario', icon: Calendar },
  { title: 'Enviar Documentos', url: '/enviar', icon: Upload },
  { title: 'Notificações', url: '/notificacoes', icon: Bell },
  { title: 'Perfil', url: '/perfil', icon: User },
]

export function AppSidebar() {
  const location = useLocation()

  return (
    <Sidebar>
      <SidebarHeader className="h-16 flex items-center justify-center border-b border-sidebar-border py-2">
        <div className="flex items-center gap-3 px-2 w-full">
          <div className="bg-blue-900 text-white p-1.5 rounded-md shrink-0 shadow-sm">
            <Briefcase className="h-5 w-5" />
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="font-bold text-sm leading-tight tracking-tight truncate text-slate-900 dark:text-slate-100">
              COSTA Assessoria
            </span>
            <span className="text-[10px] uppercase tracking-wider text-slate-500 truncate dark:text-slate-400">
              & Consultoria Contábil
            </span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="mt-4 gap-2">
              {navItems.map((item) => {
                const isActive = location.pathname === item.url
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
                      <Link to={item.url} className="flex items-center gap-3 px-3 py-2">
                        <item.icon className="h-5 w-5" />
                        <span className="font-medium">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
