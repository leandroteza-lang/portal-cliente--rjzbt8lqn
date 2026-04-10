import { useState, useEffect } from 'react'
import { UploadCloud, File as FileIcon, X, CheckCircle2, Clock, FileText } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/hooks/use-auth'
import { supabase } from '@/lib/supabase/client'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB
const ALLOWED_EXTENSIONS = ['.xml', '.pdf', '.zip', '.csv', '.xlsx', '.jpg', '.jpeg', '.png']

function isFileAllowed(file: File) {
  const ext = '.' + file.name.split('.').pop()?.toLowerCase()
  return ALLOWED_EXTENSIONS.includes(ext)
}

const CATEGORIES = [
  { value: 'Impostos', label: 'Impostos' },
  { value: 'Contábeis', label: 'Contábeis' },
  { value: 'Legais', label: 'Legais' },
  { value: 'Folha de Pagamento', label: 'Folha de Pagamento' },
  { value: 'Operacionais', label: 'Operacionais' },
]

export default function Upload() {
  const [files, setFiles] = useState<File[]>([])
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [recentUploads, setRecentUploads] = useState<any[]>([])

  const { toast } = useToast()
  const { user } = useAuth()

  useEffect(() => {
    fetchRecentUploads()
  }, [user])

  const fetchRecentUploads = async () => {
    if (!user) return
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5)

    if (!error && data) {
      setRecentUploads(data)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (e.dataTransfer.files) {
      handleFiles(Array.from(e.dataTransfer.files))
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files))
    }
  }

  const handleFiles = (newFiles: File[]) => {
    const validFiles = newFiles.filter((file) => {
      if (file.size > MAX_FILE_SIZE) {
        toast({
          variant: 'destructive',
          title: 'Arquivo muito grande',
          description: `O arquivo ${file.name} excede o limite de 50MB.`,
        })
        return false
      }
      if (!isFileAllowed(file)) {
        toast({
          variant: 'destructive',
          title: 'Formato inválido',
          description: `O arquivo ${file.name} não é suportado.`,
        })
        return false
      }
      return true
    })

    setFiles((prev) => [...prev, ...validFiles])
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (files.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Nenhum arquivo',
        description: 'Selecione ao menos um arquivo para enviar.',
      })
      return
    }
    if (!category) {
      toast({
        variant: 'destructive',
        title: 'Categoria obrigatória',
        description: 'Selecione a categoria do documento.',
      })
      return
    }
    if (!user) return

    setIsUploading(true)

    try {
      const inserts = files.map((file) => ({
        user_id: user.id,
        name: file.name,
        category: category,
        status: 'Pendente',
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        file_url: null, // Mocking URL real storage integration
      }))

      const { error } = await supabase.from('documents').insert(inserts)

      if (error) throw error

      toast({
        title: 'Documentos enviados com sucesso!',
        description: `${files.length} arquivo(s) foram processados.`,
      })

      setFiles([])
      setCategory('')
      setDescription('')
      fetchRecentUploads()
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro no envio',
        description: 'Ocorreu um erro ao enviar os documentos. Tente novamente.',
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-4 md:p-8 animate-fade-in-up">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Novo Documento</h1>
        <p className="text-muted-foreground">
          Envie arquivos de forma segura para a COSTA Assessoria & Consultoria Contábil.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>Área de Upload</CardTitle>
                <CardDescription>Preencha os dados e anexe os arquivos desejados.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="category">Categoria do Documento *</Label>
                  <Select value={category} onValueChange={setCategory} required>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição / Observações (Opcional)</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Ex: Notas fiscais referentes ao mês de Outubro."
                    className="resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Arquivos *</Label>
                  <div
                    className="group flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg border-slate-200 dark:border-slate-800 bg-slate-50/50 hover:bg-[#3B82F6]/5 hover:border-[#3B82F6]/50 transition-colors cursor-pointer relative"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                  >
                    <input
                      type="file"
                      multiple
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      onChange={handleFileChange}
                      accept=".xml,.pdf,.zip,.csv,.xlsx,.jpg,.jpeg,.png"
                    />
                    <div className="relative w-16 h-16 mb-4 group-hover:-translate-y-2 transition-transform duration-300">
                      <div className="absolute inset-0 bg-[#3B82F6]/10 rounded-full" />
                      <UploadCloud className="absolute inset-0 m-auto h-8 w-8 text-[#3B82F6] group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <p className="text-sm font-medium text-foreground mb-1">
                      Arraste seus arquivos aqui
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ou clique para selecionar do seu computador
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-2">
                      XML, PDF, ZIP, CSV, XLSX, JPG, PNG (Max 50MB por arquivo)
                    </p>
                  </div>
                </div>

                {files.length > 0 && (
                  <div className="space-y-3">
                    <Label>Arquivos Selecionados ({files.length})</Label>
                    <div className="grid gap-2 max-h-48 overflow-y-auto pr-2">
                      {files.map((file, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 border rounded-lg bg-card animate-fade-in"
                        >
                          <div className="flex items-center gap-3 overflow-hidden">
                            <div className="p-2 bg-primary/10 text-primary rounded-lg shrink-0">
                              <FileIcon className="h-5 w-5" />
                            </div>
                            <div className="truncate">
                              <p className="text-sm font-medium truncate">{file.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeFile(idx)}
                            className="shrink-0 text-muted-foreground hover:text-destructive"
                            disabled={isUploading}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-end gap-3 bg-muted/20 py-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setFiles([])
                    setCategory('')
                    setDescription('')
                  }}
                  disabled={files.length === 0 || isUploading}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={files.length === 0 || !category || isUploading}
                  className="gap-2"
                >
                  {isUploading ? (
                    'Enviando...'
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      Concluir Envio
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>

        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Clock className="w-5 h-5 text-primary" />
                Uploads Recentes
              </CardTitle>
              <CardDescription>Seus últimos envios de arquivos.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentUploads.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 bg-muted/10 rounded-lg border border-dashed animate-fade-in-up group">
                  <div className="relative w-16 h-16 mb-4">
                    <div className="absolute inset-0 bg-[#F59E0B]/10 rounded-full" />
                    <UploadCloud className="absolute inset-0 m-auto w-8 h-8 text-[#F59E0B] transition-transform duration-500 group-hover:-translate-y-1 group-hover:scale-110" />
                  </div>
                  <p className="text-sm text-muted-foreground text-center font-medium">
                    Nenhum upload recente.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentUploads.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-muted/50 hover:border-[#3B82F6]/30 transition-all group"
                    >
                      <div className="p-2 bg-[#3B82F6]/10 text-[#3B82F6] rounded-lg shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div className="overflow-hidden w-full">
                        <p className="text-sm font-medium truncate" title={doc.name}>
                          {doc.name}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[11px] font-medium px-1.5 py-0.5 rounded-sm bg-secondary text-secondary-foreground whitespace-nowrap">
                            {doc.category}
                          </span>
                          <span className="text-xs text-muted-foreground truncate">
                            {format(new Date(doc.created_at), "dd 'de' MMM, HH:mm", {
                              locale: ptBR,
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
