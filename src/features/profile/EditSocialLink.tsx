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

import { PencilIcon } from 'lucide-react'
import { useUpdateSocialLink } from './hooks/useUpdateSocialLink'
import { SocialLink } from '../dal/types'

export function EditSocialForm({ link }: { link: SocialLink }) {
  const { handleSubmit, setOpen, open, error } = useUpdateSocialLink({ link })
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button
          type='button'
          variant='outline'
          size='icon'
          className='size-10 shrink-0 text-blue-400 hover:bg-blue-500/10 hover:text-blue-600 focus-visible:ring-blue-500'
          aria-label={`Edit link do ${link.platform_name}`}
          title={`Edit link do ${link.platform_name}`}
        >
          <PencilIcon className='size-4' aria-hidden='true' />
        </Button>
      </DialogTrigger>
      <DialogContent className='rounded-2xl border-border/60 bg-background p-6 shadow-2xl sm:max-w-sm '>
        <form onSubmit={handleSubmit}>
          <DialogHeader className='space-y-2'>
            <DialogTitle>Editar Link social</DialogTitle>
            <DialogDescription>
              Actualize o link dda sua rede social.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field data-invalid={!!error}>
              <Label htmlFor='url' className='mt-3'>
                URL da rede social
              </Label>

              <Input
                id='url'
                name='url'
                className='h-10'
                defaultValue={link.platform_url}
                placeholder='https://linkedin.com/in/usuario'
                aria-invalid={!!error}
              />

              {error && (
                <FieldError className='text-red-400'>{error}</FieldError>
              )}
            </Field>
          </FieldGroup>

          <DialogFooter className='flex items-center justify-center gap-5 sm:gap-3 mt-3'>
            <DialogClose>
              <Button type='button' variant='outline'>
                Cancelar
              </Button>
            </DialogClose>
            <Button type='submit'>Salvar alterações</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
