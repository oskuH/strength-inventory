import 'dotenv/config';

const {
  DATABASE_URI,
  JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET,
  NODE_ENV,
  TEST_DATABASE_URI
} = process.env;

let DB_URI: string;

if (NODE_ENV === 'test' && typeof TEST_DATABASE_URI === 'string') {
  DB_URI = TEST_DATABASE_URI;
} else if (typeof DATABASE_URI === 'string') {
  DB_URI = DATABASE_URI;
} else {
  throw Error('Database URI is not defined.');
}
const PORT = process.env.PORT ?? 3000;

export { DB_URI, JWT_ACCESS_SECRET, JWT_REFRESH_SECRET, NODE_ENV, PORT };
