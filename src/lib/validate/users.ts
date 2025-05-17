import { z } from 'zod';

export const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  username: z.string().max(15, 'Username must be 15 characters or fewer'),
  email: z.string().email(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const CreateUserSchema = UserSchema.omit({ id: true });

export const UpdateUserSchema = UserSchema.omit({ id: true });

export const IdSchema = z.number();
export type User = z.infer<typeof UserSchema>;
