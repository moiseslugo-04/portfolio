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
import { useMutation } from '@tanstack/react-query'
import { socialLinkSchema } from './schemas'
import { useState } from 'react'
import { CreateSocialLink } from './types'
import { API_URL } from '@/app/config/env'
import type { MutationFunctionContext } from '@tanstack/react-query'
import { SessionResponse, SocialLink } from '../dal/types'
import { toast } from 'sonner'
import { nanoid } from 'nanoid'
const socialLinks = [
  {
    name: 'LinkedIn',
    value: 'linkedin',
  },
  {
    name: 'GitHub',
    value: 'github',
  },
  {
    name: 'Instagram',
    value: 'instagram',
  },
]

const endpoint = `${API_URL}/social_links`

export function SocialLinkForm() {
  const [errors, setErrors] = useState<Record<string, string | null>>({})

  async function createSocialLink(data: CreateSocialLink) {
    const response = await fetch(endpoint, {
      credentials: 'include',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    console.log(response)

    if (!response.ok) throw new Error(`Request failed: ${response.status}`)
    const result = await response.json()
    return result
  }
  function optimisticUpdate(
    data: CreateSocialLink,
    context: MutationFunctionContext
  ) {
    const previousSession = context.client.getQueryData(['session'])
    const tempId = `temp_${nanoid()}`
    const newLink = {
      platform_name: data.name,
      platform_url: data.url,
      id: tempId,
    } as SocialLink
    context.client.setQueryData<SessionResponse>(['session'], (old) => {
      if (!old?.isAuth) return old
      return {
        ...old,
        user: {
          ...old.user,
          social_links: [...old.user.social_links, newLink],
        },
      }
    })

    return { previousSession, tempId }
  }

  const mutation = useMutation({
    mutationFn: createSocialLink,
    onMutate: optimisticUpdate,
    onSuccess: (result, _err, onMutation, context) => {
      toast.success('Data saved')

      context.client.setQueryData<SessionResponse>(['session'], (old) => {
        if (!old?.isAuth) return old

        return {
          ...old,
          user: {
            ...old.user,
            social_links: old.user.social_links.map((link) =>
              link.id === onMutation.tempId ? result : link
            ),
          },
        }
      })
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
    const data = Object.fromEntries(formData) as CreateSocialLink
    const result = socialLinkSchema.safeParse(data)
    if (!result.success) {
      console.log(result.error)
      const errors = result.error.issues.reduce<Record<string, string>>(
        (acc, issue) => {
          const fieldName = issue.path[0]

          if (typeof fieldName === 'string') {
            acc[fieldName] = issue.message
          }

          return acc
        },
        {}
      )
      setErrors(errors)
      return
    }

    mutation.mutate(data)
  }
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
