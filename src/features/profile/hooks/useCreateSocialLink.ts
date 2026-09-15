import { useMutation } from '@tanstack/react-query'
import { socialLinkSchema } from '@features/profile/schemas'
import { useState } from 'react'
import { CreateSocialLink } from '@features/profile/types'
import type { MutationFunctionContext } from '@tanstack/react-query'
import { SessionResponse, SocialLink } from '@features/dal/types'
import { toast } from 'sonner'
import { nanoid } from 'nanoid'
import { api } from '@/lib/api'

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
export function useCreateSocialLink() {
  const [errors, setErrors] = useState<Record<string, string | null>>({})

  async function createSocialLink(data: CreateSocialLink) {
    const response = await api.post('/social_links', data)
    return response.data
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
  return {
    handleSubmit,
    errors,
    socialLinks,
  }
}
