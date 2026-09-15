import { api } from '@/lib/api'
import { SessionResponse } from './types'

export async function getCurrentUser(): Promise<SessionResponse> {
  try {
    const { data: user } = await api.get('/users/me')

    return {
      isAuth: true,
      user,
    }
  } catch {
    return {
      isAuth: false,
      user: null,
    }
  }
}
