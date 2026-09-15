'use client'

import { useState } from 'react'
import { useForm } from '@features/auth/hooks/useForm'
import { loginSchema, LoginSchema } from '@features/auth/schema/auth'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import axios from 'axios'
export function useLogin() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const form = useForm<LoginSchema>({
    schema: loginSchema,
    defaultValues: {
      identifier: '',
      password: '',
    },
  })
  const handleSubmit = form.handleSubmit(async (data) => {
    setLoading(true)
    setError(null)

    try {
      await api.post('/auth/login', data)
<<<<<<< HEAD

=======
>>>>>>> 28ad57f (refactor: refactor social links CRUD and add Axios to profile settings)
      router.push('/admin')
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        setError('Invalid Credentials')
      } else {
        setError('Login failed. Please try again')
      }
    } finally {
      setLoading(false)
    }
  })

  return { loading, form, error, handleSubmit }
}
