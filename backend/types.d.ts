import type { Equipment, Gym, GymEquipment, GymManagers, GymMemberships, Membership, User } from './src/models/index.ts';

declare global {
  namespace Express {
    interface Request {
      token?: string,
      user?: User,
      targetUser?: User,
      targetGym?: Gym,
      targetEquipment?: Equipment,
      targetMembership?: Membership,
      targetGymEquipment?: GymEquipment,
      targetGymManager?: GymManagers,
      targetGymMembership?: GymMemberships;
    }
  }
}