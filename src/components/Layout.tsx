import { Outlet, Link } from 'react-router-dom'
import { Search } from 'lucide-react'
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/AppSidebar'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default function Layout() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-muted/30 dark:bg-background">
        <AppSidebar />
        <SidebarInset>
          <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 shadow-sm md:px-6">
            <SidebarTrigger />
            <div className="md:hidden flex items-center gap-2 mr-2">
              <img
                src="https://img.usecurling.com/i?q=letter%20C%20logo&color=azure&shape=fill"
                alt="COSTA Logo"
                className="h-6 w-6 object-contain shrink-0"
              />
              <span className="font-bold text-sm tracking-tight text-foreground truncate">
                COSTA
              </span>
            </div>
            <div className="flex-1">
              <form onSubmit={(e) => e.preventDefault()} className="max-w-md">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Buscar documentos..."
                    className="w-full bg-muted/50 pl-9 border-none focus-visible:bg-background"
                  />
                </div>
              </form>
            </div>
            <div className="flex items-center gap-4">
              <Button asChild variant="default" size="sm" className="hidden md:flex">
                <Link to="/enviar">Upload</Link>
              </Button>
              <Avatar className="h-9 w-9 border cursor-pointer hover:opacity-80 transition-opacity">
                <AvatarImage src="https://img.usecurling.com/ppl/thumbnail?gender=female&seed=12" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </div>
          </header>
          <main className="flex-1 p-4 md:p-6 lg:p-8 animate-fade-in-up">
            <div className="mx-auto max-w-7xl">
              <Outlet />
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
