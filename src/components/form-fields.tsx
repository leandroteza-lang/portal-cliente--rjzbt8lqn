import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function InputField({
  form,
  name,
  label,
  placeholder,
  type = 'text',
  onBlur,
  rightElement,
}: any) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <div className="flex gap-2 relative">
            <FormControl>
              <Input
                {...field}
                value={field.value || ''}
                type={type}
                placeholder={placeholder}
                onBlur={
                  onBlur
                    ? (e) => {
                        field.onBlur()
                        onBlur(e)
                      }
                    : field.onBlur
                }
              />
            </FormControl>
            {rightElement}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export function SelectField({ form, name, label, options }: any) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value || ''}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((opt: any) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
