import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Search, Plus, Edit, Trash2, Filter, RefreshCw, CheckCircle2 } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { format } from 'date-fns'

type Cliente = {
  id: string
  nome: string
  cnpj: string
  razao_social: string
  email: string
  telefone: string
  whatsapp: string
  ativo: boolean
  data_criacao: string
  sincronizado_rfb?: boolean
  data_ultima_sincronizacao?: string
  situacao_cadastral?: string
  endereco?: string
  data_abertura?: string
}

export default function AdminClientes() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [filtros, setFiltros] = useState({ ativo: true, inativo: true })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState<Partial<Cliente>>({})
  const [oldFormData, setOldFormData] = useState<Partial<Cliente>>({})

  const [isFetchingRfb, setIsFetchingRfb] = useState(false)
  const [isDiffModalOpen, setIsDiffModalOpen] = useState(false)
  const [rfbDiffData, setRfbDiffData] = useState<any>(null)

  const loadClientes = async () => {
    let query = supabase.from('clientes').select('*', { count: 'exact' })
    if (search) query = query.or(`nome.ilike.%${search}%,cnpj.ilike.%${search}%`)
    if (filtros.ativo && !filtros.inativo) query = query.eq('ativo', true)
    if (!filtros.ativo && filtros.inativo) query = query.eq('ativo', false)

    const { data, count } = await query
      .range((page - 1) * 10, page * 10 - 1)
      .order('data_criacao', { ascending: false })
    setClientes(data || [])
    setTotal(count || 0)
  }

  useEffect(() => {
    loadClientes()
  }, [search, filtros, page])

  const handleSave = async () => {
    if (formData.id) {
      const updateData = {
        nome: formData.nome,
        cnpj: formData.cnpj,
        razao_social: formData.razao_social,
        email: formData.email,
        telefone: formData.telefone,
        whatsapp: formData.whatsapp,
        ativo: formData.ativo,
        sincronizado_rfb: formData.sincronizado_rfb,
        data_ultima_sincronizacao: formData.data_ultima_sincronizacao,
        situacao_cadastral: formData.situacao_cadastral,
        endereco: formData.endereco,
        data_abertura: formData.data_abertura,
      }

      const { error } = await supabase.from('clientes').update(updateData).eq('id', formData.id)
      if (error) {
        toast.error('Erro ao atualizar cliente')
        return
      }

      if (
        updateData.sincronizado_rfb &&
        updateData.data_ultima_sincronizacao !== oldFormData.data_ultima_sincronizacao
      ) {
        await supabase.from('historico_clientes').insert({
          cliente_id: formData.id,
          dados_antigos: oldFormData,
          dados_novos: updateData,
        })
      }

      toast.success('Cliente atualizado')
    } else {
      toast.error(
        'A criação de clientes diretamente pelo painel requer registro com senha. Solicite ao cliente que se cadastre no portal.',
      )
    }
    setIsModalOpen(false)
    loadClientes()
  }

  const handleDelete = async (id: string) => {
    if (confirm('Deletar cliente?')) {
      await supabase.from('clientes').delete().eq('id', id)
      toast.success('Cliente removido')
      loadClientes()
    }
  }

  const applyRfbData = (rfbData: any) => {
    setFormData((prev) => ({
      ...prev,
      razao_social: rfbData.razao_social || prev.razao_social,
      nome: rfbData.nome_fantasia || rfbData.razao_social || prev.nome,
      telefone: rfbData.telefone || prev.telefone,
      email: rfbData.email || prev.email,
      situacao_cadastral: rfbData.situacao_cadastral,
      endereco: rfbData.endereco,
      data_abertura: rfbData.data_abertura,
      sincronizado_rfb: true,
      data_ultima_sincronizacao: new Date().toISOString(),
    }))
  }

  const handleBuscarRfb = async () => {
    if (!formData.cnpj) {
      toast.error('Informe o CNPJ para buscar.')
      return
    }
    setIsFetchingRfb(true)
    try {
      const { data, error } = await supabase.functions.invoke('fetch-rfb-data', {
        body: { cnpj: formData.cnpj },
      })
      if (error || !data?.success)
        throw new Error(data?.error || error?.message || 'Erro ao buscar dados')

      const rfbData = data.data

      if (rfbData.situacao_cadastral && rfbData.situacao_cadastral.toUpperCase() !== 'ATIVA') {
        toast.warning(`Atenção: Situação cadastral na RFB é ${rfbData.situacao_cadastral}`)
      }

      if (formData.id) {
        const hasDiff =
          (rfbData.razao_social && rfbData.razao_social !== formData.razao_social) ||
          (rfbData.nome_fantasia && rfbData.nome_fantasia !== formData.nome) ||
          (rfbData.telefone && rfbData.telefone !== formData.telefone) ||
          (rfbData.email && rfbData.email !== formData.email)

        if (hasDiff) {
          setRfbDiffData(rfbData)
          setIsDiffModalOpen(true)
        } else {
          applyRfbData(rfbData)
          toast.success('Dados da RFB estão iguais aos cadastrados.')
        }
      } else {
        applyRfbData(rfbData)
        toast.success('Dados preenchidos com sucesso!')
      }
    } catch (err: any) {
      toast.error(err.message || 'Erro na busca. Verifique se o CNPJ é válido.')
    } finally {
      setIsFetchingRfb(false)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Gestão de Clientes</h1>
        <Button
          onClick={() => {
            setFormData({ ativo: true })
            setOldFormData({})
            setIsModalOpen(true)
          }}
          className="bg-emerald-500 hover:bg-emerald-600"
        >
          <Plus className="w-4 h-4 mr-2" /> Novo Cliente
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center gap-4 py-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Buscar por nome ou CNPJ..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              className="pl-9"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" /> Status
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuCheckboxItem
                checked={filtros.ativo}
                onCheckedChange={(c) => {
                  setFiltros((prev) => ({ ...prev, ativo: c }))
                  setPage(1)
                }}
              >
                Ativo
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filtros.inativo}
                onCheckedChange={(c) => {
                  setFiltros((prev) => ({ ...prev, inativo: c }))
                  setPage(1)
                }}
              >
                Inativo
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome / Razão Social</TableHead>
                <TableHead>CNPJ</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Cadastro</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clientes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center py-8 animate-fade-in-up group">
                      <div className="relative w-24 h-24 mb-4">
                        <div className="absolute inset-0 bg-[#3B82F6]/10 rounded-full" />
                        <Search className="absolute inset-0 m-auto w-10 h-10 text-[#3B82F6] transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110" />
                      </div>
                      <p className="text-slate-600 font-medium">Nenhum cliente encontrado.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                clientes.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell>
                      <div className="font-medium text-slate-800">{c.nome}</div>
                      <div className="text-xs text-slate-500">{c.razao_social}</div>
                    </TableCell>
                    <TableCell>{c.cnpj}</TableCell>
                    <TableCell>
                      <div className="text-sm">{c.email}</div>
                      <div className="text-xs text-slate-500">{c.telefone}</div>
                    </TableCell>
                    <TableCell>
                      {c.data_criacao && format(new Date(c.data_criacao), 'dd/MM/yyyy')}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1 items-start">
                        <Badge
                          variant={c.ativo ? 'default' : 'secondary'}
                          className={
                            c.ativo ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : ''
                          }
                        >
                          {c.ativo ? 'Ativo' : 'Inativo'}
                        </Badge>
                        {c.sincronizado_rfb && (
                          <Badge
                            variant="outline"
                            className="bg-blue-50 text-blue-700 border-blue-200 text-[10px] py-0 h-4"
                          >
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Sinc. RFB
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="group hover:bg-[#3B82F6]/10"
                        onClick={() => {
                          setFormData(c)
                          setOldFormData(c)
                          setIsModalOpen(true)
                        }}
                      >
                        <Edit className="w-4 h-4 text-slate-500 group-hover:text-[#3B82F6] transition-transform group-hover:scale-110 group-hover:rotate-12" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(c.id)}
                        className="group hover:bg-[#EF4444]/10"
                      >
                        <Trash2 className="w-4 h-4 text-[#EF4444] transition-transform group-hover:scale-110 group-hover:rotate-12" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <div className="flex justify-between items-center mt-4">
            <span className="text-sm text-slate-500">Total: {total}</span>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => p + 1)}
                disabled={page * 10 >= total}
              >
                Próximo
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{formData.id ? 'Editar Cliente' : 'Novo Cliente'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>CNPJ / CPF</Label>
              <div className="flex gap-2">
                <Input
                  value={formData.cnpj || ''}
                  onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                  placeholder="Apenas números"
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBuscarRfb}
                  disabled={isFetchingRfb || !formData.cnpj}
                >
                  {isFetchingRfb ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Search className="w-4 h-4 mr-2" />
                  )}
                  Buscar RFB
                </Button>
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Nome / Fantasia</Label>
              <Input
                value={formData.nome || ''}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label>Razão Social</Label>
              <Input
                value={formData.razao_social || ''}
                onChange={(e) => setFormData({ ...formData, razao_social: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label>E-mail</Label>
              <Input
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Telefone</Label>
                <Input
                  value={formData.telefone || ''}
                  onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label>WhatsApp</Label>
                <Input
                  value={formData.whatsapp || ''}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                />
              </div>
            </div>
            {formData.situacao_cadastral && (
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Situação Cadastral</Label>
                  <Input value={formData.situacao_cadastral} disabled className="bg-slate-50" />
                </div>
                <div className="grid gap-2">
                  <Label>Data Abertura</Label>
                  <Input value={formData.data_abertura || ''} disabled className="bg-slate-50" />
                </div>
              </div>
            )}
            {formData.endereco && (
              <div className="grid gap-2">
                <Label>Endereço</Label>
                <Input value={formData.endereco} disabled className="bg-slate-50" />
              </div>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} className="bg-emerald-500 hover:bg-emerald-600">
              Salvar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isDiffModalOpen} onOpenChange={setIsDiffModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Divergência de Dados - RFB</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-slate-500 mb-4">
              Foram encontradas diferenças entre os dados cadastrados e os dados da Receita Federal.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="border rounded-md p-4 bg-slate-50">
                <h4 className="font-semibold mb-2">Dados Atuais</h4>
                <div className="space-y-2 text-sm">
                  <p>
                    <strong>Razão Social:</strong> {formData.razao_social || '-'}
                  </p>
                  <p>
                    <strong>Nome/Fantasia:</strong> {formData.nome || '-'}
                  </p>
                  <p>
                    <strong>Email:</strong> {formData.email || '-'}
                  </p>
                  <p>
                    <strong>Telefone:</strong> {formData.telefone || '-'}
                  </p>
                </div>
              </div>
              <div className="border rounded-md p-4 bg-emerald-50">
                <h4 className="font-semibold mb-2 text-emerald-800">Dados da RFB</h4>
                <div className="space-y-2 text-sm text-emerald-900">
                  <p>
                    <strong>Razão Social:</strong> {rfbDiffData?.razao_social || '-'}
                  </p>
                  <p>
                    <strong>Nome/Fantasia:</strong>{' '}
                    {rfbDiffData?.nome_fantasia || rfbDiffData?.razao_social || '-'}
                  </p>
                  <p>
                    <strong>Email:</strong> {rfbDiffData?.email || '-'}
                  </p>
                  <p>
                    <strong>Telefone:</strong> {rfbDiffData?.telefone || '-'}
                  </p>
                  <p>
                    <strong>Situação:</strong> {rfbDiffData?.situacao_cadastral || '-'}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setFormData((prev) => ({
                  ...prev,
                  situacao_cadastral: rfbDiffData?.situacao_cadastral,
                  data_abertura: rfbDiffData?.data_abertura,
                  endereco: rfbDiffData?.endereco,
                  sincronizado_rfb: true,
                  data_ultima_sincronizacao: new Date().toISOString(),
                }))
                setIsDiffModalOpen(false)
                toast.info('Dados mantidos. Situação cadastral e endereço atualizados.')
              }}
            >
              Manter Atuais
            </Button>
            <Button
              onClick={() => {
                applyRfbData(rfbDiffData)
                setIsDiffModalOpen(false)
                toast.success('Dados atualizados com as informações da RFB.')
              }}
              className="bg-emerald-500 hover:bg-emerald-600"
            >
              Atualizar com RFB
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
