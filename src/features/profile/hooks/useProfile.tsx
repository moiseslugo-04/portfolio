import { useState, useRef } from 'react'
import { useSession } from './useSession'
import { useMutation } from '@tanstack/react-query'
import { API_URL } from '@/app/config/env'
import { SessionResponse } from '@/features/dal/types'
import { toast } from 'sonner'
import { updateProfileSchema } from '../schemas'
const endpoint = `${API_URL}/users/`
export function useProfile() {
  const formRef = useRef<HTMLFormElement>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isEditable, setIsEditable] = useState(false)
  const { data: profile } = useSession()
  if (!profile?.isAuth) throw new Error('unauthorized 401')

  const { name, username, email, bio, job_title } = profile?.user
  const handleEdit = () => setIsEditable(!isEditable)
  const updateUserProfile = async (formData: FormData) => {
    const parseData = updateProfileSchema.parse(Object.fromEntries(formData))

    const response = await fetch(endpoint, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'PATCH',
      credentials: 'include',
      body: JSON.stringify(parseData),
    })
    if (!response.ok) throw new Error(`Request failed: ${response.status}`)
    const result = await response.json()
    return result
  }
  const mutation = useMutation({
    mutationFn: updateUserProfile,
    onMutate: (formData: FormData, context) => {
      const data = Object.fromEntries(formData)
      const previousSession = context.client.getQueryData(['session'])
      context.client.setQueryData<SessionResponse>(['session'], (old) => {
        if (!old?.isAuth) return old
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
      toast.success('data saved')
      context.client.setQueryData<SessionResponse>(['session'], (old) => {
        if (!old?.isAuth) return old
        return { ...old, user: { ...old.user, ...result } }
      })
      setIsEditable(false)
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.currentTarget
    const fieldSchema =
      updateProfileSchema.shape[name as keyof typeof updateProfileSchema.shape]
    if (fieldSchema) {
      const result = fieldSchema.safeParse(value)
      if (!result.success) setErrors({ [name]: result.error.issues[0].message })
    }
  }
  const onCancel = () => {
    if (formRef.current) {
      formRef.current.reset()
      setIsEditable(false)
    }
  }
  return {
    profile: {
      name,
      username,
      email,
      bio,
      job_title,
    },
    errors,
    formRef,
    isEditable,
    isLoading: mutation.isPending,
    handleChange,
    onCancel,
    handleEdit,
    handleSubmit,
  }
}
