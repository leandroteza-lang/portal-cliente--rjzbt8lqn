import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Filter, Eye, CheckCircle, Trash2, Send } from 'lucide-react'
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
import { toast } from 'sonner'
import { format } from 'date-fns'

type Vencimento = {
  id: string
  cliente_id: string
  tipo_guia: string
  data_vencimento: string
  valor: number
  status: string
  clientes?: { nome: string; email: string }
}

export default function AdminVencimentos() {
  const [vencimentos, setVencimentos] = useState<Vencimento[]>([])
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [viewItem, setViewItem] = useState<Vencimento | null>(null)

  const [guias, setGuias] = useState<Record<string, boolean>>({
    DARF: true,
    ICMS: true,
    ISS: true,
    'PIS/COFINS': true,
    IRPJ: true,
    CSLL: true,
  })
  const [status, setStatus] = useState<Record<string, boolean>>({
    Pendente: true,
    Enviado: true,
    Pago: true,
  })

  const loadData = async () => {
    let query = supabase.from('vencimentos').select('*, clientes(nome, email)', { count: 'exact' })

    const selectedGuias = Object.keys(guias).filter((k) => guias[k])
    if (selectedGuias.length > 0) query = query.in('tipo_guia', selectedGuias)

    const selectedStatus = Object.keys(status).filter((k) => status[k])
    if (selectedStatus.length > 0) query = query.in('status', selectedStatus)

    const { data, count } = await query
      .range((page - 1) * 10, page * 10 - 1)
      .order('data_vencimento', { ascending: true })
    setVencimentos((data as any) || [])
    setTotal(count || 0)
  }

  useEffect(() => {
    loadData()
  }, [guias, status, page])

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    await supabase.from('vencimentos').update({ status: newStatus }).eq('id', id)
    toast.success(`Marcado como ${newStatus}`)
    loadData()
  }

  const handleDelete = async (id: string) => {
    if (confirm('Excluir vencimento?')) {
      await supabase.from('vencimentos').delete().eq('id', id)
      toast.success('Excluído')
      loadData()
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Controle de Vencimentos</h1>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center gap-4 py-4 flex-wrap">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" /> Guias
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {Object.keys(guias).map((k) => (
                <DropdownMenuCheckboxItem
                  key={k}
                  checked={guias[k]}
                  onCheckedChange={(c) => {
                    setGuias((p) => ({ ...p, [k]: c }))
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
              {Object.keys(status).map((k) => (
                <DropdownMenuCheckboxItem
                  key={k}
                  checked={status[k]}
                  onCheckedChange={(c) => {
                    setStatus((p) => ({ ...p, [k]: c }))
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
                <TableHead>Tipo de Guia</TableHead>
                <TableHead>Vencimento</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vencimentos.map((v) => (
                <TableRow key={v.id}>
                  <TableCell className="font-medium">{v.clientes?.nome || 'N/A'}</TableCell>
                  <TableCell>{v.tipo_guia}</TableCell>
                  <TableCell>{format(new Date(v.data_vencimento), 'dd/MM/yyyy')}</TableCell>
                  <TableCell>
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                      v.valor,
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        v.status === 'Pago'
                          ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                          : v.status === 'Enviado'
                            ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                            : 'bg-red-100 text-red-700 hover:bg-red-200'
                      }
                    >
                      {v.status || 'Pendente'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button variant="ghost" size="icon" onClick={() => setViewItem(v)}>
                      <Eye className="w-4 h-4 text-slate-500" />
                    </Button>
                    {v.status === 'Pendente' && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleUpdateStatus(v.id, 'Enviado')}
                      >
                        <Send className="w-4 h-4 text-blue-500" />
                      </Button>
                    )}
                    {v.status !== 'Pago' && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleUpdateStatus(v.id, 'Pago')}
                      >
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(v.id)}>
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

      <Dialog open={!!viewItem} onOpenChange={(o) => !o && setViewItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalhes do Vencimento</DialogTitle>
          </DialogHeader>
          {viewItem && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-500">Cliente</p>
                  <p className="font-medium">{viewItem.clientes?.nome}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">E-mail</p>
                  <p className="font-medium">{viewItem.clientes?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Guia</p>
                  <p className="font-medium">{viewItem.tipo_guia}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Vencimento</p>
                  <p className="font-medium">
                    {format(new Date(viewItem.data_vencimento), 'dd/MM/yyyy')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Valor</p>
                  <p className="font-medium">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                      viewItem.valor,
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Status</p>
                  <Badge className="mt-1">{viewItem.status}</Badge>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
