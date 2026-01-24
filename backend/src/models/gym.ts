import { type CreationOptional, DataTypes, type InferAttributes, type InferCreationAttributes, Model } from 'sequelize';

import { type Hours } from '../utils/types.js';

import { sequelize } from '../utils/db.js';

class Gym extends Model<InferAttributes<Gym>, InferCreationAttributes<Gym>> {
  declare id: CreationOptional<string>;
  declare name: string;
  declare chain: string | null;
  declare street: string;
  declare streetNumber: string;
  declare city: string;
  declare notes: string | null;
  declare openingHours: CreationOptional<Hours>;
  declare closingHours: CreationOptional<Hours>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
};

Gym.init({
  id: {
    type: DataTypes.UUID,  // CHAR(36) for MySQL
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
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
  city: {
    type: DataTypes.STRING,
    allowNull: false
  },
  notes: {
    type: DataTypes.STRING
  },
  openingHours: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: {}
  },
  closingHours: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: {}
  },
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE
}, {
  sequelize,
  underscored: true,
  modelName: 'gym'
});

export default Gym;