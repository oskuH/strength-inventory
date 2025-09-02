import { type CreationOptional, DataTypes, type InferAttributes, type InferCreationAttributes, Model } from 'sequelize';

import { WeightUnit } from '../utils/types.js';

import { sequelize } from '../utils/db.js';

class Equipment extends Model<InferAttributes<Equipment>, InferCreationAttributes<Equipment>> {
  declare id: string;
  declare name: string;
  declare manufacturer: string;
  declare code: string;
  declare weightUnit: WeightUnit | null;
  declare weight: number | null;
  declare startingWeight: number | null;
  declare availableWeights: number[] | null;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
};

Equipment.init({
  id: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  manufacturer: {
    type: DataTypes.STRING,
    allowNull: false
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false
  },
  weightUnit: {
    type: DataTypes.ENUM('kg', 'lbs')
  },
  weight: {
    type: DataTypes.FLOAT
  },
  startingWeight: {
    type: DataTypes.FLOAT
  },
  availableWeights: {
    type: DataTypes.JSON
  },
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE
}, {
  sequelize,
  underscored: true,
  modelName: 'equipment',
  validate: {
    customValidator() {
      if (this['weightUnit'] === null && (this['weight'] !== null || this['startingWeight'] !== null || this['availableWeights'] !== null)) {
        throw new Error('weight unit must be selected if other weight data is used');
      }
    }
  }
});

export default Equipment;