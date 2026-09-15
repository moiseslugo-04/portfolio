import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Field, FieldError, FieldGroup } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useCreateSocialLink } from './hooks/useCreateSocialLink'

export function SocialLinkForm() {
  const { handleSubmit, errors, socialLinks } = useCreateSocialLink()
  return (
    <Dialog>
      <DialogTrigger>
        <Button type='button'>Adicionar link</Button>
      </DialogTrigger>
      <DialogContent className='rounded-2xl border-border/60 bg-background p-6 shadow-2xl sm:max-w-sm '>
        <form onSubmit={handleSubmit}>
          <DialogHeader className='space-y-2'>
            <DialogTitle>Adicionar link social</DialogTitle>
            <DialogDescription>
              Adicione uma rede social ao seu perfil.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup className='gap-5'>
            <Field data-invalid={!!errors.name}>
              <Label htmlFor='name'>Rede social</Label>

              <Select name='name'>
                <SelectTrigger
                  id='name'
                  className='h-10'
                  aria-invalid={!!errors.name}
                >
                  <SelectValue placeholder='Selecione uma rede social' />
                </SelectTrigger>

                <SelectContent>
                  {socialLinks.map((social) => (
                    <SelectItem key={social.value} value={social.value}>
                      {social.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {errors.name && (
                <FieldError className='text-red-400'>{errors.name}</FieldError>
              )}
            </Field>

            <Field data-invalid={!!errors.url}>
              <Label htmlFor='url'>URL da rede social</Label>

              <Input
                id='url'
                name='url'
                className='h-10'
                placeholder='https://linkedin.com/in/usuario'
                aria-invalid={!!errors.url}
              />

              {errors.url && (
                <FieldError className='text-red-400'>{errors.url}</FieldError>
              )}
            </Field>
          </FieldGroup>

          <DialogFooter className='gap-2 sm:gap-3 mt-3'>
            <DialogClose>
              <Button type='button' variant='outline'>
                Cancelar
              </Button>

              <Button type='submit'>Salvar link</Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
