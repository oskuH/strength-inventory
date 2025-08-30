import express from 'express';
const app = express();

import { connectToDatabase } from './utils/db.js';
import { PORT } from './utils/config.js';

import usersRouter from './controllers/users.js';

app.use(express.json());

app.use('/api/users', usersRouter);

app.get('/ping', (_req, res) => {
  console.log('someone pinged here');
  res.send('pong');
});

try {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT.toString()}`);
  });
} catch (err) {
  console.error('Failed to start server:', err);
  process.exit(1);
}