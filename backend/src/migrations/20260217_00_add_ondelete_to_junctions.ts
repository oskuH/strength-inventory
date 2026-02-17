import { DataTypes } from 'sequelize';
import { type Migration } from '../utils/db.ts';  // .ts instead of .js to accommodate Vitest

const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.removeConstraint('gymmanagers', 'gymmanagers_gymId_fkey');
  await queryInterface.removeConstraint('gymmanagers', 'gymmanagers_userId_fkey');

  await queryInterface.changeColumn('gymmanagers', 'user_id', {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'users', key: 'id' },
    onDelete: 'CASCADE'
  });

  await queryInterface.changeColumn('gymmanagers', 'gym_id', {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'gyms', key: 'id' },
    onDelete: 'CASCADE'
  });
};

const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.removeConstraint('gymmanagers', 'gymmanagers_gymId_fkey');
  await queryInterface.removeConstraint('gymmanagers', 'gymmanagers_userId_fkey');

  await queryInterface.changeColumn('gymmanagers', 'user_id', {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'users', key: 'id' }
  });

  await queryInterface.changeColumn('gymmanagers', 'gym_id', {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'gyms', key: 'id' }
  });
};

export { up, down };