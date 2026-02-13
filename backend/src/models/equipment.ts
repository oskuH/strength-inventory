import { type CreationOptional, DataTypes, type InferAttributes, type InferCreationAttributes, Model } from 'sequelize';

import type { EquipmentCategory, EquipmentWeightUnit } from '../utils/types/types.ts';

import { sequelize } from '../utils/db.js';

class Equipment extends Model<InferAttributes<Equipment>, InferCreationAttributes<Equipment>> {
  declare id: CreationOptional<string>;
  declare name: string;
  declare category: EquipmentCategory;
  declare manufacturer: string;
  declare code: string;
  declare weightUnit: EquipmentWeightUnit | null | undefined;
  declare weight: number | null | undefined;
  declare startingWeight: number | null | undefined;
  declare availableWeights: number[] | null | undefined;
  declare maximumWeight: number | null | undefined;
  declare notes: string | null | undefined;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
};

Equipment.init({
  id: {
    type: DataTypes.UUID,  // CHAR(36) for MySQL
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  category: {
    type: DataTypes.ENUM('attachment', 'cardio', 'freeWeight', 'strengthMachine', 'tool'),
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
  maximumWeight: {
    type: DataTypes.FLOAT
  },
  notes: {
    type: DataTypes.STRING
  },
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE
}, {
  sequelize,
  underscored: true,
  modelName: 'equipment',
  validate: {
    customValidator() {
      if (this['weightUnit'] === null && (this['weight'] !== null || this['startingWeight'] !== null || this['availableWeights'] !== null || this['maximumWeight'] !== null)) {
        throw new Error('weight unit must be selected if other weight data is used');
      }
    }
  }
});

export default Equipment;