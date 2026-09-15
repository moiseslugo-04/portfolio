import { useMutation } from '@tanstack/react-query'
import { socialLinkSchema } from '../schemas'
import { useState } from 'react'
import type { MutationFunctionContext } from '@tanstack/react-query'
import { SessionResponse, SocialLink } from '@features/dal/types'
import { toast } from 'sonner'
import { api } from '@/lib/api'
type EditLinkType = { url: string; id: string }

export function useUpdateSocialLink({ link }: { link: SocialLink }) {
  const [error, setError] = useState<string | null>(null)
  const [open, setOpen] = useState(false)

  async function updateSocialLink(data: EditLinkType) {
    const response = await api.patch('', { url: data.url })
    return response.data
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

  return { handleSubmit, error, open, setOpen }
}
