import { type CreationOptional, DataTypes, type InferAttributes, type InferCreationAttributes, Model } from 'sequelize';

import { Role } from '../utils/types/role.ts';

import { sequelize } from '../utils/db.js';

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<string>;
  declare username: string;
  declare email: string;
  declare emailVerified: CreationOptional<boolean>;
  declare passwordHash: string;
  declare name: string;
  declare role: CreationOptional<Role>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
};

User.init({
  id: {
    type: DataTypes.UUID,  // CHAR(36) for MySQL
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  username: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      len: [1, 30]
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
    allowNull: false,
    validate: {
      len: [1, 100]
    }
  },
  role: {
    type: DataTypes.ENUM('SUPERUSER', 'ADMIN', 'MANAGER', 'GYM-GOER'),
    allowNull: false,
    defaultValue: 'GYM-GOER'
  },
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE
}, {
  sequelize,
  underscored: true,
  modelName: 'user'
});

export default User;