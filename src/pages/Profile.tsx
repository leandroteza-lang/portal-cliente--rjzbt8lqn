import { Building2, Mail, Phone, MapPin, Shield } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/hooks/use-toast'

export default function Profile() {
  const { toast } = useToast()

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: 'Perfil atualizado',
      description: 'As informações da empresa foram salvas com sucesso.',
    })
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Perfil da Empresa</h1>
        <p className="text-muted-foreground">
          Gerencie as informações cadastrais e dados de contato.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        <div className="md:col-span-4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Configurações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              <Button variant="secondary" className="w-full justify-start text-left font-normal">
                <Building2 className="mr-2 h-4 w-4" />
                Dados Cadastrais
              </Button>
              <Button variant="ghost" className="w-full justify-start text-left font-normal">
                <Shield className="mr-2 h-4 w-4" />
                Segurança e Senha
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-8 space-y-6">
          <form onSubmit={handleSave}>
            <Card>
              <CardHeader>
                <CardTitle>Informações Básicas</CardTitle>
                <CardDescription>
                  Atualize os dados da sua organização mantidos na COSTA Assessoria & Consultoria
                  Contábil.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="razao">Razão Social</Label>
                    <Input id="razao" defaultValue="Empresa Exemplo Tecnologia LTDA" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="cnpj">CNPJ</Label>
                    <Input
                      id="cnpj"
                      defaultValue="12.345.678/0001-99"
                      disabled
                      className="bg-muted"
                    />
                    <p className="text-xs text-muted-foreground">
                      O CNPJ não pode ser alterado. Entre em contato com o suporte.
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Contato</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="email">E-mail Principal</Label>
                      <div className="relative">
                        <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          defaultValue="contato@empresaexemplo.com.br"
                          className="pl-9"
                        />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="phone">Telefone</Label>
                      <div className="relative">
                        <Phone className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input id="phone" defaultValue="(11) 98765-4321" className="pl-9" />
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Endereço</h3>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="address">Logradouro</Label>
                      <div className="relative">
                        <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="address"
                          defaultValue="Av. Paulista, 1000 - Conj 101"
                          className="pl-9"
                        />
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-3 gap-4">
                      <div className="grid gap-2 sm:col-span-2">
                        <Label htmlFor="city">Cidade</Label>
                        <Input id="city" defaultValue="São Paulo" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="state">Estado</Label>
                        <Input id="state" defaultValue="SP" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-muted/20 justify-end py-4">
                <Button type="submit">Salvar Alterações</Button>
              </CardFooter>
            </Card>
          </form>
        </div>
      </div>
    </div>
  )
}
