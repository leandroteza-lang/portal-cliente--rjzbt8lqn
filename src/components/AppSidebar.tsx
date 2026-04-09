import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, FileText, Landmark, Receipt, MessageSquare, User } from 'lucide-react'
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
  { title: 'Visão Geral', url: '/', icon: LayoutDashboard },
  { title: 'Meus Documentos', url: '/documentos', icon: FileText },
  { title: 'Impostos', url: '/impostos', icon: Landmark },
  { title: 'Faturas', url: '/faturas', icon: Receipt },
  { title: 'Mensagens', url: '/mensagens', icon: MessageSquare },
  { title: 'Perfil', url: '/perfil', icon: User },
]

export function AppSidebar() {
  const location = useLocation()
  const { state } = useSidebar()

  return (
    <Sidebar className="border-r border-white/30 bg-white/80 backdrop-blur-xl dark:bg-slate-900/80 shadow-elevation">
      <SidebarHeader className="h-24 flex items-center justify-center border-b border-slate-200/50 py-4 bg-transparent dark:border-slate-800/50">
        <div className="flex items-center justify-center px-4 w-full h-full">
          <img
            src={logoCosta}
            alt="COSTA Assessoria & Consultoria Contábil"
            className={`object-contain transition-all duration-300 ease-in-out ${
              state === 'collapsed' ? 'w-full h-8 opacity-0' : 'w-full h-full opacity-100'
            }`}
          />
        </div>
      </SidebarHeader>
      <SidebarContent className="bg-transparent">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="mt-6 gap-3 px-3">
              {navItems.map((item) => {
                const isActive = location.pathname === item.url
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                      className={`h-12 rounded-xl transition-all duration-200 ${
                        isActive
                          ? 'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground shadow-md'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-primary dark:text-slate-400 dark:hover:bg-slate-800'
                      }`}
                    >
                      <Link to={item.url} className="flex items-center gap-3 px-4">
                        <item.icon className={`h-5 w-5 ${isActive ? 'text-secondary' : ''}`} />
                        <span className="font-medium text-[15px]">{item.title}</span>
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
