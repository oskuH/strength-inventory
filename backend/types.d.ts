import type { Equipment, Gym, User } from './src/models/index.ts';

declare global {
  namespace Express {
    interface Request {
      token?: string,
      user?: User,
      targetUser?: User,
      targetGym?: Gym,
      targetEquipment?: Equipment;
    }
  }
}