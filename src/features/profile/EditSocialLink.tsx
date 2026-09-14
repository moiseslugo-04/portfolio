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
import { useMutation } from '@tanstack/react-query'
import { socialLinkSchema } from './schemas'
import { useState } from 'react'
import { API_URL } from '@/app/config/env'
import type { MutationFunctionContext } from '@tanstack/react-query'
import { SessionResponse, SocialLink } from '../dal/types'
import { toast } from 'sonner'
import { PencilIcon } from 'lucide-react'

type EditLinkType = { url: string; id: string }
export function EditSocialForm({ link }: { link: SocialLink }) {
  const [error, setError] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  async function updateSocialLink(data: EditLinkType) {
    const endpoint = `${API_URL}/social_links/${link.id}`

    const response = await fetch(endpoint, {
      credentials: 'include',
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: data.url }),
    })
    if (!response.ok) throw new Error(`Request failed: ${response.status}`)
    const result = await response.json()
    return result
  }
  function optimisticUpdate(
    data: EditLinkType,
    context: MutationFunctionContext
  ) {
    const previousSession = context.client.getQueryData(['session'])

    context.client.setQueryData<SessionResponse>(['session'], (old) => {
      if (!old?.isAuth) return old
      return {
        ...old,
        user: {
          ...old.user,
          social_links: old.user.social_links.map((link) => {
            if (link.id === data.id) {
              return { ...link, platform_url: data.url }
            }
            return link
          }),
        },
      }
    })
    return { previousSession, id: data.id }
  }

  const mutation = useMutation({
    mutationFn: updateSocialLink,
    onMutate: optimisticUpdate,
    onSuccess: (result, _err, onMutation, context) => {
      toast.success('Data saved')
    },
    onError: (_errors, _value, result, context) => {
      toast.error('Something was Wrong please Tray again later ')
      console.log(_errors, result)
      if (!result?.previousSession) return
      context.client.setQueryData(['session'], result.previousSession)
    },
  })
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    formData.append('id', link.id)
    const data = Object.fromEntries(formData) as EditLinkType
    const urlSchema = socialLinkSchema.pick({ url: true })
    const result = urlSchema.safeParse({ url: data.url })
    if (!result.success) return setError(result.error.issues[0]?.message)
    setError(null)
    setOpen(false)
    mutation.mutate(data)
  }

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
