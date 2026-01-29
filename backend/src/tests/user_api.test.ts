import { assert, beforeEach, describe, expect, test } from 'vitest';
import request from 'supertest';

import { genSaltSync, hashSync } from 'bcrypt-ts';

import app from '../index.ts';

import { User } from '../models/index.ts';

import { type User as FullUser, type LoginResponse } from '../utils/types/types.ts';
import { Role } from '../utils/types/role.ts';

const initialUserCount = 3;  // The number of users created in beforeEach
let token: string;

beforeEach(async () => {
  await User.truncate({ cascade: true });
  let passwordHash: string;
  const salt = genSaltSync(10);

  passwordHash = hashSync('ThereIsOnlyWeightAndThoseTooWeakToLiftIt', salt);
  await User.create({
    username: 'TheAdmin',
    email: 'admin@strengthinventory.eu',
    passwordHash,
    name: 'The Admin',
    role: Role.Admin
  });

  passwordHash = hashSync('ILiftThereforeIAm', salt);
  await User.create({
    username: 'LashaTalakhadze',
    email: 'lasha@talakhadze.ge',
    passwordHash,
    name: 'Lasha Talakhadze'
  });

  passwordHash = hashSync('FirstHeavyLiftIsGettingOffTheCouch', salt);
  await User.create({
    username: 'WenwenLi',
    email: 'wenwen@li.ch',
    passwordHash,
    name: 'Wenwen Li'
  });
});

test('All users are correctly returned as json', async () => {
  const response = await request(app)
    .get('/api/users')
    .expect(200)
    .expect('Content-Type', /application\/json/);

  expect(response.body).toHaveLength(initialUserCount);
});

describe('Creating a new user', () => {
  test('succeeds if all fields are valid', async () => {
    const newUser = {
      username: 'HeatherConnor',
      email: 'heather@connor.us',
      password: 'TheBodyAchievesWhatTheMindBelieves',
      name: 'Heather Connor'
    };

    await request(app)
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);
  });

  test('fails if "username" is null', async () => {
    const newUser = {
      email: 'heather@connor.us',
      password: 'TheBodyAchievesWhatTheMindBelieves',
      name: 'Heather Connor'
    };

    await request(app)
      .post('/api/users')
      .send(newUser)
      .expect(400);
  });

  test('fails if "username" is more than 30 characters', async () => {
    const newUser = {
      username: 'HeatherConnorrrrrrrrrrrrrrrrrrrrr',
      email: 'heather@connor.us',
      password: 'TheBodyAchievesWhatTheMindBelieves',
      name: 'Heather Connor'
    };

    await request(app)
      .post('/api/users')
      .send(newUser)
      .expect(400);
  });

  test('fails if "email" is null', async () => {
    const newUser = {
      username: 'HeatherConnor',
      password: 'TheBodyAchievesWhatTheMindBelieves',
      name: 'Heather Connor'
    };

    await request(app)
      .post('/api/users')
      .send(newUser)
      .expect(400);
  });

  test('fails if "password" is null', async () => {
    const newUser = {
      username: 'HeatherConnor',
      email: 'heather@connor.us',
      name: 'Heather Connor'
    };

    await request(app)
      .post('/api/users')
      .send(newUser)
      .expect(400);
  });

  test('fails if "password" is less than 3 characters', async () => {
    const newUser = {
      username: 'HeatherConnor',
      email: 'heather@connor.us',
      password: 'Th',
      name: 'Heather Connor'
    };

    await request(app)
      .post('/api/users')
      .send(newUser)
      .expect(400);
  });

  test('fails if "name" is null', async () => {
    const newUser = {
      username: 'HeatherConnor',
      email: 'heather@connor.us',
      password: 'TheBodyAchievesWhatTheMindBelieves'
    };

    await request(app)
      .post('/api/users')
      .send(newUser)
      .expect(400);
  });

  test('fails if "name" is more than 100 characters', async () => {
    const newUser = {
      username: 'HeatherConnor',
      email: 'heather@connor.us',
      password: 'TheBodyAchievesWhatTheMindBelieves',
      name: 'Heatheeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeer'
    };

    await request(app)
      .post('/api/users')
      .send(newUser)
      .expect(400);
  });
});

// TODO
/* describe('Updating user\'s username and name', () => {
  test('succeeds with valid input', async () => {
    // TODO
  });
}); */

describe('Deleting a user', () => {
  describe('as an admin', () => {
    beforeEach(async () => {
      const response: request.Response = await request(app)
        .post('/api/login')
        .send({ username: 'TheAdmin', password: 'ThereIsOnlyWeightAndThoseTooWeakToLiftIt' })
        .expect(200)
        .expect('Content-Type', /application\/json/);

      const body = response.body as LoginResponse;
      token = body.token;
    });

    test('succeeds with a valid id', async () => {
      const startResponse = await request(app)
        .get('/api/users');

      expect(startResponse.body).toHaveLength(initialUserCount);

      const userToDelete: FullUser | null = await User.findOne({ where: { username: 'LashaTalakhadze' } });
      assert.isNotNull(userToDelete);

      await request(app)
        .delete(`/api/users/${userToDelete.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204);

      const endResponse = await request(app)
        .get('/api/users');

      expect(endResponse.body).toHaveLength(initialUserCount - 1);
    });

    test('fails with an invalid id', async () => {
      await request(app)
        .delete('/api/users/ca16ce67-718e-497a-acbe-011fcdee4745')
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });
  });
});