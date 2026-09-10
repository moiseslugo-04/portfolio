import { PageHeader } from '@/components/PageHeader'
import { Input } from '@/components/ui/input'
import { SettingsProfile } from '@/features/profile/Settings'
import { Suspense } from 'react'
export const dynamic = 'force-dynamic'

export default function SettingsPage() {
  return (
    <section className='flex-1 overflow-y-auto'>
      <div className='mx-auto max-w-3xl px-4 py-8 lg:px-8'>
        <PageHeader
          title='Settings'
          description='This information will be displayed on your portfolio.'
        />
        {/* Profile Section */}
        <Suspense fallback={<div>Loading profile...</div>}>
          <SettingsProfile />
        </Suspense>
      </div>
    </section>
  )
}
