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
  { title: 'Calendário de Vencimentos', url: '/calendario', icon: Calendar },
  { title: 'Enviar Documentos', url: '/enviar', icon: Upload },
  { title: 'Notificações', url: '/notificacoes', icon: Bell },
  { title: 'Perfil', url: '/perfil', icon: User },
]

export function AppSidebar() {
  const location = useLocation()

  return (
    <Sidebar>
      <SidebarHeader className="h-16 flex items-center justify-center border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-4 w-full">
          <div className="bg-primary text-primary-foreground p-1.5 rounded-md">
            <Briefcase className="h-5 w-5" />
          </div>
          <span className="font-bold text-lg tracking-tight truncate">Portal Cliente</span>
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
