import { z } from 'zod'

const updateProfileSchema = z.object({
  name: z.string().min(2).max(50),
  bio: z.string().min(2).max(160).optional(),
  job_title: z.string().min(3).max(50).optional(),
})
const socialLinkSchema = z.object({
  name: z
    .string({
      error: 'Selecione uma rede social para continuar',
    })
    .trim()
    .min(1, 'Selecione uma rede Social para continuar'),

  url: z
    .url('Informe uma URL válida')
    .startsWith('https://', 'A URL deve começar com https://'),
})
export { updateProfileSchema, socialLinkSchema }
