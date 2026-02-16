import express from 'express';
const app = express();

import cors from 'cors';

import { connectToDatabase } from './utils/db.js';
import { errorHandler, unknownEndpoint } from './utils/middleware.js';
import { PORT } from './utils/config.js';

import equipmentRouter from './controllers/equipment.js';
import gymsRouter from './controllers/gyms.js';
import gymEquipmentRouter from './controllers/gymequipment.ts';
import gymManagersRouter from './controllers/gymmanagers.ts';
import gymMembershipsRouter from './controllers/gymmemberships.ts';
import loginRouter from './controllers/login.ts';
import logoutRouter from './controllers/logout.ts';
import membershipsRouter from './controllers/memberships.ts';
import usersRouter from './controllers/users.js';

app.use(cors());
app.use(express.json());

app.use('/api/equipment', equipmentRouter);
app.use('/api/gyms', gymsRouter);
app.use('/api/gymequipment', gymEquipmentRouter);
app.use('/api/gymmanagers', gymManagersRouter);
app.use('/api/gymmemberships', gymMembershipsRouter);
app.use('/api/login', loginRouter);
app.use('/api/logout', logoutRouter);
app.use('/api/memberships', membershipsRouter);
app.use('/api/users', usersRouter);

app.use(unknownEndpoint);
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