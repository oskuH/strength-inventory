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
  role: Role
}

type NewUser = Omit<User, 'id' | 'emailVerified' | 'passwordHash' | 'role'>;
export interface NewUserRequest extends NewUser {
  password: string
}
