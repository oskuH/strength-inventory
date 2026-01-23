import { z } from 'zod';

import { LoginSchema, NewUserSchema, PutUserSchema } from './schemas.ts';


// user

export enum Role {
  Superuser = 'SUPERUSER',
  Admin = 'ADMIN',
  GymOwner = 'GYM-OWNER',
  GymGoer = 'GYM-GOER'
}

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

export interface Hours {
  MO?: number;
  TU?: number;
  WE?: number;
  TH?: number;
  FR?: number;
  SA?: number;
  SU?: number;
}

export interface Gym {
  id: string,
  name: string,
  chain: string | null,
  street: string,
  streetNumber: string,
  city: string,
  notes: string | null,
  openingHours: Hours,
  closingHours: Hours,
  createdAt: Date,
  updatedAt: Date;
}

export type GymPost = Pick<Gym, 'name' | 'chain' | 'street' | 'streetNumber' | 'city' | 'notes' | 'openingHours' | 'closingHours'>;
export type GymPatch = Pick<Gym, 'name' | 'chain' | 'street' | 'streetNumber' | 'city' | 'notes'>;


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