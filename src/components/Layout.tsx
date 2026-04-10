import { Outlet, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Search, Bell } from 'lucide-react'
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/AppSidebar'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import logoCosta from '@/assets/design-sem-nome-1-editado-6f8ca.png'
import { useAuth } from '@/hooks/use-auth'
import { supabase } from '@/lib/supabase/client'

export default function Layout() {
  const { session } = useAuth()
  const [cliente, setCliente] = useState<any>(null)
  const location = useLocation()

  useEffect(() => {
    async function fetchCliente() {
      if (session?.user?.id) {
        const { data } = await supabase
          .from('clientes')
          .select('nome')
          .eq('id', session.user.id)
          .single()

        if (data) setCliente(data)
      }
    }
    fetchCliente()
  }, [session])

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full relative z-0">
        {/* Blurred Office Background */}
        <div className="fixed inset-0 bg-[url('https://img.usecurling.com/p/1920/1080?q=modern%20bright%20office%20natural%20lighting')] bg-cover bg-center -z-20" />
        <div className="fixed inset-0 bg-slate-50/80 backdrop-blur-xl dark:bg-slate-950/90 -z-10" />

        <AppSidebar />

        <SidebarInset className="bg-transparent w-full">
          <header className="sticky top-0 z-30 flex h-24 items-center gap-4 border-b border-white/30 bg-white/50 backdrop-blur-md px-4 shadow-sm md:px-8 dark:bg-slate-900/50 dark:border-slate-800/50">
            <SidebarTrigger className="text-primary hover:bg-primary/10 h-10 w-10 shrink-0" />

            <div className="md:hidden flex items-center gap-2 mr-2">
              <img
                src={logoCosta}
                alt="COSTA Assessoria"
                className="h-8 w-auto max-w-[120px] object-contain shrink-0"
              />
            </div>

            <div className="hidden md:flex flex-col justify-center shrink-0">
              <h1 className="text-2xl font-bold text-primary tracking-tight">
                Bem-vindo, {cliente?.nome ? cliente.nome.split(' ')[0] : 'Cliente'}!
              </h1>
              <p className="text-sm text-slate-500 font-medium">Portal do Cliente COSTA</p>
            </div>

            <div className="flex-1 flex justify-end">
              <form
                onSubmit={(e) => e.preventDefault()}
                className="max-w-md w-full md:w-80 lg:w-96"
              >
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                  <Input
                    type="search"
                    placeholder="Buscar no portal..."
                    className="w-full bg-white/80 border-slate-200/60 pl-11 h-12 rounded-full focus-visible:ring-primary shadow-sm dark:bg-slate-800/80 dark:border-slate-700 text-[15px]"
                  />
                </div>
              </form>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full bg-white/80 border-slate-200/60 shadow-sm relative text-slate-600 hover:text-primary dark:bg-slate-800/80 h-12 w-12 hidden sm:flex"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-secondary rounded-full border-2 border-white"></span>
              </Button>
              <Avatar className="h-12 w-12 border-2 border-white shadow-sm cursor-pointer hover:opacity-90 transition-opacity">
                <AvatarImage
                  src={`https://img.usecurling.com/ppl/thumbnail?gender=male&seed=${session?.user?.id || '42'}`}
                />
                <AvatarFallback className="bg-primary text-white font-medium">
                  {cliente?.nome ? cliente.nome.substring(0, 2).toUpperCase() : 'CL'}
                </AvatarFallback>
              </Avatar>
            </div>
          </header>

          <main className="flex-1 p-4 md:p-8 lg:p-10 overflow-x-hidden">
            <div
              key={location.pathname}
              className="mx-auto max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both"
            >
              <Outlet />
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
