import Equipment from './equipment.ts';
import Gym from './gym.ts';
import Membership from './membership.ts';
import Session from './session.ts';
import User from './user.ts';

import GymEquipment from './gymequipment.ts';
import GymManagers from './gymmanagers.ts';
import GymMemberships from './gymmemberships.ts';

// One-To-Many
// Login sessions are personal.
User.hasMany(Session);
Session.belongsTo(User);

// Many-To-Many
// Users can manage several gyms and gyms can have several managers.
User.belongsToMany(Gym, { through: GymManagers });
Gym.belongsToMany(User, { through: GymManagers });

// Many-To-Many
// Gyms have many equipment and eqipment are typically not unique.
Gym.belongsToMany(Equipment, { through: GymEquipment });
Equipment.belongsToMany(Gym, { through: GymEquipment });

// Many-To-Many
// This relationship allows gym chains to reuse memberships across locations.
Gym.belongsToMany(Membership, { through: GymMemberships });
Membership.belongsToMany(Gym, { through: GymMemberships });

export { Equipment, Gym, Membership, Session, User };