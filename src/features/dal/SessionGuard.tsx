'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useSession } from '../profile/hooks/useSession'

export function SessionGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  const { isLoading, error, data } = useSession()

  if (isLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <div className='flex flex-col items-center gap-3'>
          <div className='size-8 animate-spin rounded-full border-4 border-primary/20 border-t-primary' />

          <p className='text-sm text-muted-foreground'>Verificando sesión...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='flex min-h-screen items-center justify-center px-4'>
        <div className='text-center'>
          <h2 className='text-lg font-semibold'>
            No pudimos verificar tu sesión
          </h2>

          <p className='mt-2 text-sm text-muted-foreground'>
            Ocurrió un error al conectar con el servidor.
          </p>

          <Link
            href='/login'
            className='mt-6 inline-flex items-center rounded-xl bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground shadow-sm transition-all hover:bg-accent/90 hover:shadow-md'
          >
            Volver al inicio de sesión
          </Link>
        </div>
      </div>
    )
  }

  if (!data?.isAuth) {
    router.replace('/login')
    return null
  }

  return children
}
