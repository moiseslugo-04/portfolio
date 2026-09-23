import { LogOut } from 'lucide-react'
import { useLogin } from '../hooks/useLogin'

export function LogoutButton({ collapsed = false }: { collapsed?: boolean }) {
  const { handleLogout } = useLogin()
  return (
    <div className='border-t border-border p-3'>
      <button
        onClick={handleLogout}
        type='button'
        className='flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary/50 hover:text-foreground'
      >
        <LogOut className='h-5 w-5 shrink-0' />
        {!collapsed && <span>Log out</span>}
      </button>
    </div>
  )
}
