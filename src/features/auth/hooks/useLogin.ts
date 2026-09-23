'use client'

import { useEffect, useState } from 'react'
import { useForm } from '@features/auth/hooks/useForm'
import { loginSchema, LoginSchema } from '@features/auth/schema/auth'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import axios from 'axios'
import { useQueryClient } from '@tanstack/react-query'
import { useSession } from '@/features/profile/hooks/useSession'

export function useLogin() {
  const { data: profile } = useSession()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const queryClient = useQueryClient()

  const form = useForm<LoginSchema>({
    schema: loginSchema,
    defaultValues: {
      identifier: '',
      password: '',
    },
  })
  useEffect(() => {
    if (profile?.isAuth) router.push('/admin')
  }, [profile?.isAuth, router])

  const handleSubmit = form.handleSubmit(async (data) => {
    setLoading(true)
    setError(null)
    try {
      await api.post('/auth/login', data)
      await queryClient.refetchQueries({ queryKey: ['session'] })
      router.push('/admin')
    } catch (error) {
      const message =
        axios.isAxiosError(error) && error.response?.status === 401
          ? 'Invalid Credentials'
          : 'Login failed. Please try again'
      setError(message)
    } finally {
      setLoading(false)
    }
  })

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout')
      await queryClient.setQueryData(['session'], { isAuth: false })
    } catch (e) {
      console.error(e)
    }
  }

  return { loading, form, error, handleSubmit, handleLogout }
}
