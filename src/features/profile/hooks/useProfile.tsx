import { useState } from 'react'
import { useSession } from './useSession'
import { useMutation } from '@tanstack/react-query'
import { API_URL } from '@/app/config/env'
import { SessionResponse } from '@/features/dal/types'
import { toast } from 'sonner'
const endpoint = `${API_URL}/users`
export function useProfile() {
  const [isEditable, setIsEditable] = useState(false)
  const { data: profile } = useSession()
  if (!profile?.isAuth) throw new Error('unauthorized 401')

  const { name, username, email, bio } = profile?.user
  const handleEdit = () => setIsEditable(!isEditable)
  const updateUserProfile = async (formData: FormData) => {
    const response = await fetch(endpoint, {
      method: 'PATCH',
      credentials: 'include',
      body: formData,
    })

    if (!response.ok) throw new Error(`Request failed: ${response.status}`)

    const result = await response.json() // => {bio:data,name:data}

    return result
  }
  const mutation = useMutation({
    mutationFn: updateUserProfile,
    onMutate: (formData: FormData, context) => {
      const data = Object.fromEntries(formData)
      const previousSession = context.client.getQueryData(['session'])
      context.client.setQueryData<SessionResponse>(['session'], (old) => {
        if (!old?.isAuth) return old
        toast.success('data saved')
        return {
          ...old,
          user: {
            ...old.user,
            ...data,
          },
        }
      })
      return { previousSession }
    },
    onSuccess: (result, _err, _onMutation, context) => {
      context.client.setQueryData<SessionResponse>(['session'], (old) => {
        if (!old?.isAuth) return old
        return { ...old, user: { ...old.user, ...result } }
      })
    },
    onError: (_e, _v, result, context) => {
      toast.error('Something was Wrong please Tray again later ')
      if (!result?.previousSession) return
      context.client.setQueryData(['session'], result.previousSession)
    },
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    mutation.mutate(formData)
  }

  return {
    profile: {
      name,
      username,
      email,
      bio,
    },
    isEditable,
    handleEdit,
    handleSubmit,
  }
}
