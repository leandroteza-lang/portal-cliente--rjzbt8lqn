import { useState, useEffect } from 'react'
import {
  FileText,
  Download,
  Eye,
  Search,
  Filter,
  Trash2,
  Landmark,
  Calculator,
  Scale,
  Users,
  Briefcase,
} from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Pagination, PaginationContent, PaginationItem } from '@/components/ui/pagination'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { fetchDocuments, deleteDocument, type Document } from '@/services/documents'

export default function Documents() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('todas')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [viewingDoc, setViewingDoc] = useState<Document | null>(null)
  const pageSize = 10

  useEffect(() => {
    loadDocuments()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, categoryFilter, searchTerm])

  const loadDocuments = async () => {
    try {
      setLoading(true)
      const { data, count } = await fetchDocuments(page, pageSize, searchTerm, categoryFilter)
      setDocuments(data)
      setTotal(count)
    } catch (error) {
      toast.error('Erro ao carregar documentos')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este documento?')) return
    try {
      await deleteDocument(id)
      toast.success('Documento excluído com sucesso')
      loadDocuments()
    } catch (error) {
      toast.error('Erro ao excluir documento')
    }
  }

  const handleDownload = (doc: Document) => {
    if (!doc.arquivo_url) {
      toast.error('URL do arquivo não disponível')
      return
    }
    const link = document.createElement('a')
    link.href = doc.arquivo_url
    link.download = doc.nome
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const totalPages = Math.ceil(total / pageSize)

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Impostos':
        return <Landmark className="h-4 w-4" />
      case 'Contábeis':
        return <Calculator className="h-4 w-4" />
      case 'Legais':
        return <Scale className="h-4 w-4" />
      case 'Folha de Pagamento':
        return <Users className="h-4 w-4" />
      case 'Operacionais':
        return <Briefcase className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Meus Documentos
          </h1>
          <p className="text-muted-foreground mt-1">
            Gerencie e acesse todos os documentos da sua empresa.
          </p>
        </div>
      </div>

      <Card className="shadow-sm border-slate-200/60 dark:border-slate-800/60 bg-white/50 backdrop-blur-xl dark:bg-slate-900/50">
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar documento por nome..."
                className="pl-9 h-10 bg-white dark:bg-slate-950"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setPage(1)
                }}
              />
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <Filter className="h-4 w-4 text-muted-foreground hidden sm:block" />
              <Select
                value={categoryFilter}
                onValueChange={(v) => {
                  setCategoryFilter(v)
                  setPage(1)
                }}
              >
                <SelectTrigger className="w-full md:w-[220px] h-10 bg-white dark:bg-slate-950">
                  <SelectValue placeholder="Filtrar Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas Categorias</SelectItem>
                  <SelectItem value="Impostos">Impostos</SelectItem>
                  <SelectItem value="Contábeis">Contábeis</SelectItem>
                  <SelectItem value="Legais">Legais</SelectItem>
                  <SelectItem value="Folha de Pagamento">Folha de Pagamento</SelectItem>
                  <SelectItem value="Operacionais">Operacionais</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border border-slate-200/60 dark:border-slate-800/60 overflow-hidden bg-white dark:bg-slate-950 shadow-sm">
            <Table>
              <TableHeader className="bg-slate-50/80 dark:bg-slate-900/80">
                <TableRow className="hover:bg-transparent border-slate-200/60 dark:border-slate-800/60">
                  <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                    Nome do Documento
                  </TableHead>
                  <TableHead className="hidden md:table-cell font-semibold text-slate-700 dark:text-slate-300">
                    Categoria
                  </TableHead>
                  <TableHead className="hidden sm:table-cell font-semibold text-slate-700 dark:text-slate-300">
                    Data de Upload
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                    Status
                  </TableHead>
                  <TableHead className="text-right font-semibold text-slate-700 dark:text-slate-300">
                    Ações
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                      <div className="flex items-center justify-center gap-3">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                        <span>Carregando documentos...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : documents.length > 0 ? (
                  documents.map((doc) => (
                    <TableRow
                      key={doc.id}
                      className="group transition-colors border-slate-100 dark:border-slate-800/60"
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 bg-primary/10 rounded-lg shrink-0 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                            {getCategoryIcon(doc.categoria)}
                          </div>
                          <div>
                            <span className="truncate max-w-[150px] sm:max-w-[300px] block font-semibold text-slate-700 dark:text-slate-200">
                              {doc.nome}
                            </span>
                            <span className="text-xs text-muted-foreground font-normal mt-0.5 block md:hidden">
                              {doc.categoria}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <span className="text-slate-600 dark:text-slate-400 font-medium">
                          {doc.categoria}
                        </span>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-slate-500 dark:text-slate-400">
                        {doc.data_upload
                          ? format(new Date(doc.data_upload), 'dd/MM/yyyy', { locale: ptBR })
                          : '-'}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            doc.status === 'Concluído' || doc.status === 'Aprovado'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/50'
                              : doc.status === 'Processando' || doc.status === 'Pendente'
                                ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/50'
                                : 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/50'
                          }
                        >
                          {doc.status || 'Processando'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Visualizar"
                            className="hover:text-primary hover:bg-primary/10"
                            onClick={() => setViewingDoc(doc)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Baixar"
                            className="hover:text-primary hover:bg-primary/10"
                            onClick={() => handleDownload(doc)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Excluir"
                            onClick={() => handleDelete(doc.id)}
                            className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-40 text-center text-muted-foreground">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-full">
                          <FileText className="h-8 w-8 text-slate-400" />
                        </div>
                        <p>Nenhum documento encontrado.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          {totalPages > 1 && (
            <div className="mt-6 flex justify-end">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="gap-1 h-9"
                    >
                      Anterior
                    </Button>
                  </PaginationItem>
                  <PaginationItem className="hidden sm:inline-flex items-center px-4 text-sm font-medium text-slate-600 dark:text-slate-400">
                    Página {page} de {totalPages}
                  </PaginationItem>
                  <PaginationItem>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="gap-1 h-9"
                    >
                      Próxima
                    </Button>
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!viewingDoc} onOpenChange={(open) => !open && setViewingDoc(null)}>
        <DialogContent className="max-w-4xl h-[85vh] flex flex-col p-0 overflow-hidden">
          <DialogHeader className="px-6 py-4 border-b border-slate-100 dark:border-slate-800">
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              {viewingDoc?.nome}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 bg-slate-100/50 dark:bg-slate-950 relative">
            {viewingDoc?.arquivo_url ? (
              <iframe
                src={viewingDoc.arquivo_url}
                className="absolute inset-0 w-full h-full border-0"
                title={viewingDoc.nome}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground flex-col gap-2">
                <FileText className="h-10 w-10 text-slate-300 dark:text-slate-700" />
                <p>O arquivo não está disponível para visualização.</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
