import { z } from 'zod';

/* NOTE ABOUT STRINGS
z.string().min(1) = required string
z.string() = optional string i.e. empty strings accepted */


// utility schemas for opening hours

const TimeSchema = z.array(z.number().min(0).max(24).optional()).length(2);
const ExceptionTimeSchema = z.array(z.number().min(0).max(24).nullish()).length(2);

export const HoursSchema = z.object({
  MO: TimeSchema.optional(),
  TU: TimeSchema.optional(),
  WE: TimeSchema.optional(),
  TH: TimeSchema.optional(),
  FR: TimeSchema.optional(),
  SA: TimeSchema.optional(),
  SU: TimeSchema.optional()
});
export type Hours = z.infer<typeof HoursSchema>;  // Used in gym and membership


// membership

export const MembershipTimeUnitEnum = z.enum(['year', 'month', 'week', 'day', 'hour']);
export type MembershipTimeUnit = z.infer<typeof MembershipTimeUnitEnum>;

export const MembershipAvailabilitySchema = z.object({
  Desk: z.boolean(),
  Web: z.boolean(),
  App: z.boolean(),
  Other: z.boolean()
})
export type MembershipAvailability = z.infer<typeof MembershipAvailabilitySchema>;

const MembershipBaseSchema = z.object({
  id: z.uuidv4(),
  name: z.string().min(1),
  initiationFee: z.preprocess((val) => {
    return(Number(val))
  }, z.number().nullish()),
  membershipFee: z.preprocess((val) => {
    return(Number(val))
  }, z.number()),
  feeCurrency: z.string().min(1),
  validity: z.preprocess((val) => {
    return(Number(val))
  }, z.int()),
  validityUnit: MembershipTimeUnitEnum,
  availability: MembershipAvailabilitySchema,
  url: z.preprocess(
    (val) => (val === '' ? undefined : val),
    z.url().nullish()
  ),
  notes: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date()
})

const MembershipWithChainSchema = z.object({
  chain: z.string().min(1),
  country: z.string().min(1).max(40)
})

const MembershipWithoutChainSchema = z.object({
  chain: z.literal(''),
  country: z.literal('')
})

const MembershipChainSchema = z.union([
  MembershipWithChainSchema, MembershipWithoutChainSchema
])

const MembershipWithCommitmentSchema = z.object({
  commitmentUnit: MembershipTimeUnitEnum,
  commitment: z.preprocess((val) => {
    if (typeof val === 'string') {
      if (val) {
        return Number.parseInt(val)
      } else {
        return null
      }
    }
    return val;
  }, z.int())
})

const MembershipWithoutCommitmentSchema = z.object({
  commitmentUnit: z.null(),
  commitment: z.preprocess((val) => {
    if (typeof val === 'string') {
      if (val) {
        return Number.parseInt(val)
      } else {
        return null
      }
    }
    return val;
  }, z.null('select a commitment unit to add commitment'))
})

const MembershipCommitmentSchema = z.discriminatedUnion('commitmentUnit', [
  MembershipWithCommitmentSchema, MembershipWithoutCommitmentSchema
])

const MembershipUnions = z.intersection(MembershipChainSchema, MembershipCommitmentSchema)

export const MembershipSchema = z.intersection(MembershipBaseSchema, MembershipUnions)
export type Membership = z.infer<typeof MembershipSchema>;

export const MembershipPostAndPutSchema = z.intersection(
    MembershipBaseSchema.omit({ id: true, createdAt: true, updatedAt: true }),
    MembershipUnions)
export type MembershipPostAndPut = z.infer<typeof MembershipPostAndPutSchema>;


// gymmanagers

export const GymManagerSchema = z.object({
  id: z.uuidv4(),
  userId: z.uuidv4(),
  gymId: z.uuidv4(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date()
});
export type GymManager = z.infer<typeof GymManagerSchema>;

export const GymManagerPostSchema = GymManagerSchema.pick({
  userId: true,
  gymId: true
});
export type GymManagerPost = z.infer<typeof GymManagerPostSchema>;


// user

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
  passwordHash: z.string().min(1),
  name: z.string().min(1).max(100),
  role: UserRoleEnum,
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date()
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
  password: PasswordSchema.optional()
});
export type UserPut = z.infer<typeof UserPutSchema>;

