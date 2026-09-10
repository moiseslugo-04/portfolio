import { Github, Linkedin, Twitter } from 'lucide-react'
import { Input } from '@ui/input'
export function SocialLinks() {
  return (
    <div className='mt-8'>
      <h2 className='text-base font-semibold text-foreground'>Social Links</h2>
      <p className='mt-1 text-sm text-muted-foreground'>
        Connect your social profiles to your portfolio.
      </p>

      <div className='mt-6 rounded-xl border border-border bg-card p-6'>
        <div className='space-y-4'>
          <div className='flex items-center gap-3'>
            <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-secondary'>
              <Github className='h-5 w-5 text-foreground' />
            </div>
            <Input
              placeholder='github.com/username'
              defaultValue='github.com/johndoe'
              className='flex-1'
            />
          </div>
          <div className='flex items-center gap-3'>
            <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-secondary'>
              <Linkedin className='h-5 w-5 text-foreground' />
            </div>
            <Input
              placeholder='linkedin.com/in/username'
              defaultValue='linkedin.com/in/johndoe'
              className='flex-1'
            />
          </div>
          <div className='flex items-center gap-3'>
            <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-secondary'>
              <Twitter className='h-5 w-5 text-foreground' />
            </div>
            <Input placeholder='twitter.com/username' className='flex-1' />
          </div>
        </div>
      </div>
    </div>
  )
}
