import { useState } from 'react'
import { UploadCloud, File, X, CheckCircle2 } from 'lucide-react'
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

export default function Upload() {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const { toast } = useToast()

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return

    setIsUploading(true)

    // Mock upload delay
    setTimeout(() => {
      setIsUploading(false)
      setFile(null)
      toast({
        title: 'Documento enviado com sucesso!',
        description: 'A equipe já foi notificada e processará o arquivo em breve.',
        duration: 5000,
      })
    }, 1500)
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Enviar Documentos</h1>
        <p className="text-muted-foreground">
          Envie arquivos de forma segura para a COSTA Assessoria & Consultoria Contábil.
        </p>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Novo Envio</CardTitle>
            <CardDescription>Preencha os dados e anexe o arquivo desejado.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="category">Categoria do Documento *</Label>
              <Select required>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="contabeis">Contábeis (Extratos, Comprovantes)</SelectItem>
                  <SelectItem value="faturamento">Faturamento (Notas Fiscais)</SelectItem>
                  <SelectItem value="folha">Folha de Pagamento (Atestados, Recibos)</SelectItem>
                  <SelectItem value="legais">Legais (Contratos, Procurações)</SelectItem>
                  <SelectItem value="outros">Outros</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição / Observações</Label>
              <Textarea
                id="description"
                placeholder="Ex: Notas fiscais referentes ao mês de Outubro."
                className="resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label>Arquivo *</Label>
              {!file ? (
                <div
                  className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg border-muted-foreground/25 bg-muted/10 hover:bg-muted/30 transition-colors cursor-pointer relative"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                  />
                  <UploadCloud className="h-10 w-10 text-muted-foreground mb-4" />
                  <p className="text-sm font-medium text-foreground mb-1">
                    Arraste seu arquivo aqui
                  </p>
                  <p className="text-xs text-muted-foreground">
                    ou clique para selecionar do seu computador
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-4">
                    PDF, Word, Excel ou Imagens até 10MB
                  </p>
                </div>
              ) : (
                <div className="flex items-center justify-between p-4 border rounded-lg bg-card">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="p-2 bg-primary/10 text-primary rounded-lg shrink-0">
                      <File className="h-6 w-6" />
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
                    onClick={() => setFile(null)}
                    className="shrink-0 text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-3 bg-muted/20 py-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setFile(null)}
              disabled={!file || isUploading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={!file || isUploading} className="gap-2">
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
  )
}