export const UserTokenPayloadSchema = UserSchema.pick({
  id: true,
  username: true
}).extend({
  userContext: z.string().min(1)
});
export type UserTokenPayload = z.infer<typeof UserTokenPayloadSchema>;

export const UserNamesSchema = UserSchema.pick({
  username: true,
  name: true
});

export const UserFrontendQuerySchema = UserSchema.pick({
  id: true,
  username: true,
  email: true,
  emailVerified: true,
  name: true,
  role: true
})
export const UserFrontendSchema = UserFrontendQuerySchema.nullish()
export type UserFrontend = z.infer<typeof UserFrontendSchema>


// equipment

export const EquipmentCategoryEnum = z.enum(['accessoryOrTool', 'barOrPlate', 'cardio', 'freeWeight', 'handleAttachment', 'strengthMachine', 'system']);
export type EquipmentCategory = z.infer<typeof EquipmentCategoryEnum>;

export const EquipmentWeightUnitEnum = z.enum(['kg', 'lbs'])
export type EquipmentWeightUnit = z.infer<typeof EquipmentWeightUnitEnum>;

export const EquipmentMaximumWeightTypeEnum = z.enum(['load', 'weight'])
export type EquipmentMaximumWeightType = z.infer<typeof EquipmentMaximumWeightTypeEnum>;

const EquipmentBaseSchema = z.object({
  id: z.uuidv4(),
  name: z.string().min(1),
  category: EquipmentCategoryEnum,
  manufacturer: z.string().min(1),
  code: z.string().min(1),
  maximumWeightType: EquipmentMaximumWeightTypeEnum,
  outOfProduction: z.boolean(),
  url: z.preprocess(
    (val) => (val === '' ? undefined : val),
    z.url().nullish()
  ),
  notes: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date()
})

// global variable that corresponds to defined database limitations
export const maxWeight: number = 999;

const EquipmentWithWeightsSchema = z.object({
  weightUnit: EquipmentWeightUnitEnum,
  weight: z.preprocess((val) => {
    if (!val) {
      return undefined
    }
    if (typeof val === 'string') {
      if (val) {
        return Number.parseFloat(val)
      } else {
        return undefined
      }
    }
    return val;
  }, z.float32().nullish()),
  startingWeight: z.preprocess((val) => {
    if (typeof val === 'string') {
      if (val) {
        return Number.parseFloat(val)
      } else {
        return undefined
      }
    }
    return val;
  }, z.float32().nullish()),
  availableWeights: z.array(z.float32()),
  maximumWeight: z.preprocess((val) => {
    if (typeof val === 'string') {
      if (val) {
        return Number.parseFloat(val)
      } else {
        return undefined
      }
    }
    return val;
  }, z.float32().nullish()),
})
.refine((data) => {
  if (data.startingWeight && data.maximumWeight) {
    return data.startingWeight < data.maximumWeight
  } else {
    return true;
  }
}, { error: 'starting weight cannot be more than maximum weight' })
.refine((data) => {
  if (data.availableWeights.length > 0 && data.startingWeight) {
    return Math.min(...data.availableWeights) === data.startingWeight
  } else {
    return true
  }
}, { error: 'smallest available weight must equal starting weight' })
.refine((data) => {
  if (data.availableWeights.length > 0 && data.maximumWeight) {
    return Math.max(...data.availableWeights) === data.maximumWeight
  } else {
    return true
  }
}, { error: 'highest available weight must equal maximum weight' })

const EquipmentWithoutWeightsSchema = z.object({
  weightUnit: z.null(),
  weight: z.preprocess((val) => {
    if (!val) {
      return null
    }
    if (typeof val === 'string') {
      if (val) {
        return Number.parseFloat(val)
      } else {
        return null
      }
    }
    return val;
  }, z.null('select a weight unit to use weights')),
  startingWeight: z.preprocess((val) => {
    if (typeof val === 'string') {
      if (val) {
        return Number.parseFloat(val)
      } else {
        return null
      }
    }
    return val;
  }, z.null('select a weight unit to use weights')),
  availableWeights: z.array(z.float32()).length(0, 'select a weight unit to use weights'),
  maximumWeight: z.preprocess((val) => {
    if (typeof val === 'string') {
      if (val) {
        return Number.parseFloat(val)
      } else {
        return null
      }
    }
    return val;
  }, z.null('select a weight unit to use weights'))
})

