import { z } from 'zod';

import {
  EquipmentCategoryEnum,
  EquipmentPostAndPutSchema,
  EquipmentSchema,
  EquipmentWeightUnitEnum,
  GymPatchSchema,
  GymPostSchema,
  GymSchema,
  HoursSchema,
  LoginRequestSchema,
  LoginResponseSchema,
  MembershipAvailabilityEntrySchema,
  MembershipAvailabilitySchema,
  MembershipTimeUnitEnum,
  UserPostSchema,
  UserPutSchema,
  UserRoleEnum,
  UserSchema,
  UserTokenPayloadSchema
} from '../schemas.ts';


export type Hours = z.infer<typeof HoursSchema>;


// user

export type UserRole = z.infer<typeof UserRoleEnum>;

export type User = z.infer<typeof UserSchema>;
export type UserPost = z.infer<typeof UserPostSchema>;
export type UserPut = z.infer<typeof UserPutSchema>;

export type UserTokenPayload = z.infer<typeof UserTokenPayloadSchema>;


// gym

export type Gym = z.infer<typeof GymSchema>;
export type GymPost = z.infer<typeof GymPostSchema>;
export type GymPatch = z.infer<typeof GymPatchSchema>;


// equipment

export type EquipmentCategory = z.infer<typeof EquipmentCategoryEnum>;
export type EquipmentWeightUnit = z.infer<typeof EquipmentWeightUnitEnum>;

export type Equipment = z.infer<typeof EquipmentSchema>;
export type EquipmentPostAndPut = z.infer<typeof EquipmentPostAndPutSchema>;


// membership

export type MembershipTimeUnit = z.infer<typeof MembershipTimeUnitEnum>;

export type MembershipAvailabilityEntry = z.infer<typeof MembershipAvailabilityEntrySchema>;  // Currently redundant.
export type MembershipAvailability = z.infer<typeof MembershipAvailabilitySchema>;


// login

export type LoginRequest = z.infer<typeof LoginRequestSchema>;
export type LoginResponse = z.infer<typeof LoginResponseSchema>;