import Equipment from './equipment.js';
import Gym from './gym.js';
import Session from './session.ts';
import User from './user.js';

User.hasMany(Session);
Session.belongsTo(User);

export { Equipment, Gym, Session, User };