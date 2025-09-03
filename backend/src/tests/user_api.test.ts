import { beforeEach, expect, test } from 'vitest';
import request from 'supertest';

import { genSaltSync, hashSync } from 'bcrypt-ts';
import { v4 as uuid } from 'uuid';

import app from '../index.js';

import User from '../models/user.js';

beforeEach(async () => {
  await User.truncate();
  let id: string;
  let passwordHash: string;
  const salt = genSaltSync(10);

  id = uuid();
  passwordHash = hashSync('ILiftThereforeIAm', salt);
  await User.create({ id, username: 'LashaTalakhadze', email: 'lasha@talakhadze.ge', passwordHash, name: 'Lasha Talakhadze' });

  id = uuid();
  passwordHash = hashSync('FirstHeavyLiftIsGettingOffTheCouch', salt);
  await User.create({ id, username: 'WenwenLi', email: 'wenwen@li.ch', passwordHash, name: 'Wenwen Li' });
});

test('Users are returned as json', async () => {
  const response = await request(app)
    .get('/api/users')
    .expect(200);

  expect(response.body).toHaveLength(2);
});