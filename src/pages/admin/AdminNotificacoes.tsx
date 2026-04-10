import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Filter, Send, Plus } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
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
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { format } from 'date-fns'

type Notificacao = {
  id: string
  cliente_id: string
  tipo: string
  mensagem: string
  data_criacao: string
  status?: string
  clientes?: { nome: string }
}

export default function AdminNotificacoes() {
  const [items, setItems] = useState<Notificacao[]>([])
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [clientes, setClientes] = useState<{ id: string; nome: string }[]>([])

  const [formData, setFormData] = useState({ cliente_id: '', tipo: 'Email', mensagem: '' })

  const [tipos, setTipos] = useState<Record<string, boolean>>({
    Email: true,
    WhatsApp: true,
    'In-app': true,
  })
  const [statusF, setStatusF] = useState<Record<string, boolean>>({
    Enviado: true,
    Falha: true,
  })

  const loadData = async () => {
    let query = supabase.from('notificacoes').select('*, clientes(nome)', { count: 'exact' })

    const selectedTipos = Object.keys(tipos).filter((k) => tipos[k])
    if (selectedTipos.length > 0) query = query.in('tipo', selectedTipos)

    const { data, count } = await query
      .range((page - 1) * 10, page * 10 - 1)
      .order('data_criacao', { ascending: false })

    const processed = ((data as any) || []).map((d: any) => ({
      ...d,
      status: d.status || 'Enviado',
    }))
    const filtered = processed.filter((d: any) => statusF[d.status])

    setItems(filtered)
    setTotal(count || 0)
  }

  const loadClientes = async () => {
    const { data } = await supabase.from('clientes').select('id, nome').eq('ativo', true)
    if (data) setClientes(data as any)
  }

  useEffect(() => {
    loadData()
    loadClientes()
  }, [tipos, statusF, page])

  const handleSend = async () => {
    if (!formData.cliente_id || !formData.mensagem) return toast.error('Preencha os campos')
    await supabase.from('notificacoes').insert({
      cliente_id: formData.cliente_id,
      tipo: formData.tipo,
      mensagem: formData.mensagem,
      status: 'Enviado',
    })
    toast.success('Notificação enviada')
    setIsModalOpen(false)
    setFormData({ cliente_id: '', tipo: 'Email', mensagem: '' })
    loadData()
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Notificações</h1>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-500 hover:bg-emerald-600"
        >
          <Send className="w-4 h-4 mr-2" /> Enviar Notificação
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center gap-4 py-4 flex-wrap">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" /> Tipos
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {Object.keys(tipos).map((k) => (
                <DropdownMenuCheckboxItem
                  key={k}
                  checked={tipos[k]}
                  onCheckedChange={(c) => {
                    setTipos((p) => ({ ...p, [k]: c }))
                    setPage(1)
                  }}
                >
                  {k}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" /> Status
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {Object.keys(statusF).map((k) => (
                <DropdownMenuCheckboxItem
                  key={k}
                  checked={statusF[k]}
                  onCheckedChange={(c) => {
                    setStatusF((p) => ({ ...p, [k]: c }))
                    setPage(1)
                  }}
                >
                  {k}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Mensagem</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center py-8 animate-fade-in-up group">
                      <div className="relative w-24 h-24 mb-4">
                        <div className="absolute inset-0 bg-[#F59E0B]/10 rounded-full" />
                        <Send className="absolute inset-0 m-auto w-10 h-10 text-[#F59E0B] transition-transform duration-500 group-hover:translate-x-2 group-hover:-translate-y-2" />
                      </div>
                      <p className="text-slate-600 font-medium">Nenhuma notificação encontrada.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                items.map((n) => (
                  <TableRow key={n.id}>
                    <TableCell className="font-medium">{n.clientes?.nome || 'N/A'}</TableCell>
                    <TableCell>{n.tipo}</TableCell>
                    <TableCell className="max-w-md truncate">{n.mensagem}</TableCell>
                    <TableCell>
                      {n.data_criacao && format(new Date(n.data_criacao), 'dd/MM/yyyy HH:mm')}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          n.status === 'Enviado'
                            ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                            : 'bg-red-100 text-red-700 hover:bg-red-200'
                        }
                      >
                        {n.status}
                      </Badge>
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enviar Notificação</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Cliente</Label>
              <Select
                value={formData.cliente_id}
                onValueChange={(v) => setFormData({ ...formData, cliente_id: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  {clientes.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Tipo</Label>
              <Select
                value={formData.tipo}
                onValueChange={(v) => setFormData({ ...formData, tipo: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Email">Email</SelectItem>
                  <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                  <SelectItem value="In-app">In-app</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Mensagem</Label>
              <Input
                value={formData.mensagem}
                onChange={(e) => setFormData({ ...formData, mensagem: e.target.value })}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSend} className="bg-emerald-500 hover:bg-emerald-600">
              Enviar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
