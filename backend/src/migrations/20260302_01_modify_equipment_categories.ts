import { DataTypes } from 'sequelize';
import { type Migration } from '../utils/db.ts';
// .ts instead of .js to accommodate Vitest

const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.changeColumn('equipment', 'category', {
    type: DataTypes
      .ENUM(
        'accessoryOrTool',
        'cardio',
        'freeWeight',
        'handleAttachment',
        'strengthMachine',
        'system'
      ),
    allowNull: false
  });
};

const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.changeColumn('equipment', 'category', {
    type: DataTypes
      .ENUM('attachment', 'cardio', 'freeWeight', 'strengthMachine', 'tool'),
    allowNull: false
  });
};

export { up, down };
