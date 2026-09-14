'use client'

import { Bell, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { MobileNav } from './MobileNav'
import { useSession } from '@/features/profile/hooks/useSession'
export function TopBar() {
  const { data: profile } = useSession()
  if (!profile?.isAuth) return
  const { name, avatar_alt, avatar_url, job_title } = profile.user
  return (
    <header className='flex h-16 items-center justify-between border-b border-border bg-card px-4 lg:px-6'>
      <div className='flex items-center gap-4'>
        <MobileNav />
        <div className='relative hidden sm:block'>
          <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
          <Input type='search' placeholder='Search...' className='w-64 pl-9' />
        </div>
      </div>

      <div className='flex items-center gap-3'>
        <Button variant='ghost' size='icon' className='relative'>
          <Bell className='h-5 w-5' />
          <span className='absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500' />
          <span className='sr-only'>Notifications</span>
        </Button>
        <div className='h-6 w-px bg-border' />
        <div className='flex items-center gap-3'>
          <Avatar className='h-8 w-8'>
            <AvatarImage src={avatar_url ?? ''} alt={avatar_alt ?? 'User'} />
            <AvatarFallback className='bg-secondary text-xs font-medium'>
              ML
            </AvatarFallback>
          </Avatar>
          <div className='hidden sm:block'>
            <p className='text-sm font-medium text-foreground'>
              {name ?? 'User'}
            </p>
            <p className='text-xs text-muted-foreground'>{job_title}</p>
          </div>
        </div>
      </div>
    </header>
  )
}
