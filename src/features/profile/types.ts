import { z } from 'zod'
import { socialLinkSchema } from './schemas'

type CreateSocialLink = z.infer<typeof socialLinkSchema>

export type { CreateSocialLink }
