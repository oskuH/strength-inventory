import 'ts-node/register';  // Required by Node.js to read .ts migration files for Umzug

import { Sequelize } from 'sequelize';
import { SequelizeStorage, Umzug } from 'umzug';

import { DB_URI } from './config.ts';  //.ts instead of .js to accommodate Vitest

const sequelize = new Sequelize(DB_URI);

const umzug = new Umzug({
  migrations: {
    glob: 'src/migrations/*.ts'
  },
  storage: new SequelizeStorage({ sequelize, tableName: 'migrations' }),
  context: sequelize.getQueryInterface(),
  logger: console
});

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    await runMigrations();
    console.log('Connected to the database.');
  } catch (err: unknown) {
    let errorMessage = 'Failed to connect to the database.';
    if (err instanceof Error) {
      errorMessage += ' Error: ' + err.message;
    }
    console.error(errorMessage);
    return process.exit(1);
  }

  return null;
};

const runMigrations = async () => {
  const migrations = await umzug.up();
  console.log('Migrations up to date', {
    files: migrations.map((mig) => mig.name)
  });
};

const rollbackMigration = async () => {
  await sequelize.authenticate();
  await umzug.down();
};

export type Migration = typeof umzug._types.migration;

export { connectToDatabase, sequelize, rollbackMigration };