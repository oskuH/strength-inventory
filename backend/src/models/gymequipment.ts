import { type CreationOptional, DataTypes, type InferAttributes, type InferCreationAttributes, Model } from 'sequelize';

import { sequelize } from '../utils/db.js';

class GymEquipment extends Model<InferAttributes<GymEquipment>, InferCreationAttributes<GymEquipment>> {
  declare id: CreationOptional<string>;
  declare gymId: string;
  declare equipmentId: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
};

GymEquipment.init({
  id: {
    type: DataTypes.UUID,  // CHAR(36) for MySQL
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  gymId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'gyms', key: 'id' }
  },
  equipmentId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'equipment', key: 'id' }
  },
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE
}, {
  sequelize,
  underscored: true,
  modelName: 'gymequipment'
});

export default GymEquipment;