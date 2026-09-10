import { Input } from '@ui/input'
import { Label } from '@ui/label'
import { Pencil } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useAvatar } from './hooks/useAvatar'

export function AvatarComponent() {
  const data = useAvatar()

  if (!data) return null

  const {
    onCancel,
    handleChange,
    handleSubmit,
    name,
    isEditable,
    isLoading,
    avatar_alt,
    avatar_url,
  } = data

  return (
    <form className='flex items-center gap-4' onSubmit={handleSubmit}>
      <div className='relative'>
        <Avatar className='h-20 w-20'>
          <AvatarImage src={avatar_url} alt={avatar_alt ?? 'Profile avatar'} />

          <AvatarFallback className='bg-secondary text-lg font-medium'>
            {name?.charAt(0).toLocaleUpperCase()}
          </AvatarFallback>
        </Avatar>

        <Label
          htmlFor='avatar-upload'
          className='absolute bottom-0 right-0 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-border bg-card shadow-sm transition-colors hover:bg-muted'
        >
          <Pencil className='h-3.5 w-3.5 text-muted-foreground' />

          <Input
            id='avatar-upload'
            name='file'
            type='file'
            accept='.jpg,.jpeg,.png,.gif'
            onChange={handleChange}
            disabled={isLoading}
            className='absolute inset-0 cursor-pointer opacity-0'
          />
        </Label>
      </div>

      <div>
        <p className='font-medium text-foreground'>Profile Photo</p>

        <p className='text-sm text-muted-foreground'>
          JPG, PNG, JPEG, or GIF. Max 2MB.
        </p>
      </div>

      {isEditable && (
        <div className='flex items-center gap-2'>
          <Button
            type='button'
            variant='outline'
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>

          <Button type='submit' disabled={isLoading}>
            Save
          </Button>
        </div>
      )}
    </form>
  )
}
