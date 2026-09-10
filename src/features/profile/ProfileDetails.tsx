import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useProfile } from './hooks/useProfile'

export function ProfileDetails() {
  const { profile, isEditable, handleEdit, handleSubmit } = useProfile()

  const { name, username, email, bio } = profile

  return (
    <form onSubmit={handleSubmit} className='mt-6 space-y-6'>
      {/* Account information */}
      <section className='space-y-4'>
        <div>
          <h3 className='text-sm font-medium'>Account information</h3>
          <p className='text-sm text-muted-foreground'>
            Seu nome de usuário e e-mail exigem validação antes de serem
            alterados.
          </p>
        </div>

        <div className='grid gap-4 sm:grid-cols-2'>
          <div className='space-y-2'>
            <Label htmlFor='username'>Username</Label>
            <Input
              id='username'
              defaultValue={username}
              disabled={!isEditable}
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='email'>Email</Label>
            <Input
              id='email'
              type='email'
              defaultValue={email}
              disabled={!isEditable}
            />
          </div>
        </div>
      </section>

      {/* Profile information */}
      <section className='space-y-4'>
        <div>
          <h3 className='text-sm font-medium'>Informações do perfil</h3>
          <p className='text-sm text-muted-foreground'>
            Atualize as informações exibidas no seu perfil.
          </p>
        </div>

        <div className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='name'>Name</Label>
            <Input id='name' defaultValue={name} disabled={!isEditable} />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='name'>Área de atuação</Label>
            <Input
              id='name'
              defaultValue={'Frontend Developer'}
              disabled={!isEditable}
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='bio'>Bio</Label>
            <textarea
              id='bio'
              rows={3}
              disabled={!isEditable}
              placeholder='Tell visitors a little about yourself...'
              defaultValue={String(bio ?? '')}
              className='flex w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
            />
          </div>
        </div>
      </section>

      {/* Actions */}
      <div className='flex justify-end gap-2 border-t pt-4'>
        {isEditable ? (
          <>
            <Button type='button' variant='outline' onClick={handleEdit}>
              Cancel
            </Button>

            <Button type='submit'>Save changes</Button>
          </>
        ) : (
          <Button type='button' onClick={handleEdit}>
            Editar perfil
          </Button>
        )}
      </div>
    </form>
  )
}
