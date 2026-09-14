import { Trash2Icon } from 'lucide-react'
import { Input } from '@ui/input'
import { Button } from '@/components/ui/button'
import { useSession } from './hooks/useSession'
import Image from 'next/image'
import { SocialLinkForm } from './SocialLinksForm'
import { EditSocialForm } from './EditSocialLink'
import { useMutation } from '@tanstack/react-query'
import { API_URL } from '@/app/config/env'
import { SessionResponse } from '../dal/types'
import { toast } from 'sonner'

export function SocialLinks() {
  const { data: profile } = useSession()
  if (!profile?.isAuth) return

  const deleteSocialLinkMutation = useMutation({
    mutationFn: async (linkId: string) => {
      const endpoint = `${API_URL}/social_links/${linkId}`
      const response = await fetch(endpoint, {
        credentials: 'include',
        method: 'DELETE',
      })
      if (!response.ok) throw new Error(`Request failed: ${response.status}`)
      return await response.json()
    },
    onMutate: (linkId, context) => {
      const previousSession = context.client.getQueryData(['session'])

      context.client.setQueryData<SessionResponse>(['session'], (old) => {
        if (!old?.isAuth) return old
        return {
          ...old,
          user: {
            ...old.user,
            social_links: old.user.social_links.filter(
              (link) => link.id !== linkId
            ),
          },
        }
      })
      return { previousSession }
    },
    onSuccess: () => {
      toast.success('link delete with success')
    },
    onError: (_errors, _value, result, context) => {
      toast.error('Something was Wrong please Tray again later ')
      if (!result?.previousSession) return
      context.client.setQueryData(['session'], result.previousSession)
    },
  })
  return (
    <div className='mt-8 flex flex-col gap-3'>
      <h2 className='text-base font-semibold text-foreground'>Social Links</h2>
      <p className='mt-1 text-sm text-muted-foreground'>
        Connect your social profiles to your portfolio.
      </p>

      <form className='flex flex-col gap-2 mt-6 rounded-xl border border-border bg-card p-6'>
        <div className='self-end'>
          <SocialLinkForm />
        </div>
        <div className='space-y-4'>
          {profile.user.social_links?.map((link) => {
            return (
              <div className='flex items-center gap-3' key={link.id}>
                <div className='flex size-10 shrink-0 items-center justify-center rounded-lg border bg-secondary'>
                  <Image
                    src={`/icons/${link.platform_name.toLowerCase()}.svg`}
                    alt={`${link.platform_name} icon`}
                    fill
                    className='relative! size-5 object-contain'
                  />
                </div>

                <Input
                  value={link.platform_url}
                  className='h-10 flex-1'
                  disabled
                  aria-label={`${link.platform_name} URL`}
                />
                <div className='flex gap-3 items-center justify-center'>
                  <Button
                    onClick={() => deleteSocialLinkMutation.mutate(link.id)}
                    type='button'
                    variant='ghost'
                    size='icon'
                    className='size-10 shrink-0 text-red-500 hover:bg-red-500/10 hover:text-red-600 focus-visible:ring-red-500'
                    aria-label={`Remove ${link.platform_name} link`}
                    title={`Remove ${link.platform_name} link`}
                  >
                    <Trash2Icon className='size-4' aria-hidden='true' />
                  </Button>
                  <EditSocialForm link={link} />
                </div>
              </div>
            )
          })}
        </div>
      </form>
    </div>
  )
}
