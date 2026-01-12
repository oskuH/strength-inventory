import { DataTypes } from 'sequelize';
import { type Migration } from '../utils/db.ts';
//.ts instead of .js to accommodate Vitest

const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.addColumn('equipment', 'category', {
    type: DataTypes.ENUM('attachment', 'cardio', 'freeWeight', 'strengthMachine', 'tool')
  });
  await queryInterface.addColumn('equipment', 'maximumWeight', {
    type: DataTypes.FLOAT
  });
  await queryInterface.addColumn('equipment', 'notes', {
    type: DataTypes.STRING
  });
  await queryInterface.addColumn('gyms', 'city', {
    type: DataTypes.STRING
  });
};

const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.removeColumn('equipment', 'category');
  await queryInterface.removeColumn('equipment', 'maximumWeight');
  await queryInterface.removeColumn('equipment', 'notes');
  await queryInterface.removeColumn('gyms', 'city');
  await queryInterface.removeColumn('gyms', 'notes');
};

export { up, down };