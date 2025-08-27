import { DataTypes, Model } from 'sequelize';

import { sequelize } from '../utils/db.js';

class Gym extends Model { };

Gym.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
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
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  sequelize,
  underscored: true,
  modelName: 'gym'
});

export default Gym;