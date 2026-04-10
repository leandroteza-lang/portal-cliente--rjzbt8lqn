import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Search, Plus, Edit, Trash2, Filter, Key } from 'lucide-react'
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
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'
import ClienteFormModal from './components/ClienteFormModal'
import ClienteCredentialsModal from './components/ClienteCredentialsModal'

export default function AdminClientes() {
  const [clientes, setClientes] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [filtros, setFiltros] = useState({ ativo: true, inativo: true })

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingCliente, setEditingCliente] = useState<any>(null)

  const [isCredOpen, setIsCredOpen] = useState(false)
  const [credCliente, setCredCliente] = useState<any>(null)

  const loadClientes = async () => {
    let query = supabase.from('clientes').select('*', { count: 'exact' })

    if (search) {
      query = query.or(`nome.ilike.%${search}%,cnpj.ilike.%${search}%`)
    }
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

  const handleDelete = async (id: string) => {
    if (confirm('Deletar cliente? Isso removerá o acesso dele ao sistema.')) {
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
            setEditingCliente(null)
            setIsFormOpen(true)
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
              placeholder="Buscar por nome ou documento..."
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
                  setFiltros((p) => ({ ...p, ativo: c }))
                  setPage(1)
                }}
              >
                Ativo
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filtros.inativo}
                onCheckedChange={(c) => {
                  setFiltros((p) => ({ ...p, inativo: c }))
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
                <TableHead>Nome / Tipo</TableHead>
                <TableHead>Documento / Contato</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clientes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center text-slate-500">
                    Nenhum cliente encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                clientes.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell>
                      <div className="font-medium text-slate-800 flex items-center gap-2">
                        {c.nome}
                        <Badge variant="outline" className="text-[10px] py-0 bg-slate-50">
                          {c.tipo_cliente || 'PJ'}
                        </Badge>
                      </div>
                      <div className="text-xs text-slate-500">{c.razao_social || c.profissao}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-mono">{c.cnpj}</div>
                      <div className="text-xs text-slate-500">
                        {c.email} • {c.telefone}
                      </div>
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
                    <TableCell className="text-right whitespace-nowrap">
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Credenciais"
                        onClick={() => {
                          setCredCliente(c)
                          setIsCredOpen(true)
                        }}
                      >
                        <Key className="w-4 h-4 text-slate-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditingCliente(c)
                          setIsFormOpen(true)
                        }}
                      >
                        <Edit className="w-4 h-4 text-slate-500" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(c.id)}>
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <ClienteFormModal
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        cliente={editingCliente}
        onSuccess={loadClientes}
      />
      <ClienteCredentialsModal
        open={isCredOpen}
        onOpenChange={setIsCredOpen}
        cliente={credCliente}
      />
    </div>
  )
}
