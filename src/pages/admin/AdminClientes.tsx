import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Search, Plus, Edit, Trash2, Filter } from 'lucide-react'
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
}

export default function AdminClientes() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [filtros, setFiltros] = useState({ ativo: true, inativo: true })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState<Partial<Cliente>>({})

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
      await supabase.from('clientes').update(formData).eq('id', formData.id)
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

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Gestão de Clientes</h1>
        <Button
          onClick={() => {
            setFormData({ ativo: true })
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
              {clientes.map((c) => (
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
                    <Badge
                      variant={c.ativo ? 'default' : 'secondary'}
                      className={
                        c.ativo ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : ''
                      }
                    >
                      {c.ativo ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setFormData(c)
                        setIsModalOpen(true)
                      }}
                    >
                      <Edit className="w-4 h-4 text-slate-500" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(c.id)}>
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{formData.id ? 'Editar Cliente' : 'Novo Cliente'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Nome</Label>
              <Input
                value={formData.nome || ''}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label>CNPJ</Label>
              <Input
                value={formData.cnpj || ''}
                onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
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
    </div>
  )
}
