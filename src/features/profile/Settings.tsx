'use client'
import { AvatarComponent } from '@/features/profile/Avatar'
import { ProfileDetails } from '@/features/profile/ProfileDetails'
import { SocialLinks } from './SocialLinks'
import { useSession } from './hooks/useSession'

export function SettingsProfile() {
  const { data } = useSession()
  if (!data?.isAuth) throw new Error('User not found')
  return (
    <section className='mt-8'>
      <div className='mt-6 rounded-xl border border-border bg-card p-6'>
        {/* Avatar */}

        <AvatarComponent />
        {/* Form Fields */}
        <ProfileDetails />
      </div>
      {/* Social Links */}
      <SocialLinks />
    </section>
  )
}
