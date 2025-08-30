import { DataTypes, QueryInterface } from 'sequelize';
import { type MigrationFn } from 'umzug';

const up: MigrationFn = async ({ context: queryInterface }) => {
  await (queryInterface as QueryInterface).createTable('users', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    email_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM('SUPERUSER', 'ADMIN', 'GYM-OWNER', 'GYM-GOER'),
      allowNull: false,
      defaultValue: 'GYM-GOER'
    },
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE
  });
};

const down: MigrationFn = async ({ context: queryInterface }) => {
  await (queryInterface as QueryInterface).dropTable('users');
};

export { up, down };