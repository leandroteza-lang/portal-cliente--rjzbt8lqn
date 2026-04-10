import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import logoCosta from '@/assets/design-sem-nome-1-editado-6f8ca.png'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'

const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(1, 'A senha é obrigatória'),
})

const registerSchema = z
  .object({
    fullName: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
    cnpj: z.string().min(14, 'CNPJ inválido'),
    companyName: z.string().min(3, 'Razão social deve ter no mínimo 3 caracteres'),
    email: z.string().email('E-mail inválido'),
    phone: z.string().min(10, 'Telefone inválido'),
    password: z.string().min(8, 'A senha deve ter no mínimo 8 caracteres'),
    confirmPassword: z.string().min(8, 'A senha deve ter no mínimo 8 caracteres'),
    terms: z.boolean().refine((val) => val === true, 'Você deve aceitar os termos de uso'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  })

const forgotPasswordSchema = z.object({
  email: z.string().email('E-mail inválido'),
})

export default function Login() {
  const [view, setView] = useState<'login' | 'register'>('login')
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false)
  const { signIn, signUp, resetPassword, loading, session } = useAuth()

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: 'leandro_teza@hotmail.com', password: 'Skip@Pass' },
  })

  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      cnpj: '',
      companyName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      terms: false,
    },
  })

  const forgotPasswordForm = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  })

  if (loading) return null
  if (session) return <Navigate to="/" replace />

  const onLoginSubmit = async (values: z.infer<typeof loginSchema>) => {
    const { error } = await signIn(values.email, values.password)
    if (error) {
      toast.error('Erro ao fazer login', { description: error.message })
    } else {
      toast.success('Login realizado com sucesso!')
    }
  }

  const onRegisterSubmit = async (values: z.infer<typeof registerSchema>) => {
    const { error } = await signUp(values.email, values.password, {
      full_name: values.fullName,
      document_number: values.cnpj,
      company_name: values.companyName,
      phone: values.phone,
    })
    if (error) {
      toast.error('Erro ao criar conta', { description: error.message })
    } else {
      toast.success('Conta criada com sucesso! Verifique seu e-mail para confirmar.')
      setView('login')
    }
  }

  const onForgotPasswordSubmit = async (values: z.infer<typeof forgotPasswordSchema>) => {
    const { error } = await resetPassword(values.email)
    if (error) {
      toast.error('Erro ao enviar e-mail', { description: error.message })
    } else {
      toast.success('E-mail de recuperação enviado!')
      setForgotPasswordOpen(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 px-4 py-8 animate-fade-in overflow-y-auto">
      <div className="mb-8 max-w-[280px] w-full mt-auto">
        <img
          src={logoCosta}
          alt="COSTA Assessoria & Consultoria Contábil"
          className="w-full object-contain drop-shadow-sm"
        />
      </div>
      <Card
        className={`w-full ${view === 'login' ? 'max-w-md' : 'max-w-xl'} shadow-xl border-0 ring-1 ring-slate-200/50 dark:ring-slate-800/50 transition-all duration-300 mb-auto`}
      >
        <CardHeader className="space-y-2 pb-6">
          <CardTitle className="text-2xl font-bold text-center text-slate-800 dark:text-slate-100">
            {view === 'login' ? 'Portal do Cliente' : 'Criar Nova Conta'}
          </CardTitle>
          <CardDescription className="text-center text-base">
            {view === 'login'
              ? 'Acesse seus documentos contábeis e fiscais'
              : 'Preencha seus dados para se cadastrar no portal'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {view === 'login' ? (
            <Form {...loginForm}>
              <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-5">
                <FormField
                  control={loginForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium">E-mail</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="seu@email.com"
                          className="h-12 bg-slate-50/50 dark:bg-slate-950/50"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel className="font-medium">Senha</FormLabel>
                        <Button
                          variant="link"
                          className="px-0 h-auto font-normal text-xs text-primary"
                          onClick={() => setForgotPasswordOpen(true)}
                          type="button"
                        >
                          Esqueci minha senha
                        </Button>
                      </div>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          className="h-12 bg-slate-50/50 dark:bg-slate-950/50"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full h-12 text-base font-medium shadow-md"
                  disabled={loginForm.formState.isSubmitting}
                >
                  {loginForm.formState.isSubmitting ? 'Entrando...' : 'Entrar no Portal'}
                </Button>
                <div className="text-center text-sm text-muted-foreground mt-4">
                  Não tem uma conta?{' '}
                  <Button
                    variant="link"
                    className="px-1 text-primary"
                    onClick={() => setView('register')}
                    type="button"
                  >
                    Criar Conta
                  </Button>
                </div>
              </form>
            </Form>
          ) : (
            <Form {...registerForm}>
              <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-5">
                <ScrollArea className="max-h-[50vh] pr-4 sm:max-h-none sm:pr-0 pb-4">
                  <div className="space-y-4 px-1">
                    <FormField
                      control={registerForm.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome Completo</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="João da Silva"
                              className="bg-slate-50/50 dark:bg-slate-950/50"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={registerForm.control}
                        name="cnpj"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>CNPJ</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="00.000.000/0000-00"
                                className="bg-slate-50/50 dark:bg-slate-950/50"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="companyName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Razão Social</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Empresa Ltda"
                                className="bg-slate-50/50 dark:bg-slate-950/50"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={registerForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>E-mail</FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="email@empresa.com"
                                className="bg-slate-50/50 dark:bg-slate-950/50"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Telefone</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="(00) 00000-0000"
                                className="bg-slate-50/50 dark:bg-slate-950/50"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={registerForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Senha</FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                placeholder="••••••••"
                                className="bg-slate-50/50 dark:bg-slate-950/50"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirmar Senha</FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                placeholder="••••••••"
                                className="bg-slate-50/50 dark:bg-slate-950/50"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={registerForm.control}
                      name="terms"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-2 mt-2">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-sm font-normal cursor-pointer">
                              Li e concordo com os Termos de Uso
                            </FormLabel>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </ScrollArea>
                <Button
                  type="submit"
                  className="w-full h-12 text-base font-medium shadow-md mt-4"
                  disabled={registerForm.formState.isSubmitting}
                >
                  {registerForm.formState.isSubmitting ? 'Criando...' : 'Criar Conta'}
                </Button>
                <div className="text-center text-sm text-muted-foreground mt-4">
                  Já tem uma conta?{' '}
                  <Button
                    variant="link"
                    className="px-1 text-primary"
                    onClick={() => setView('login')}
                    type="button"
                  >
                    Entrar
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>

      <Dialog open={forgotPasswordOpen} onOpenChange={setForgotPasswordOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Recuperar Senha</DialogTitle>
            <DialogDescription>
              Digite seu e-mail para receber um link de recuperação de senha.
            </DialogDescription>
          </DialogHeader>
          <Form {...forgotPasswordForm}>
            <form
              onSubmit={forgotPasswordForm.handleSubmit(onForgotPasswordSubmit)}
              className="space-y-4 py-4"
            >
              <FormField
                control={forgotPasswordForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input placeholder="seu@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full"
                disabled={forgotPasswordForm.formState.isSubmitting}
              >
                {forgotPasswordForm.formState.isSubmitting ? 'Enviando...' : 'Enviar Link'}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
