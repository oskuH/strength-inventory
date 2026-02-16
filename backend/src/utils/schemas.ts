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
});
export type Hours = z.infer<typeof HoursSchema>;  // Used in gym and membership


// user

// TODO: ADD FURTHER REQUIREMENTS
export const PasswordSchema = z
  .string()
  .min(15)  // without MFA, shorter than 15 is considered weak (NIST SP800-63B)
  .max(100);  // upper limit prevents extremely long passwords that would take too long to hash (NIST SP800-63B)

export const UserRoleEnum = z.enum(['SUPERUSER', 'ADMIN', 'MANAGER', 'GYM-GOER']);
export type UserRole = z.infer<typeof UserRoleEnum>;

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
export type User = z.infer<typeof UserSchema>;

export const UserPostSchema = UserSchema.pick({
  username: true,
  email: true,
  name: true
}).extend({
  password: PasswordSchema
});
export type UserPost = z.infer<typeof UserPostSchema>;

export const UserPutSchema = UserSchema.pick({
  username: true,
  email: true,
  emailVerified: true,
  name: true,
  role: true
}).extend({
  password: PasswordSchema.nullish()
});
export type UserPut = z.infer<typeof UserPutSchema>;

export const UserTokenPayloadSchema = UserSchema.pick({
  id: true,
  username: true
});
export type UserTokenPayload = z.infer<typeof UserTokenPayloadSchema>;

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
  openingHours: HoursSchema,
  url: z.url().nullish(),
  notes: z.string().nullish(),
  createdAt: z.date(),
  updatedAt: z.date()
});
export type Gym = z.infer<typeof GymSchema>;

export const GymPostSchema = GymSchema.pick({
  name: true,
  chain: true,
  street: true,
  streetNumber: true,
  city: true,
  openingHours: true,
  url: true,
  notes: true
});
export type GymPost = z.infer<typeof GymPostSchema>;

export const GymPatchSchema = GymSchema.pick({
  name: true,
  chain: true,
  street: true,
  streetNumber: true,
  city: true,
  url: true,
  notes: true
});
export type GymPatch = z.infer<typeof GymPatchSchema>;


// equipment

export const EquipmentCategoryEnum = z.enum(['attachment', 'cardio', 'freeWeight', 'strengthMachine', 'tool']);
export type EquipmentCategory = z.infer<typeof EquipmentCategoryEnum>;

export const EquipmentWeightUnitEnum = z.enum(['kg', 'lbs']).nullish();
export type EquipmentWeightUnit = z.infer<typeof EquipmentWeightUnitEnum>;

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
  url: z.url().nullish(),
  notes: z.string().nullish(),
  createdAt: z.date(),
  updatedAt: z.date()
});
export type Equipment = z.infer<typeof EquipmentSchema>;

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
  url: true,
  notes: true
}); export type EquipmentPostAndPut = z.infer<typeof EquipmentPostAndPutSchema>;


// membership

export const MembershipTimeUnitEnum = z.enum(['year', 'month', 'week', 'day', 'hour']);
export type MembershipTimeUnit = z.infer<typeof MembershipTimeUnitEnum>;

export const MembershipAvailabilityEntrySchema = z.tuple([z.string(), HoursSchema]);
export const MembershipAvailabilitySchema = z.array(MembershipAvailabilityEntrySchema);
export type MembershipAvailability = z.infer<typeof MembershipAvailabilitySchema>;

export const MembershipSchema = z.object({
  id: z.uuidv4(),
  chain: z.string().nullish(),
  name: z.string(),
  price: z.float32(),
  priceCurrency: z.string(),
  validity: z.int(),
  validityUnit: MembershipTimeUnitEnum,
  commitment: z.int().nullish(),
  commitmentUnit: MembershipTimeUnitEnum.nullish(),  // TODO: custom validator
  availability: MembershipAvailabilitySchema,
  url: z.url().nullish(),
  notes: z.string().nullish(),
  createdAt: z.date(),
  updatedAt: z.date()
});
export type Membership = z.infer<typeof MembershipSchema>;

export const MembershipPostAndPutSchema = MembershipSchema.pick({
  chain: true,
  name: true,
  price: true,
  priceCurrency: true,
  validity: true,
  validityUnit: true,
  commitment: true,
  commitmentUnit: true,
  availability: true,
  url: true,
  notes: true
});
export type MembershipPostAndPut = z.infer<typeof MembershipPostAndPutSchema>;


// login

export const LoginRequestSchema = z.object({
  username: z.string(),
  password: z.string()
});
export type LoginRequest = z.infer<typeof LoginRequestSchema>;

export const LoginResponseSchema = z.object({
  token: z.string(),
  username: z.string()
});
export type LoginResponse = z.infer<typeof LoginResponseSchema>;


// gymequipment

export const GymEquipmentSchema = z.object({
  id: z.uuidv4(),
  gymId: z.uuidv4(),
  equipmentId: z.uuidv4(),
  createdAt: z.date(),
  updatedAt: z.date()
});
export type GymEquipment = z.infer<typeof GymEquipmentSchema>;

export const GymEquipmentPostSchema = GymEquipmentSchema.pick({
  equipmentId: true
});
export type GymEquipmentPost = z.infer<typeof GymEquipmentPostSchema>;


// gymmanagers

export const GymManagerSchema = z.object({
  id: z.uuidv4(),
  userId: z.uuidv4(),
  gymId: z.uuidv4(),
  createdAt: z.date(),
  updatedAt: z.date()
});
export type GymManager = z.infer<typeof GymManagerSchema>;

export const GymManagerPostSchema = GymManagerSchema.pick({
  userId: true,
  gymId: true
});
export type GymManagerPost = z.infer<typeof GymManagerPostSchema>;


// gymmemberships

export const GymMembershipSchema = z.object({
  id: z.uuidv4(),
  gymId: z.uuidv4(),
  membershipId: z.uuidv4(),
  createdAt: z.date(),
  updatedAt: z.date()
});
export type GymMembership = z.infer<typeof GymMembershipSchema>;

export const GymMembershipPostSchema = GymMembershipSchema.pick({
  membershipId: true
});
export type GymMembershipPost = z.infer<typeof GymMembershipPostSchema>;