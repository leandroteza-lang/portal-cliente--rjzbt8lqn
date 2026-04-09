import { useState } from 'react'
import { FileText, Download, Eye, Search, Filter } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

const mockDocuments = [
  {
    id: 1,
    name: 'Guia de GPS - 10/2023',
    category: 'Impostos',
    date: '15/10/2023',
    status: 'Aprovado',
    size: '124 KB',
  },
  {
    id: 2,
    name: 'Balanço Patrimonial 2022',
    category: 'Contábeis',
    date: '10/10/2023',
    status: 'Pendente',
    size: '1.2 MB',
  },
  {
    id: 3,
    name: 'Alteração Contratual',
    category: 'Legais',
    date: '05/10/2023',
    status: 'Arquivado',
    size: '4.5 MB',
  },
  {
    id: 4,
    name: 'Recibos de Férias',
    category: 'Folha de Pagamento',
    date: '01/10/2023',
    status: 'Aprovado',
    size: '340 KB',
  },
  {
    id: 5,
    name: 'Notas Fiscais Set/23',
    category: 'Operacionais',
    date: '28/09/2023',
    status: 'Aprovado',
    size: '890 KB',
  },
  {
    id: 6,
    name: 'Guia FGTS - 09/2023',
    category: 'Impostos',
    date: '20/09/2023',
    status: 'Arquivado',
    size: '150 KB',
  },
  {
    id: 7,
    name: 'DRE - 3º Trimestre',
    category: 'Contábeis',
    date: '15/09/2023',
    status: 'Aprovado',
    size: '500 KB',
  },
  {
    id: 8,
    name: 'Folha de Ponto - Agosto',
    category: 'Folha de Pagamento',
    date: '05/09/2023',
    status: 'Arquivado',
    size: '2.1 MB',
  },
]

export default function Documents() {
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('todas')

  const filteredDocs = mockDocuments.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === 'todas' || doc.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Meus Documentos</h1>
          <p className="text-muted-foreground">
            Gerencie e acesse todos os documentos da sua empresa.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar documento..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <Filter className="h-4 w-4 text-muted-foreground hidden sm:block" />
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Categoria" />
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
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead className="hidden md:table-cell">Categoria</TableHead>
                  <TableHead className="hidden sm:table-cell">Data</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocs.length > 0 ? (
                  filteredDocs.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                          <span className="truncate max-w-[150px] sm:max-w-none">{doc.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground">
                        {doc.category}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-muted-foreground">
                        {doc.date}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            doc.status === 'Aprovado'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : doc.status === 'Pendente'
                                ? 'bg-amber-50 text-amber-700 border-amber-200'
                                : 'bg-slate-50 text-slate-700 border-slate-200'
                          }
                        >
                          {doc.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1 sm:gap-2">
                          <Sheet>
                            <SheetTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                title="Detalhes"
                                className="hover:text-primary"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </SheetTrigger>
                            <SheetContent>
                              <SheetHeader>
                                <SheetTitle>Detalhes do Documento</SheetTitle>
                                <SheetDescription>
                                  Informações completas sobre o arquivo.
                                </SheetDescription>
                              </SheetHeader>
                              <div className="py-6 space-y-4">
                                <div className="flex items-center justify-center p-8 bg-muted rounded-lg border border-dashed">
                                  <FileText className="h-16 w-16 text-muted-foreground opacity-50" />
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <p className="text-muted-foreground">Nome</p>
                                    <p className="font-medium">{doc.name}</p>
                                  </div>
                                  <div>
                                    <p className="text-muted-foreground">Categoria</p>
                                    <p className="font-medium">{doc.category}</p>
                                  </div>
                                  <div>
                                    <p className="text-muted-foreground">Data de Envio</p>
                                    <p className="font-medium">{doc.date}</p>
                                  </div>
                                  <div>
                                    <p className="text-muted-foreground">Tamanho</p>
                                    <p className="font-medium">{doc.size}</p>
                                  </div>
                                  <div className="col-span-2">
                                    <p className="text-muted-foreground mb-1">Status</p>
                                    <Badge variant="outline">{doc.status}</Badge>
                                  </div>
                                </div>
                                <Button className="w-full mt-4 gap-2">
                                  <Download className="h-4 w-4" />
                                  Baixar Documento
                                </Button>
                              </div>
                            </SheetContent>
                          </Sheet>
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Baixar"
                            className="hover:text-primary"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                      Nenhum documento encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
