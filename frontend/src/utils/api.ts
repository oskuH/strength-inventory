import { z } from 'zod';

import {
  EquipmentSchema,
  GymEquipmentSchema,
  GymGetEquipmentSchema,
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

export const getGym = async ({ gymId }: { gymId: string }) => {
  const res = await fetch(`${baseUrl}/gyms/${gymId}`);
  if (!res.ok) {
    throw Error(`Response status: ${res.statusText}`);
  }

  const data: unknown = await res.json();
  const validatedData = GymGetSchema.parse(data);
  return validatedData;
};

export const getGymEquipment = async ({ gymId }: { gymId: string }) => {
  const res = await fetch(`${baseUrl}/gyms/${gymId}/equipment`);
  if (!res.ok) {
    throw Error(`Response status: ${res.statusText}`);
  }

  const data: unknown = await res.json();
  const validatedData = z.array(GymGetEquipmentSchema).parse(data);
  return validatedData;
};

// input has been validated before this function is called
export const postGym = async ({ gym }: { gym: GymPost }) => {
  /* only admins and managers have permission */
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

export const postGymEquipment = async (
  { gymId, equipmentId }: { gymId: string, equipmentId: string }
) => {
  /* only admins and managers have permission */
  const token = localStorage.getItem('auth-token');
  if (token) {
    const res = await fetch(`${baseUrl}/gyms/${gymId}/equipment`, {
      method: 'POST',
      headers: {
        Authorization: `bearer ${token}`
      },
      body: JSON.stringify({ equipmentId: equipmentId })
    });

    if (!res.ok) {
      throw Error(`Response status: ${res.statusText}`);
    }
  } else {
    throw Error('User authorization token missing.');
  }
};

// input has been validated before this function is called
export const putGym = async (
  { gymId, gym }: { gymId: string, gym: GymPost }
) => {
  /* only admins have permission */
  const token = localStorage.getItem('auth-token');
  if (token) {
    const res = await fetch(`${baseUrl}/gyms/${gymId}`, {
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

export const setGymEquipmentCount = async (
  { relationshipId, count }: { relationshipId: string, count: number }
) => {
  /* only admins and managers have permission */
  const token = localStorage.getItem('auth-token');
  if (token) {
    const res = await fetch(`${baseUrl}/gymequipment/${relationshipId}`, {
      method: 'PATCH',
      headers: {
        Authorization: `bearer ${token}`
      },
      body: JSON.stringify({ count: count })
    });

    if (!res.ok) {
      throw Error(`Response status: ${res.statusText}`);
    }

    const data: unknown = await res.json();
    const validatedData = GymEquipmentSchema.parse(data);
    return validatedData;
  } else {
    throw Error('User authorization token missing.');
  }
};

export const deleteGym = async ({ id }: { id: string }) => {
  /* only admins have permission */
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

export const getEquipment = async () => {
  const res = await fetch(`${baseUrl}/equipment`);
  if (!res.ok) {
    throw Error(`Response status: ${res.statusText}`);
  }

  const data: unknown = await res.json();
  const validatedData = z.array(EquipmentSchema).parse(data);
  return validatedData;
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
