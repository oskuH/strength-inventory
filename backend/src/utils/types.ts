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
  updatedAt: Date
}

type NewUserReq = Pick<User, 'username' | 'email' | 'name'>;
export interface NewUserRequest extends NewUserReq {
  password: string
}

export interface Gym {
  id: string,
  name: string,
  chain: string | null,
  street: string,
  streetNumber: string,
  createdAt: Date,
  updatedAt: Date
}

export type NewGymRequest = Pick<Gym, 'name' | 'chain' | 'street' | 'streetNumber'>;

export enum WeightUnit {
  Kilograms = 'kg',
  Pounds = 'lbs'
}

export interface Equipment {
  id: string,
  name: string,
  manufacturer: string,
  code: string,
  weightUnit: WeightUnit | null,
  weight: number | null,
  startingWeight: number | null,
  availableWeights: number[] | null,
  createdAt: Date,
  updatedAt: Date
}

export type NewEquipmentRequest = Pick<
  Equipment,
  'name' | 'manufacturer' | 'code' | 'weightUnit' | 'weight' | 'startingWeight' | 'availableWeights'
>;
