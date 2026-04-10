import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import logoCosta from '@/assets/design-sem-nome-1-editado-6f8ca.png'

export default function Login() {
  const [email, setEmail] = useState('leandro_teza@hotmail.com')
  const [password, setPassword] = useState('Skip@Pass')
  const { signIn, loading, session } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (loading) return null
  if (session) return <Navigate to="/" replace />

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    const { error } = await signIn(email, password)
    if (error) {
      toast.error('Erro ao fazer login', { description: error.message })
    } else {
      toast.success('Login realizado com sucesso!')
    }
    setIsSubmitting(false)
  }

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 px-4 animate-fade-in">
      <div className="mb-8 max-w-[280px] w-full">
        <img
          src={logoCosta}
          alt="COSTA Assessoria & Consultoria Contábil"
          className="w-full object-contain drop-shadow-sm"
        />
      </div>
      <Card className="w-full max-w-md shadow-xl border-0 ring-1 ring-slate-200/50 dark:ring-slate-800/50">
        <CardHeader className="space-y-2 pb-6">
          <CardTitle className="text-2xl font-bold text-center text-slate-800 dark:text-slate-100">
            Portal do Cliente
          </CardTitle>
          <CardDescription className="text-center text-base">
            Acesse seus documentos contábeis e fiscais
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="font-medium">
                E-mail
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 bg-slate-50/50 dark:bg-slate-950/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="font-medium">
                Senha
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12 bg-slate-50/50 dark:bg-slate-950/50"
              />
            </div>
            <Button
              type="submit"
              className="w-full h-12 text-base font-medium shadow-md"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Entrando...' : 'Entrar no Portal'}
            </Button>
            <p className="text-sm text-center text-muted-foreground mt-4">
              Use as credenciais fornecidas pelo escritório.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
