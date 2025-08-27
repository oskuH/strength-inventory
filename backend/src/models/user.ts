import { DataTypes, Model } from 'sequelize';

import { sequelize } from '../utils/db.js';

class User extends Model { };

User.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      len: [1,30]
    }
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  emailVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  passwordHash: {
    type: DataTypes.STRING,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('superuser', 'admin', 'gym-owner', 'gym-goer'),
    allowNull: false,
    defaultValue: 'gym-goer'
  }
}, {
  sequelize,
  underscored: true,
  modelName: 'user'
});

export default User;