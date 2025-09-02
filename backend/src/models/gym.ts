import { type CreationOptional, DataTypes, type InferAttributes, type InferCreationAttributes, Model } from 'sequelize';

import { sequelize } from '../utils/db.js';

class Gym extends Model<InferAttributes<Gym>, InferCreationAttributes<Gym>> {
  declare id: string;
  declare name: string;
  declare chain: string | null;
  declare street: string;
  declare streetNumber: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
};

Gym.init({
  id: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  chain: {
    type: DataTypes.STRING
  },
  street: {
    type: DataTypes.STRING,
    allowNull: false
  },
  streetNumber: {
    type: DataTypes.STRING,
    allowNull: false
  },
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE
}, {
  sequelize,
  underscored: true,
  modelName: 'gym'
});

export default Gym;