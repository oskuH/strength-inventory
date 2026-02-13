import Equipment from './equipment.ts';
import Gym from './gym.ts';
import GymEquipment from './gymequipment.ts';
import GymManagers from './gymmanagers.ts';
import Session from './session.ts';
import User from './user.ts';

User.hasMany(Session);
Session.belongsTo(User);

User.belongsToMany(Gym, { through: GymManagers });
Gym.belongsToMany(User, { through: GymManagers });

Gym.belongsToMany(Equipment, { through: GymEquipment });
Equipment.belongsToMany(Gym, { through: GymEquipment });

export { Equipment, Gym, Session, User };