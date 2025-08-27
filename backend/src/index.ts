import express from 'express';
const app = express();

import { connectToDatabase } from './utils/db.js';
import { PORT } from './utils/config.js';

app.use(express.json());

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