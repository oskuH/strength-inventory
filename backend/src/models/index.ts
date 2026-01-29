import Equipment from './equipment.ts';
import Gym from './gym.ts';
import GymManagers from './gymmanagers.ts';
import Session from './session.ts';
import User from './user.ts';

User.hasMany(Session);
Session.belongsTo(User);

User.belongsToMany(Gym, { through: GymManagers });
Gym.belongsToMany(User, { through: GymManagers });

export { Equipment, Gym, Session, User };