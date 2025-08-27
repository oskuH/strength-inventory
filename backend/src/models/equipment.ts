import { DataTypes, Model } from 'sequelize';

import { sequelize } from '../utils/db.js';

class Equipment extends Model { };

Equipment.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
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
    type: DataTypes.ENUM('kg', 'lbs'),
    validate: {
      customValidator(value : string | null) {
        if (value === null && (this['weight'] !== null || this['startingWeight'] !== null || this['availableWeights'] !== null)) {
          throw new Error('weight unit must be selected if other weight data is used');
        }
      }
    }
  },
  weight: {
    type: DataTypes.FLOAT
  },
  startingWeight: {
    type: DataTypes.FLOAT
  },
  availableWeights: {
    type: DataTypes.JSON
  }
}, {
  sequelize,
  underscored: true,
  modelName: 'equipment'
});

export default Equipment;