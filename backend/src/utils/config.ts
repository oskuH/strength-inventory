import 'dotenv/config';

const { DATABASE_URI, NODE_ENV, TEST_DATABASE_URI, JWT_SECRET } = process.env;

let DB_URI: string;

if (NODE_ENV === 'test' && typeof TEST_DATABASE_URI === 'string') {
  DB_URI = TEST_DATABASE_URI;
} else if (typeof DATABASE_URI === 'string') {
  DB_URI = DATABASE_URI;
} else {
  throw new Error('A database URI environment variable is not defined.');
}
const PORT = process.env.PORT ?? 3000;

export { DB_URI, PORT, JWT_SECRET };