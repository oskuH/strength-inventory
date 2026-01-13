import express from 'express';
const app = express();

import { connectToDatabase } from './utils/db.js';
import { errorHandler } from './utils/middleware.js';
import { PORT } from './utils/config.js';

import equipmentRouter from './controllers/equipment.js';
import gymsRouter from './controllers/gyms.js';
import usersRouter from './controllers/users.js';

app.use(express.json());

app.use('/api/equipment', equipmentRouter);
app.use('/api/gyms', gymsRouter);
app.use('/api/users', usersRouter);

app.use(errorHandler);

try {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT.toString()}`);
  });
} catch (err) {
  console.error('Failed to start server:', err);
  process.exit(1);
}

export default app;