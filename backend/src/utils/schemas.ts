import { z } from 'zod';

// TODO: ADD FURTHER REQUIREMENTS
export const PasswordSchema = z
  .string()
  .min(15) // without MFA, shorter than 15 is considered weak (NIST SP800-63B)
  .max(100); // upper limit prevents extremely long passwords that would take too long to hash (NIST SP800-63B)

export const UserSchema = z.object({
  id: z.uuid(),
  username: z.string().min(1).max(30),
  email: z.email(),
  emailVerified: z.boolean(),
  passwordHash: z.string(),
  name: z.string().max(100),
  role: z.enum(['SUPERUSER', 'ADMIN', 'GYM-OWNER', 'GYM-GOER'])
});

export const PutUserSchema = UserSchema.pick({
  username: true,
  email: true,
  emailVerified: true,
  name: true,
  role: true
}).extend({
  password: PasswordSchema.optional()
});

export const NewUserSchema = UserSchema.pick({
  username: true,
  email: true,
  name: true
}).extend({
  password: PasswordSchema
});

export const UserNamesSchema = UserSchema.pick({
  username: true,
  name: true
});

export const NewGymSchema = z.object({
  name: z.string(),
  chain: z.string().optional(),
  street: z.string(),
  streetNumber: z.string(),
  city: z.string(),
  notes: z.string().optional(),
  openingHours: z.json(),
  closingHours: z.json()
});

export const NewEquipmentSchema = z.object({
  name: z.string(),
  category: z.enum(['attachment', 'cardio', 'freeWeight', 'strengthMachine', 'tool']),
  manufacturer: z.string(),
  code: z.string(),
  weightUnit: z.enum(['kg', 'lbs']),
  weight: z.float32().optional(), // TODO: custom validator for this and the three below
  startingWeight: z.float32().optional(),
  availableWeights: z.float32().optional(),
  maximumWeight: z.float32().optional(),
  notes: z.string().optional()
});