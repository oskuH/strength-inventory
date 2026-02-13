import { z } from 'zod';


const TimeSchema = z.array(z.number().min(0).max(24)).length(2).nullish();

export const HoursSchema = z.object({
  MO: TimeSchema,
  TU: TimeSchema,
  WE: TimeSchema,
  TH: TimeSchema,
  FR: TimeSchema,
  SA: TimeSchema,
  SU: TimeSchema
});  // Used in gym and membership


// user

// TODO: ADD FURTHER REQUIREMENTS
export const PasswordSchema = z
  .string()
  .min(15)  // without MFA, shorter than 15 is considered weak (NIST SP800-63B)
  .max(100);  // upper limit prevents extremely long passwords that would take too long to hash (NIST SP800-63B)

export const UserRoleEnum = z.enum(['SUPERUSER', 'ADMIN', 'MANAGER', 'GYM-GOER']);

export const UserSchema = z.object({
  id: z.uuidv4(),
  username: z.string().min(1).max(30),
  email: z.email(),
  emailVerified: z.boolean(),
  passwordHash: z.string(),
  name: z.string().max(100),
  role: UserRoleEnum,
  createdAt: z.date(),
  updatedAt: z.date()
});

export const UserPostSchema = UserSchema.pick({
  username: true,
  email: true,
  name: true
}).extend({
  password: PasswordSchema
});

export const UserPutSchema = UserSchema.pick({
  username: true,
  email: true,
  emailVerified: true,
  name: true,
  role: true
}).extend({
  password: PasswordSchema.nullish()
});

export const UserTokenPayloadSchema = UserSchema.pick({
  id: true,
  username: true
});

export const UserNamesSchema = UserSchema.pick({
  username: true,
  name: true
});


// gym

export const GymSchema = z.object({
  id: z.uuidv4(),
  name: z.string(),
  chain: z.string().nullish(),
  street: z.string(),
  streetNumber: z.string(),
  city: z.string(),
  notes: z.string().nullish(),
  openingHours: HoursSchema,
  createdAt: z.date(),
  updatedAt: z.date()
});

export const GymPostSchema = GymSchema.pick({
  name: true,
  chain: true,
  street: true,
  streetNumber: true,
  city: true,
  notes: true,
  openingHours: true
});

export const GymPatchSchema = GymSchema.pick({
  name: true,
  chain: true,
  street: true,
  streetNumber: true,
  city: true,
  notes: true
});


// equipment

export const EquipmentCategoryEnum = z.enum(['attachment', 'cardio', 'freeWeight', 'strengthMachine', 'tool']);
export const EquipmentWeightUnitEnum = z.enum(['kg', 'lbs']).nullish();

export const EquipmentSchema = z.object({
  id: z.uuidv4(),
  name: z.string(),
  category: EquipmentCategoryEnum,
  manufacturer: z.string(),
  code: z.string(),
  weightUnit: EquipmentWeightUnitEnum,
  weight: z.float32().nullish(),  // TODO: custom validator for this and the three below
  startingWeight: z.float32().nullish(),
  availableWeights: z.array(z.float32()).nullish(),
  maximumWeight: z.float32().nullish(),
  notes: z.string().nullish(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export const EquipmentPostAndPutSchema = EquipmentSchema.pick({
  name: true,
  category: true,
  manufacturer: true,
  code: true,
  weightUnit: true,
  weight: true,
  startingWeight: true,
  availableWeights: true,
  maximumWeight: true,
  notes: true
});

// membership

export const MembershipTimeUnitEnum = z.enum(['year', 'month', 'week', 'day', 'hour']);

export const MembershipAvailabilityEntrySchema = z.tuple([z.string(), HoursSchema]);
export const MembershipAvailabilitySchema = z.array(MembershipAvailabilityEntrySchema);


// login

export const LoginRequestSchema = z.object({
  username: z.string(),
  password: z.string()
});
export const LoginResponseSchema = z.object({
  token: z.string(),
  username: z.string()
});