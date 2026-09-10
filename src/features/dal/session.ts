import { API_URL } from '@/app/config/env'
import { SessionResponse } from './types'

export async function getCurrentUser(): Promise<SessionResponse> {
  const url = `${API_URL}/users/me`

  const response = await fetch(url, { credentials: 'include' })

  if (!response.ok) return { isAuth: false, user: null }

  const user = await response.json()

  return { isAuth: true, user: user }
}
