// TODO: these tests are currently broken

import { assert, beforeEach, describe, expect, test } from 'vitest';
import request from 'supertest';

import { genSaltSync, hashSync } from 'bcrypt-ts';

import app from '../index.js';

import User from '../models/user.js';

import type { User as FullUser } from '../utils/types.ts';

const initialUserCount = 2;  // The number of users created in beforeEach

beforeEach(async () => {
  await User.truncate();
  let passwordHash: string;
  const salt = genSaltSync(10);

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
});

// TODO
/* describe('Updating user\'s username and name', () => {
  test('succeeds with valid input', async () => {
    // TODO
  });
}); */

describe('Deleting a user', () => {
  test('succeeds with a valid id', async () => {
    const startResponse = await request(app)
      .get('/api/users');

    expect(startResponse.body).toHaveLength(initialUserCount);

    const userToDelete: FullUser | null = await User.findOne({ where: { username: 'LashaTalakhadze' } });
    assert.isNotNull(userToDelete);

    await request(app)
      .delete(`/api/users/${userToDelete.id}`)
      .expect(204);

    const endResponse = await request(app)
      .get('/api/users');

    expect(endResponse.body).toHaveLength(initialUserCount - 1);
  });

  test('fails with an invalid id', async () => {
    await request(app)
      .delete('/api/users/5-reps-in-reserve')
      .expect(404);
  });
});