import { useEffect, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Search, Loader2 } from 'lucide-react'
import { InputField, SelectField } from '@/components/form-fields'
import { useViaCep } from '@/hooks/use-viacep'
import { useRfb } from '@/hooks/use-rfb'

export function ClienteTabs({ form }: { form: any }) {
  const tipoCliente = form.watch('tipo_cliente')
  const [activeTab, setActiveTab] = useState('principal')
  const { isFetchingCep, handleCepBlur } = useViaCep(form)
  const { isFetchingRfb, handleBuscarRfb } = useRfb(form)

  useEffect(() => {
    setActiveTab('principal')
  }, [tipoCliente])

  const BtnRfb = (
    <Button
      type="button"
      variant="outline"
      onClick={handleBuscarRfb}
      disabled={isFetchingRfb || !form.watch('cnpj')}
    >
      {isFetchingRfb ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Search className="w-4 h-4" />
      )}
    </Button>
  )

  const CepLoader = isFetchingCep ? (
    <Loader2 className="w-4 h-4 absolute right-3 top-3 animate-spin text-slate-400" />
  ) : null

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="tipo_cliente"
        render={({ field }) => (
          <FormItem className="space-y-3 mb-6 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-100">
            <FormLabel className="text-base font-semibold text-slate-800">
              Tipo de Cadastro
            </FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex space-x-6"
              >
                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="PJ" />
                  </FormControl>
                  <FormLabel className="font-medium cursor-pointer">Pessoa Jurídica</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="PF" />
                  </FormControl>
                  <FormLabel className="font-medium cursor-pointer">Pessoa Física</FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
          </FormItem>
        )}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 md:grid-cols-5 h-auto py-1">
          <TabsTrigger value="principal" className="py-2 text-xs md:text-sm">
            {tipoCliente === 'PJ' ? 'Empresariais' : 'Pessoais'}
          </TabsTrigger>
          <TabsTrigger value="contato" className="py-2 text-xs md:text-sm">
            Contato
          </TabsTrigger>
          {tipoCliente === 'PJ' && (
            <TabsTrigger value="responsavel" className="py-2 text-xs md:text-sm">
              Responsável
            </TabsTrigger>
          )}
          <TabsTrigger value="bancarios" className="py-2 text-xs md:text-sm">
            Bancários
          </TabsTrigger>
          <TabsTrigger value="observacoes" className="py-2 text-xs md:text-sm">
            Obs/Status
          </TabsTrigger>
        </TabsList>

        <TabsContent value="principal" className="space-y-4 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              form={form}
              name="cnpj"
              label={tipoCliente === 'PJ' ? 'CNPJ *' : 'CPF *'}
              rightElement={BtnRfb}
            />
            <InputField
              form={form}
              name="nome"
              label={tipoCliente === 'PJ' ? 'Nome Fantasia *' : 'Nome Completo *'}
            />
            {tipoCliente === 'PJ' && (
              <InputField form={form} name="razao_social" label="Razão Social" />
            )}
            <InputField
              form={form}
              name="data_abertura"
              label={tipoCliente === 'PJ' ? 'Data de Constituição' : 'Data de Nascimento'}
            />

            {tipoCliente === 'PJ' ? (
              <>
                <SelectField
                  form={form}
                  name="regime_tributario"
                  label="Regime Tributário"
                  options={[
                    { value: 'simples', label: 'Simples Nacional' },
                    { value: 'presumido', label: 'Lucro Presumido' },
                    { value: 'real', label: 'Lucro Real' },
                  ]}
                />
                <InputField form={form} name="inscricao_estadual" label="Inscrição Estadual (IE)" />
                <InputField
                  form={form}
                  name="inscricao_municipal"
                  label="Inscrição Municipal (IM)"
                />
                <InputField form={form} name="cnae" label="CNAE Principal" />
                <InputField form={form} name="enquadramento" label="Enquadramento (MEI, etc)" />
              </>
            ) : (
              <>
                <InputField form={form} name="nacionalidade" label="Nacionalidade" />
                <InputField form={form} name="estado_civil" label="Estado Civil" />
                <InputField form={form} name="profissao" label="Profissão" />
              </>
            )}
          </div>
        </TabsContent>

        <TabsContent value="contato" className="space-y-4 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField form={form} name="email" label="E-mail Principal *" />
            <InputField form={form} name="email_secundario" label="E-mail Secundário" />
            <InputField form={form} name="telefone" label="Telefone Fixo" />
            <InputField form={form} name="whatsapp" label="WhatsApp" />
          </div>
          <div className="border-t pt-4">
            <h3 className="text-sm font-medium mb-4 text-slate-800">Endereço</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InputField
                form={form}
                name="cep"
                label="CEP"
                onBlur={handleCepBlur}
                rightElement={CepLoader}
              />
              <div className="md:col-span-2">
                <InputField form={form} name="logradouro" label="Rua / Logradouro" />
              </div>
              <InputField form={form} name="numero" label="Número" />
              <InputField form={form} name="complemento" label="Complemento" />
              <InputField form={form} name="bairro" label="Bairro" />
              <InputField form={form} name="cidade" label="Cidade" />
              <InputField form={form} name="estado" label="Estado (UF)" />
            </div>
          </div>
        </TabsContent>

        {tipoCliente === 'PJ' && (
          <TabsContent value="responsavel" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField form={form} name="responsavel_nome" label="Nome do Responsável / Sócio" />
              <InputField form={form} name="responsavel_cpf" label="CPF do Responsável" />
              <InputField form={form} name="responsavel_telefone" label="Telefone do Responsável" />
            </div>
          </TabsContent>
        )}

        <TabsContent value="bancarios" className="space-y-4 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField form={form} name="banco" label="Banco" />
            <InputField form={form} name="agencia" label="Agência" />
            <InputField form={form} name="conta" label="Conta" />
            <SelectField
              form={form}
              name="tipo_conta"
              label="Tipo de Conta"
              options={[
                { value: 'corrente', label: 'Conta Corrente' },
                { value: 'poupanca', label: 'Conta Poupança' },
                { value: 'pagamento', label: 'Conta de Pagamento' },
              ]}
            />
            <div className="md:col-span-2">
              <InputField form={form} name="titular_conta" label="Titular da Conta" />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="observacoes" className="space-y-4 pt-4">
          <FormField
            control={form.control}
            name="ativo"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Status do Cliente</FormLabel>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="observacoes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Observações</FormLabel>
                <FormControl>
                  <Textarea {...field} value={field.value || ''} className="min-h-[100px]" />
                </FormControl>
              </FormItem>
            )}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
