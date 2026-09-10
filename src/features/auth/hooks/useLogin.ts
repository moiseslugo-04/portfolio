'use client'

import { useState } from 'react'
import { useForm } from '@features/auth/hooks/useForm'
import { loginSchema, LoginSchema } from '@features/auth/schema/auth'
import { useRouter } from 'next/navigation'
import { API_URL } from '@/app/config/env'
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
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      if (response.status === 401) throw new Error('Unauthorized')
      if (response?.ok) return router.push('/admin')
      throw new Error('Login failed')
    } catch (error) {
      return error instanceof Error
        ? setError('Invalid Credentials')
        : setError('Login failed Please try again')
    } finally {
      setLoading(false)
    }
  })

  return { loading, form, error, handleSubmit }
}
