import { type CreationOptional, DataTypes, type InferAttributes, type InferCreationAttributes, Model } from 'sequelize';

import { sequelize } from '../utils/db.ts';

class Session extends Model<InferAttributes<Session>, InferCreationAttributes<Session>> {
  declare id: string;
  declare userId: string;
  declare token: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
};

Session.init({
  id: {
    type: DataTypes.STRING, // MIGRATE TO SEQUELIZE UUID
    primaryKey: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' }
  },
  token: {
    type: DataTypes.STRING,
    allowNull: false
  },
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE
}, {
  sequelize,
  underscored: true,
  modelName: 'session'
});

export default Session;