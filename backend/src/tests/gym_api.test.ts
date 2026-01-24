// TODO: these tests are currently broken

import { assert, beforeEach, describe, expect, test } from 'vitest';
import request from 'supertest';

import app from '../index.js';

import Gym from '../models/gym.ts';

import { type Gym as FullGym } from '../utils/types.ts';

const initialGymCount = 2;  // The number of gyms created in beforeEach

beforeEach(async () => {
  await Gym.truncate();

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
    city: 'Helsinki'
  });
});

test('All gyms are correctly returned as json', async () => {
  const response = await request(app)
    .get('/api/gyms')
    .expect(200)
    .expect('Content-Type', /application\/json/);

  expect(response.body).toHaveLength(initialGymCount);
});

describe('Creating a new gym', () => {
  test('succeeds with valid required fields', async () => {
    const newGym = {
      name: 'Mayors Gym',
      street: 'Porkkalankatu',
      streetNumber: '13',
      city: 'Helsinki'
    };

    const response: request.Response = await request(app)
      .post('/api/gyms')
      .send(newGym)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const body = response.body as FullGym;

    expect(body.openingHours).toEqual({});
    expect(body.closingHours).toEqual({});
  });

  test('fails if "name" is null', async () => {
    const newGym = {
      street: 'Porkkalankatu',
      streetNumber: '13',
      city: 'Helsinki'
    };

    await request(app)
      .post('/api/gyms')
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
      .send(newGym)
      .expect(400);
  });
});

describe('Deleting a gym', () => {
  test('succeeds with a valid id', async () => {
    const startResponse = await request(app)
      .get('/api/gyms');

    expect(startResponse.body).toHaveLength(initialGymCount);

    const gymToDelete: FullGym | null = await Gym.findOne({ where: { name: 'Fitness24Seven Helsinki Punavuori' } });
    assert.isNotNull(gymToDelete);

    await request(app)
      .delete(`/api/gyms/${gymToDelete.id}`)
      .expect(204);

    const endResponse = await request(app)
      .get('/api/gyms');

    expect(endResponse.body).toHaveLength(initialGymCount - 1);
  });

  test('fails with an invalid id', async () => {
    await request(app)
      .delete('/api/gyms/blink-fitness')
      .expect(404);
  });
});