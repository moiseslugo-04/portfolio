import { getCurrentUser } from '@/features/dal/session'
import { useQuery } from '@tanstack/react-query'

export function useSession() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['session'],
    queryFn: getCurrentUser,
    staleTime: 5 * 60 * 100,
    refetchOnWindowFocus: false,
  })
  return {
    data,
    isLoading,
    error,
  }
}
