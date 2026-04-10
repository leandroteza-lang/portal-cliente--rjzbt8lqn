import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Search, Filter, Eye, Download, CheckCircle, Trash2 } from 'lucide-react'
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
import { toast } from 'sonner'
import { format } from 'date-fns'

type Documento = {
  id: string
  cliente_id: string
  nome: string
  categoria: string
  arquivo_url: string
  status: string
  data_upload: string
  clientes?: { nome: string }
}

export default function AdminDocumentos() {
  const [docs, setDocs] = useState<Documento[]>([])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [viewDoc, setViewDoc] = useState<Documento | null>(null)

  const [cats, setCats] = useState<Record<string, boolean>>({
    Impostos: true,
    Contábeis: true,
    Legais: true,
    'Folha de Pagamento': true,
    Operacionais: true,
  })
  const [status, setStatus] = useState<Record<string, boolean>>({
    Processando: true,
    Concluído: true,
    Erro: true,
  })

  const loadDocs = async () => {
    let query = supabase.from('documentos').select('*, clientes(nome)', { count: 'exact' })
    if (search) query = query.ilike('nome', `%${search}%`)

    const selectedCats = Object.keys(cats).filter((k) => cats[k])
    if (selectedCats.length > 0) query = query.in('categoria', selectedCats)

    const selectedStatus = Object.keys(status).filter((k) => status[k])
    if (selectedStatus.length > 0) query = query.in('status', selectedStatus)

    const { data, count } = await query
      .range((page - 1) * 10, page * 10 - 1)
      .order('data_upload', { ascending: false })
    setDocs((data as any) || [])
    setTotal(count || 0)
  }

  useEffect(() => {
    loadDocs()
  }, [search, cats, status, page])

  const handleProcess = async (id: string) => {
    await supabase.from('documentos').update({ status: 'Concluído' }).eq('id', id)
    toast.success('Documento marcado como concluído')
    loadDocs()
  }

  const handleDelete = async (id: string) => {
    if (confirm('Excluir documento?')) {
      await supabase.from('documentos').delete().eq('id', id)
      toast.success('Documento excluído')
      loadDocs()
    }
  }

  const handleDownload = (url: string, nome: string) => {
    if (!url) return toast.error('URL indisponível')
    const a = document.createElement('a')
    a.href = url
    a.download = nome
    a.target = '_blank'
    a.click()
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Gestão de Documentos</h1>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center gap-4 py-4 flex-wrap">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Buscar documento..."
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
                <Filter className="w-4 h-4 mr-2" /> Categorias
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {Object.keys(cats).map((k) => (
                <DropdownMenuCheckboxItem
                  key={k}
                  checked={cats[k]}
                  onCheckedChange={(c) => {
                    setCats((p) => ({ ...p, [k]: c }))
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
                <TableHead>Documento</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {docs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center py-8 animate-fade-in-up group">
                      <div className="relative w-24 h-24 mb-4">
                        <div className="absolute inset-0 bg-[#3B82F6]/10 rounded-full" />
                        <FileText className="absolute inset-0 m-auto w-10 h-10 text-[#3B82F6] transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110" />
                      </div>
                      <p className="text-slate-600 font-medium">Nenhum documento encontrado.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                docs.map((d) => (
                  <TableRow key={d.id}>
                    <TableCell className="font-medium">{d.nome}</TableCell>
                    <TableCell>{d.clientes?.nome || 'N/A'}</TableCell>
                    <TableCell>{d.categoria}</TableCell>
                    <TableCell>
                      {d.data_upload && format(new Date(d.data_upload), 'dd/MM/yyyy')}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          d.status === 'Concluído'
                            ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                            : d.status === 'Erro'
                              ? 'bg-red-100 text-red-700 hover:bg-red-200'
                              : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                        }
                      >
                        {d.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setViewDoc(d)}
                        className="group hover:bg-[#3B82F6]/10"
                      >
                        <Eye className="w-4 h-4 text-slate-500 group-hover:text-[#3B82F6] transition-transform group-hover:scale-110" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDownload(d.arquivo_url, d.nome)}
                        className="group hover:bg-[#10B981]/10"
                      >
                        <Download className="w-4 h-4 text-slate-500 group-hover:text-[#10B981] transition-transform group-hover:scale-110 group-hover:-translate-y-0.5" />
                      </Button>
                      {d.status !== 'Concluído' && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleProcess(d.id)}
                          className="group hover:bg-[#10B981]/10"
                        >
                          <CheckCircle className="w-4 h-4 text-emerald-500 transition-transform group-hover:scale-110" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(d.id)}
                        className="group hover:bg-[#EF4444]/10"
                      >
                        <Trash2 className="w-4 h-4 text-red-500 transition-transform group-hover:scale-110 group-hover:rotate-12" />
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

      <Dialog open={!!viewDoc} onOpenChange={(o) => !o && setViewDoc(null)}>
        <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>{viewDoc?.nome}</DialogTitle>
          </DialogHeader>
          <div className="flex-1 bg-slate-100 rounded-md overflow-hidden relative">
            {viewDoc?.arquivo_url ? (
              <iframe
                src={viewDoc.arquivo_url}
                className="absolute inset-0 w-full h-full border-0"
                title={viewDoc.nome}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400">
                Sem visualização disponível
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
