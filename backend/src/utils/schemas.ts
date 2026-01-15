import { z } from 'zod';

// TODO: ADD FURTHER REQUIREMENTS
export const PasswordSchema = z
  .string()
  .min(15) // without MFA, shorter than 15 is considered weak (NIST SP800-63B)
  .max(100); // upper limit prevents extremely long passwords that would take too long to hash (NIST SP800-63B)

export const NewUserSchema = z.object({
  username: z.string().min(1).max(30),
  email: z.email(),
  password: PasswordSchema,
  // upper limit subject to change
  name: z.string().max(100)
});