const EquipmentWeightsSchema = z.discriminatedUnion('weightUnit', [
  EquipmentWithWeightsSchema, EquipmentWithoutWeightsSchema
])

export const EquipmentSchema = z.intersection(EquipmentBaseSchema, EquipmentWeightsSchema)
export type Equipment = z.infer<typeof EquipmentSchema>;

export const EquipmentPostAndPutSchema = z.intersection(
  EquipmentBaseSchema.omit({ id: true, createdAt: true, updatedAt: true }),
  EquipmentWeightsSchema)
export type EquipmentPostAndPut = z.infer<typeof EquipmentPostAndPutSchema>;


// gymequipment

export const GymEquipmentSchema = z.object({
  id: z.uuidv4(),
  gymId: z.uuidv4(),
  equipmentId: z.uuidv4(),
  count: z.int().min(1),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date()
});
export type GymEquipment = z.infer<typeof GymEquipmentSchema>;

export const GymEquipmentPostSchema = GymEquipmentSchema.pick({
  equipmentId: true
});
export type GymEquipmentPost = z.infer<typeof GymEquipmentPostSchema>;


// gymmemberships

export const GymMembershipSchema = z.object({
  id: z.uuidv4(),
  gymId: z.uuidv4(),
  membershipId: z.uuidv4(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date()
});
export type GymMembership = z.infer<typeof GymMembershipSchema>;

export const GymMembershipPostSchema = GymMembershipSchema.pick({
  membershipId: true
});
export type GymMembershipPost = z.infer<typeof GymMembershipPostSchema>;


// gym

export const OpeningHoursExceptionSchema = z.object({
  id: z.uuidv4(),
  date: z.coerce.date(),
  hours: ExceptionTimeSchema,
  reason: z.string().min(1),
  concerns: z.enum(['everyone', 'non-members', 'members'])
})
export type OpeningHoursException = z.infer<typeof OpeningHoursExceptionSchema>;

export const HoursExceptionsSchema = z.object({
    data: z.array(OpeningHoursExceptionSchema)
  })
export type HoursExceptions = z.infer<typeof HoursExceptionsSchema>;

export const GymSchema = z.object({
  id: z.uuidv4(),
  name: z.string().min(1),
  chain: z.string(),
  street: z.string().min(1).max(60),
  streetNumber: z.string().min(1).max(20),
  district: z.string().min(1).max(60),
  city: z.string().min(1).max(60),
  country: z.string().min(1).max(40),
  openingHoursEveryone: HoursSchema,
  openingHoursMembers: HoursSchema,
  openingHoursExceptions: HoursExceptionsSchema,
  url: z.preprocess(
    (val) => (val === '' ? undefined : val),
    z.url().nullish()
  ),
  equipmentVisible: z.boolean(),
  membershipsVisible: z.boolean(),
  openingHoursVisible: z.boolean(),
  notes: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date()
});
export type Gym = z.infer<typeof GymSchema>;

export const GymGetEquipmentSchema = z.intersection(
  EquipmentBaseSchema.extend({ gymequipment: GymEquipmentSchema }),
  EquipmentWeightsSchema)
export type GymGetEquipment = z.infer<typeof GymGetEquipmentSchema>;

export const GymGetSchema = GymSchema.extend({
  managers: z.array(UserSchema.pick({
    id: true,
    username: true,
    email: true,
    name: true
  }).extend({
    gymmanagers: GymManagerSchema
  })),
  memberships: z.array(MembershipSchema),
  equipment: z.array(GymGetEquipmentSchema)
})
export type GymGet = z.infer<typeof GymGetSchema>;

export const GymGetMembershipsSchema = z.intersection(
  MembershipBaseSchema.extend({ gymmemberships: GymMembershipSchema }),
  MembershipUnions)
export type GymGetMemberships = z.infer<typeof GymGetMembershipsSchema>;

export const GymPostSchema = GymSchema.pick({
  name: true,
  chain: true,
  street: true,
  streetNumber: true,
  district: true,
  city: true,
  country: true,
  openingHoursEveryone: true,
  openingHoursMembers: true,
  openingHoursExceptions: true,
  url: true,
  equipmentVisible: true,
  membershipsVisible: true,
  openingHoursVisible: true,
  notes: true
});
export type GymPost = z.infer<typeof GymPostSchema>;

const GymPostFrontendHour = z.coerce.number().min(0).max(24).optional()
export const GymPostFrontendSchema = GymSchema.pick({
  name: true,
  chain: true,
  street: true,
  streetNumber: true,
  district: true,
  city: true,
  country: true,
  url: true,
  notes: true
}).extend({
  equipmentVisibility: z.string().optional(),
  membershipsVisibility: z.string().optional(),
  openingHoursVisibility: z.string().optional(),
  everyoneMOOpen: GymPostFrontendHour,
  everyoneMOClose: GymPostFrontendHour,
  everyoneTUOpen: GymPostFrontendHour,
  everyoneTUClose: GymPostFrontendHour,
  everyoneWEOpen: GymPostFrontendHour,
  everyoneWEClose: GymPostFrontendHour,
  everyoneTHOpen: GymPostFrontendHour,
  everyoneTHClose: GymPostFrontendHour,
  everyoneFROpen: GymPostFrontendHour,
  everyoneFRClose: GymPostFrontendHour,
  everyoneSAOpen: GymPostFrontendHour,
  everyoneSAClose: GymPostFrontendHour,
  everyoneSUOpen: GymPostFrontendHour,
  everyoneSUClose: GymPostFrontendHour,
  membersMOOpen: GymPostFrontendHour,
  membersMOClose: GymPostFrontendHour,
  membersTUOpen: GymPostFrontendHour,
  membersTUClose: GymPostFrontendHour,
  membersWEOpen: GymPostFrontendHour,
  membersWEClose: GymPostFrontendHour,
  membersTHOpen: GymPostFrontendHour,
  membersTHClose: GymPostFrontendHour,
  membersFROpen: GymPostFrontendHour,
  membersFRClose: GymPostFrontendHour,
  membersSAOpen: GymPostFrontendHour,
  membersSAClose: GymPostFrontendHour,
  membersSUOpen: GymPostFrontendHour,
  membersSUClose: GymPostFrontendHour
})
export type GymPostFrontend = z.infer<typeof GymPostFrontendSchema>;

export const GymPatchHoursSchema = GymSchema.pick({
  openingHoursEveryone: true,
  openingHoursMembers: true,
  openingHoursExceptions: true
})
export type GymPatchHours = z.infer<typeof GymPatchHoursSchema>;

export const GymPatchSchema = GymSchema.pick({
  name: true,
  chain: true,
  street: true,
  streetNumber: true,
  district: true,
  city: true,
  url: true,
  equipmentVisible: true,
  membershipsVisible: true,
  openingHoursVisible: true,
  notes: true
});
export type GymPatch = z.infer<typeof GymPatchSchema>;


// login

// Auth types for the frontend's AuthContext and root route
export interface AuthState {
  isAuthenticated: boolean
  user: UserFrontend
  login: (username: string, password: string) => Promise<void>
  refresh: () => Promise<string>
  logout: () => Promise<void>
}

export const LoginRequestSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1)
});
export type LoginRequest = z.infer<typeof LoginRequestSchema>;

export const LoginResponseSchema = UserSchema.pick({
  id: true,
  username: true,
  email: true,
  emailVerified: true,
  name: true,
  role: true,
}).extend({
  token: z.string().min(1)
})
export type LoginResponse = z.infer<typeof LoginResponseSchema>;

export const LoginRefreshResponseSchema = z.object({
  token: z.jwt()
})
export type LoginRefreshResponse = z.infer<typeof LoginRefreshResponseSchema>;