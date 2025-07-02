import { z } from 'zod'
import { email } from 'zod/v4'

export const userSchema = z.object({
  name: z.string(),
  age: z.number(),
  email: z.string().email()
})

export const userDeleteSchema = z.object({
  email: z.string().email()
})