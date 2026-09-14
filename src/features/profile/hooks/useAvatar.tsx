import { useState } from 'react'
import { useSession } from './useSession'
import { useMutation } from '@tanstack/react-query'
import { SessionResponse } from '@/features/dal/types'
import { API_URL } from '@/app/config/env'
import { toast } from 'sonner'
export function useAvatar() {
  const { data: profile } = useSession()

  const [tempUrl, setTempUrl] = useState<null | string>(null)
  const [isEditable, setIsEditable] = useState(false)

  if (!profile?.isAuth) return
  const { avatar_alt, avatar_url, name } = profile.user

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsEditable(true)
    const file = e.currentTarget.files?.[0]
    if (!file) return setIsEditable(false)
    setTempUrl(URL.createObjectURL(file))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    if (!profile?.isAuth) throw new Error('No authenticated user')
    mutation.mutate(formData)
  }
  const mutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const imageAlt = `Profile Avatar of ${name}`
      formData.append('alt', imageAlt)
      const response = await fetch(`${API_URL}/users/me/avatar`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      })

      if (!response.ok) throw new Error(`Request failed: ${response.status}`)
      const { image_url } = await response.json()
      return { image_url, alt: imageAlt }
    },

    onMutate: async (_e, context) => {
      if (!profile?.isAuth) return
      const imageAlt = `Profile Avatar of ${name}`
      const previousSession = context.client.getQueryData<SessionResponse>([
        'session',
      ])
      context.client.setQueryData<SessionResponse>(['session'], (old) => {
        if (!old?.isAuth) return old
        toast.success('Avatar updated')

        return {
          ...old,
          user: {
            ...old.user,
            avatar_alt: imageAlt,
            avatar_url: tempUrl,
          },
        }
      })

      return {
        previousSession,
      }
    },

    onError: (_error, _variables, onMutateResult, context) => {
      toast.error('Something went wrong. Try again.')
      if (!onMutateResult?.previousSession) return
      context.client.setQueryData<SessionResponse>(
        ['session'],
        onMutateResult.previousSession
      )
    },

    onSuccess: (result, _variables, _onMutateResult, context) => {
      setIsEditable(false)
      const image = new Image()

      image.onload = () => {
        context.client.setQueryData<SessionResponse>(['session'], (old) => {
          if (!old?.isAuth) return old

          return {
            ...old,
            user: {
              ...old.user,
              avatar_url: result.image_url,
              avatar_alt: result.alt,
            },
          }
        })

        if (tempUrl) {
          URL.revokeObjectURL(tempUrl)
        }

        setTempUrl(null)
      }

      image.onerror = () => {
        toast.error('Could not load the new avatar')
      }

      image.src = result.image_url
    },
  })
  const onCancel = () => {
    setIsEditable(false)
    if (tempUrl) URL.revokeObjectURL(tempUrl)
    setTempUrl(null)
  }

  return {
    avatar_alt,
    avatar_url: tempUrl ?? avatar_url ?? undefined,
    name,
    isEditable,
    isLoading: mutation.isPending,
    handleSubmit,
    handleChange,
    onCancel,
  }
}
