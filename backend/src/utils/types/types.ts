import { z } from 'zod';

import { GymSchema, HoursSchema, LoginSchema, NewUserSchema, PatchGymSchema, PutUserSchema } from '../schemas.ts';
import { Role } from './role.ts';


// user

export interface User {
  id: string,
  username: string,
  email: string,
  emailVerified: boolean,
  passwordHash: string,
  name: string,
  role: Role,
  createdAt: Date,
  updatedAt: Date;
}

export type NewUserRequest = z.infer<typeof NewUserSchema>;
export type PutUserRequest = z.infer<typeof PutUserSchema>;

export type TokenPayload = Pick<User, 'id' | 'username'>;


// gym

export type Hours = z.infer<typeof HoursSchema>;

export interface Gym {
  id: string,
  name: string,
  chain: string | null | undefined,
  street: string,
  streetNumber: string,
  city: string,
  notes: string | null | undefined,
  openingHours: Hours,
  closingHours: Hours,
  createdAt: Date,
  updatedAt: Date;
}

export type GymPost = z.infer<typeof GymSchema>;
export type GymPatch = z.infer<typeof PatchGymSchema>;


// equipment

export enum EquipmentCategory {
  Attachment = 'attachment',
  Cardio = 'cardio',
  FreeWeight = 'freeWeight',
  StrengthMachine = 'strengthMachine',
  Tool = 'tool'
}

export enum WeightUnit {
  Kilograms = 'kg',
  Pounds = 'lbs'
}

export interface Equipment {
  id: string,
  name: string,
  category: EquipmentCategory,
  manufacturer: string,
  code: string,
  weightUnit: WeightUnit | null,
  weight: number | null,
  startingWeight: number | null,
  availableWeights: number[] | null,
  maximumWeight: number | null,
  notes: string | null,
  createdAt: Date,
  updatedAt: Date;
}

export type EquipmentRequest = Pick<
  Equipment,
  'name' | 'category' | 'manufacturer' | 'code' | 'weightUnit' | 'weight' | 'startingWeight' | 'availableWeights' | 'maximumWeight' | 'notes'
>;


// login

export type LoginRequest = z.infer<typeof LoginSchema>;
export interface LoginResponse {
  token: string,
  username: string;
}