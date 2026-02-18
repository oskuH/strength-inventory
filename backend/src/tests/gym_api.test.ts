import { assert, beforeEach, describe, expect, test } from 'vitest';
import request from 'supertest';

import { genSaltSync, hashSync } from 'bcrypt-ts';

import app from '../index.js';

import { Gym, User } from '../models/index.ts';

import { type Gym as FullGym, type LoginResponse } from '@strength-inventory/schemas';

const initialGymCount = 2;  // The number of gyms created in beforeEach
let token: string;
let gymToPatch: FullGym | null;

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
    role: 'ADMIN'
  });

  passwordHash = hashSync('YourBodyIsTheOnlyPlaceYouHaveToLive', salt);
  await User.create({
    username: 'TheGymOwner',
    email: 'manager@thebestgym.me',
    passwordHash,
    name: 'The Gym Owner',
    role: 'MANAGER'
  });

  await Gym.truncate({ cascade: true });

  await Gym.create({
    name: 'Fitness24Seven Helsinki Punavuori',
    chain: 'Fitness24Seven',
    street: 'Albertinkatu',
    streetNumber: '29',
    city: 'Helsinki'
  });

  await Gym.create({
    name: 'ELIXIA Kamppi',
    chain: 'ELIXIA',
    street: 'Fredrikinkatu',
    streetNumber: '48',
    city: 'Helsinki',
    notes: 'A lot of natural light',
    openingHours: { MO: [6, 22], TU: [6, 22], WE: [6, 22], TH: [6, 22], FR: [6, 21], SA: [8, 20], SU: [8, 20] }
  });
});

test('GET all gyms correctly returns a json', async () => {
  const response = await request(app)
    .get('/api/gyms')
    .expect(200)
    .expect('Content-Type', /application\/json/);

  expect(response.body).toHaveLength(initialGymCount);
});

describe('POST a new gym', () => {
  describe('as an admin', () => {
    beforeEach(async () => {
      const response: request.Response = await request(app)
        .post('/api/login')
        .send({ username: 'TheAdmin', password: 'ThereIsOnlyWeightAndThoseTooWeakToLiftIt' })
        .expect(200);

      const body = response.body as LoginResponse;
      token = body.token;
    });

    test('succeeds with valid required fields', async () => {
      const newGym = {
        name: 'Mayors Gym',
        street: 'Porkkalankatu',
        streetNumber: '13',
        city: 'Helsinki'
      };

      const response: request.Response = await request(app)
        .post('/api/gyms')
        .set('Authorization', `Bearer ${token}`)
        .send(newGym)
        .expect(201)
        .expect('Content-Type', /application\/json/);

      const body = response.body as FullGym;

      expect(body.openingHours).toEqual({});
    });

    test('fails if "name" is null', async () => {
      const newGym = {
        street: 'Porkkalankatu',
        streetNumber: '13',
        city: 'Helsinki'
      };

      await request(app)
        .post('/api/gyms')
        .set('Authorization', `Bearer ${token}`)
        .send(newGym)
        .expect(400);
    });

    test('fails if "street" is null', async () => {
      const newGym = {
        name: 'Mayors Gym',
        streetNumber: '13',
        city: 'Helsinki'
      };

      await request(app)
        .post('/api/gyms')
        .set('Authorization', `Bearer ${token}`)
        .send(newGym)
        .expect(400);
    });

    test('fails if "streetNumber" is null', async () => {
      const newGym = {
        name: 'Mayors Gym',
        street: 'Porkkalankatu',
        city: 'Helsinki'
      };

      await request(app)
        .post('/api/gyms')
        .set('Authorization', `Bearer ${token}`)
        .send(newGym)
        .expect(400);
    });

    test('fails if "city" is null', async () => {
      const newGym = {
        name: 'Mayors Gym',
        street: 'Porkkalankatu',
        streetNumber: '13'
      };

      await request(app)
        .post('/api/gyms')
        .set('Authorization', `Bearer ${token}`)
        .send(newGym)
        .expect(400);
    });
  });
});

describe('PATCH gym\'s service hours', () => {
  describe('as an admin', () => {
    beforeEach(async () => {
      const response: request.Response = await request(app)
        .post('/api/login')
        .send({ username: 'TheAdmin', password: 'ThereIsOnlyWeightAndThoseTooWeakToLiftIt' })
        .expect(200);

      const body = response.body as LoginResponse;
      token = body.token;

      gymToPatch = await Gym.findOne({ where: { name: 'ELIXIA Kamppi' } });
    });

    test('succeeds with both sets of hours', async () => {
      assert.isNotNull(gymToPatch);
      const newOpeningHours = { MO: [7, 21], TU: [7, 21], WE: [7, 21], TH: [7, 21], FR: [7, 21], SA: [8, 20], SU: [8, 20] };

      await request(app)
        .patch(`/api/gyms/${gymToPatch.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ openingHours: newOpeningHours })
        .expect(200);
    });
  });
});

describe('DELETE a gym', () => {
  describe('as an admin', () => {
    beforeEach(async () => {
      const response: request.Response = await request(app)
        .post('/api/login')
        .send({ username: 'TheAdmin', password: 'ThereIsOnlyWeightAndThoseTooWeakToLiftIt' })
        .expect(200);

      const body = response.body as LoginResponse;
      token = body.token;
    });

    test('succeeds with a valid id', async () => {
      const startResponse = await request(app)
        .get('/api/gyms');

      expect(startResponse.body).toHaveLength(initialGymCount);

      const gymToDelete: FullGym | null = await Gym.findOne({ where: { name: 'Fitness24Seven Helsinki Punavuori' } });
      assert.isNotNull(gymToDelete);

      await request(app)
        .delete(`/api/gyms/${gymToDelete.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204);

      const endResponse = await request(app)
        .get('/api/gyms');

      expect(endResponse.body).toHaveLength(initialGymCount - 1);
    });

    test('fails with an invalid id', async () => {
      await request(app)
        .delete('/api/gyms/ca16ce67-718e-497a-acbe-011fcdee4745')
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });
  });
});