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
  useSidebar,
} from '@/components/ui/sidebar'
import logoCosta from '@/assets/design-sem-nome-1-editado-6f8ca.png'

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
  const { state } = useSidebar()

  return (
    <Sidebar>
      <SidebarHeader className="h-24 flex items-center justify-center border-b border-sidebar-border py-4 bg-sidebar">
        <div className="flex items-center justify-center px-2 w-full h-full">
          <img
            src={logoCosta}
            alt="COSTA Assessoria & Consultoria Contábil"
            className={`object-contain transition-all duration-300 ease-in-out ${
              state === 'collapsed' ? 'w-full h-8' : 'w-full h-full'
            }`}
          />
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
