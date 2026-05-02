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
    throw Error(`Response status: ${res.statusText}`);
  }

  const data: unknown = await res.json();
  const validatedData = z.array(GymGetSchema).parse(data);
  return validatedData;
};

export const getGymsIdAndName = async () => {
  const res = await fetch(`${baseUrl}/gyms`);
  if (!res.ok) {
    throw Error(`Response status: ${res.statusText}`);
  }

  const data: unknown = await res.json();
  const validatedData = z.array(GymGetSchema).parse(data);
  return validatedData.map(({ id, name }) => ({ id, name }));
};

export const getGym = async ({ id }: { id: string }) => {
  const res = await fetch(`${baseUrl}/gyms/${id}`);
  if (!res.ok) {
    throw Error(`Response status: ${res.statusText}`);
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
      throw Error(`Response status: ${res.statusText}`);
    }

    const data: unknown = await res.json();
    const validatedData = GymSchema.parse(data);
    return validatedData;
  } else {
    throw Error('User authorization token missing.');
  }
};

// input has been validated before this function is called
export const putGym = async ({ id, gym }: { id: string, gym: GymPost }) => {
  const token = localStorage.getItem('auth-token');
  if (token) {
    const res = await fetch(`${baseUrl}/gyms/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `bearer ${token}`
      },
      body: JSON.stringify(gym)
    });

    if (!res.ok) {
      throw Error(`Response status: ${res.statusText}`);
    }

    const data: unknown = await res.json();
    const validatedData = GymSchema.parse(data);
    return validatedData;
  } else {
    throw Error('User authorization token missing.');
  }
};

export const deleteGym = async ({ id }: { id: string }) => {
  const token = localStorage.getItem('auth-token');
  if (token) {
    const res = await fetch(`${baseUrl}/gyms/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `bearer ${token}`
      }
    });

    if (!res.ok) {
      throw Error(`Response status: ${res.statusText}`);
    }
  } else {
    throw Error('User authorization token missing.');
  }
};

export const getEquipmentIdAndName = async () => {
  const res = await fetch(`${baseUrl}/equipment`);
  if (!res.ok) {
    throw Error(`Response status: ${res.statusText}`);
  }

  const data: unknown = await res.json();
  const validatedData = z.array(EquipmentSchema).parse(data);
  return validatedData.map(({ id, name }) => ({ id, name }));
};

export const deleteEquipment = async ({ id }: { id: string }) => {
  const token = localStorage.getItem('auth-token');
  if (token) {
    const res = await fetch(`${baseUrl}/equipment/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `bearer ${token}`
      }
    });

    if (!res.ok) {
      throw Error(`Response status: ${res.statusText}`);
    }
  } else {
    throw Error('User authorization token missing.');
  }
};
