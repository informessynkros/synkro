// Schema de usuarios

import z from "zod"

export const UsersSchema = z.object({
  users: z.array(
    z.object({
      name: z.string(),
      mfa_secret: z.string(),
      checkpoint: z.string(),
      updated_by: z.string(),
      created_by: z.string(),
      phone_number: z.string(),
      mfa_enabled: z.number(),
      id_user: z.string(),
      cipher: z.string(),
      email_verified: z.string(),
      high_date: z.string(),
      update_date: z.string(),
      be_id: z.string(),
      status: z.number()
    })
  )
})


export type User = z.infer<typeof UsersSchema>['users'][number]