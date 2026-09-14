import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useProfile } from './hooks/useProfile'

export function ProfileDetails() {
  const {
    profile,
    isEditable,
    isLoading,
    errors,
    formRef,
    handleEdit,
    onCancel,
    handleSubmit,
    handleChange,
  } = useProfile()

  const { name, username, email, bio, job_title } = profile

  return (
    <form onSubmit={handleSubmit} className='mt-6 space-y-6' ref={formRef}>
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
          {/* Username */}
          <div className='space-y-2'>
            <Label htmlFor='username'>Username</Label>

            <Input
              id='username'
              name='username'
              defaultValue={username}
              disabled={!isEditable}
              aria-invalid={!!errors?.username}
              className={
                errors?.username
                  ? 'border-destructive/50 focus-visible:ring-destructive/30'
                  : ''
              }
            />

            {errors?.username && (
              <p className='text-xs text-destructive/80'>{errors.username}</p>
            )}
          </div>

          {/* Email */}
          <div className='space-y-2'>
            <Label htmlFor='email'>Email</Label>

            <Input
              id='email'
              type='email'
              name='email'
              defaultValue={email}
              disabled={!isEditable}
              aria-invalid={!!errors?.email}
              className={
                errors?.email
                  ? 'border-destructive/50 focus-visible:ring-destructive/30'
                  : ''
              }
            />

            {errors?.email && (
              <p className='text-xs text-destructive/80'>{errors.email}</p>
            )}
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
          {/* Name */}
          <div className='space-y-2'>
            <Label htmlFor='name'>Name</Label>

            <Input
              id='name'
              name='name'
              onChange={handleChange}
              defaultValue={name}
              disabled={!isEditable}
              aria-invalid={!!errors?.name}
              className={
                errors?.name
                  ? 'border-destructive/50 focus-visible:ring-destructive/30'
                  : ''
              }
            />

            {errors?.name && (
              <p className='text-xs text-destructive/80'>{errors.name}</p>
            )}
          </div>

          {/* Job title */}
          <div className='space-y-2'>
            <Label htmlFor='job_title'>Área de atuação</Label>

            <Input
              id='job_title'
              name='job_title'
              onChange={handleChange}
              defaultValue={job_title}
              disabled={!isEditable}
              aria-invalid={!!errors?.job_title}
              className={
                errors?.job_title
                  ? 'border-destructive/50 focus-visible:ring-destructive/30'
                  : ''
              }
            />

            {errors?.job_title && (
              <p className='text-xs text-destructive/80'>{errors.job_title}</p>
            )}
          </div>

          {/* Bio */}
          <div className='space-y-2'>
            <Label htmlFor='bio'>Bio</Label>

            <textarea
              id='bio'
              name='bio'
              onChange={handleChange}
              rows={3}
              disabled={!isEditable}
              placeholder='Tell visitors a little about yourself...'
              defaultValue={String(bio ?? '')}
              aria-invalid={!!errors?.bio}
              className={`flex w-full resize-none rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                errors?.bio
                  ? 'border-destructive/50 focus-visible:ring-destructive/30'
                  : 'border-input'
              }`}
            />

            {errors?.bio && (
              <p className='text-xs text-destructive/80'>{errors.bio}</p>
            )}
          </div>
        </div>
      </section>

      {/* Actions */}
      <div className='flex justify-end gap-2 border-t pt-4'>
        {isEditable ? (
          <>
            <Button
              type='button'
              variant='outline'
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>

            <Button type='submit' disabled={isLoading}>
              Save changes
            </Button>
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
