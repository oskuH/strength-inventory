import { z } from 'zod';

import {
  EquipmentSchema,
  GymGetSchema,
  type GymPost,
  GymSchema
} from '@strength-inventory/schemas';

export const baseUrl
  = import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/api`
    : '/api';

export const getGyms = async () => {
  const res = await fetch(`${baseUrl}/gyms`);
  if (!res.ok) {
    throw new Error(`Response status: ${res.statusText}`);
  }

  const data: unknown = await res.json();
  const validatedData = z.array(GymGetSchema).parse(data);
  return validatedData;
};

export const getGym = async ({ id }: { id: string }) => {
  const res = await fetch(`${baseUrl}/gyms/${id}`);
  if (!res.ok) {
    throw new Error(`Response status: ${res.statusText}`);
  }

  const data: unknown = await res.json();
  const validatedData = GymGetSchema.parse(data);
  return validatedData;
};

// input has been validated before this function is called
export const postGym = async ({ gym }: { gym: GymPost }) => {
  const token = localStorage.getItem('auth-token');
  if (token) {
    const res = await fetch(`${baseUrl}/gyms`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `bearer ${token}`
      },
      body: JSON.stringify(gym)
    });

    if (!res.ok) {
      throw new Error(`Response status: ${res.statusText}`);
    }

    const data: unknown = await res.json();
    const validatedData = GymSchema.parse(data);
    return validatedData;
  } else {
    throw new Error('User authorization token missing.');
  }
};

export const getGymsIdAndName = async () => {
  const res = await fetch(`${baseUrl}/gyms`);
  if (!res.ok) {
    throw new Error(`Response status: ${res.statusText}`);
  }

  const data: unknown = await res.json();
  const validatedData = z.array(GymGetSchema).parse(data);
  return validatedData.map(({ id, name }) => ({ id, name }));
};

export const getEquipmentIdAndName = async () => {
  const res = await fetch(`${baseUrl}/equipment`);
  if (!res.ok) {
    throw new Error(`Response status: ${res.statusText}`);
  }

  const data: unknown = await res.json();
  const validatedData = z.array(EquipmentSchema).parse(data);
  return validatedData.map(({ id, name }) => ({ id, name }));
};
