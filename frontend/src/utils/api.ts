import { z } from 'zod';

import syncToken from './syncToken';

import {
  type EquipmentPostAndPut,
  EquipmentSchema,
  GymEquipmentSchema,
  GymGetEquipmentSchema,
  GymGetSchema,
  type GymPost,
  GymSchema,
  MembershipSchema
} from '@strength-inventory/schemas';

export const baseUrl
  = import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/api`
    : '/api';

interface TokenValidationProps {
  refresh: () => Promise<string>
  logout: () => Promise<void>
}


// gyms

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

export const getGymEquipment = async ({ gymId }: { gymId: string }) => {
  const res = await fetch(`${baseUrl}/gyms/${gymId}/equipment`);
  if (!res.ok) {
    throw Error(`Response status: ${res.statusText}`);
  }

  const data: unknown = await res.json();
  const validatedData = z.array(GymGetEquipmentSchema).parse(data);
  return validatedData;
};

interface postGymProps extends TokenValidationProps {
  gym: GymPost
}

// input has been validated before this function is called
export const postGym = async ({ gym, refresh, logout }: postGymProps) => {
  /* only admins and managers have permission */
  const token = await syncToken({ refresh, logout });
  if (token) {
    const res = await fetch(`${baseUrl}/gyms`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `bearer ${token}`
      },
      body: JSON.stringify(gym),
      credentials: 'include'
    });

    if (!res.ok) {
      throw Error(`Response status: ${res.statusText}`);
    }

    const data: unknown = await res.json();
    const validatedData = GymSchema.parse(data);
    return validatedData;
  } else {
    throw Error('Login expired.');
  }
};

interface postGymEquipmentProps extends TokenValidationProps {
  gymId: string
  equipmentId: string
}

export const postGymEquipment = async (
  { gymId, equipmentId, refresh, logout }: postGymEquipmentProps
) => {
  /* only admins and managers have permission */
  const token = await syncToken({ refresh, logout });
  if (token) {
    const res = await fetch(`${baseUrl}/gyms/${gymId}/equipment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `bearer ${token}`
      },
      body: JSON.stringify({ equipmentId: equipmentId }),
      credentials: 'include'
    });

    if (!res.ok) {
      throw Error(`Response status: ${res.statusText}`);
    }

    const data: unknown = await res.json();
    const validatedData = z.object({
      gymId: z.uuidv4(), equipmentId: z.uuidv4()
    }).parse(data);
    return validatedData;
  } else {
    throw Error('Login expired.');
  }
};

interface putGymProps extends TokenValidationProps {
  id: string
  gym: GymPost
}

// input has been validated before this function is called
export const putGym
  = async ({ id, gym, refresh, logout }: putGymProps) => {
  /* only admins have permission */
    const token = await syncToken({ refresh, logout });
    if (token) {
      const res = await fetch(`${baseUrl}/gyms/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `bearer ${token}`
        },
        body: JSON.stringify(gym),
        credentials: 'include'
      });

      if (!res.ok) {
        throw Error(`Response status: ${res.statusText}`);
      }

      const data: unknown = await res.json();
      const validatedData = GymSchema.parse(data);
      return validatedData;
    } else {
      throw Error('Login expired.');
    }
  };

interface setEquipmentCountProps extends TokenValidationProps {
  relationshipId: string
  count: number
}

export const setGymEquipmentCount = async (
  { relationshipId, count, refresh, logout }: setEquipmentCountProps
) => {
  /* only admins and managers have permission */
  const token = await syncToken({ refresh, logout });
  if (token) {
    const res = await fetch(`${baseUrl}/gymequipment/${relationshipId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `bearer ${token}`
      },
      body: JSON.stringify({ count: count }),
      credentials: 'include'
    });

    if (!res.ok) {
      throw Error(`Response status: ${res.statusText}`);
    }

    const data: unknown = await res.json();
    const validatedData = GymEquipmentSchema.parse(data);
    return validatedData;
  } else {
    throw Error('Login expired.');
  }
};

interface deleteItemProps extends TokenValidationProps {
  id: string
}

export const deleteGym = async ({ id, refresh, logout }: deleteItemProps) => {
  /* only admins have permission */
  const token = await syncToken({ refresh, logout });
  if (token) {
    const res = await fetch(`${baseUrl}/gyms/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `bearer ${token}`
      },
      credentials: 'include'
    });

    if (!res.ok) {
      throw Error(`Response status: ${res.statusText}`);
    }
  } else {
    throw Error('Login expired.');
  }
};

interface deleteGymEquipmentProps extends TokenValidationProps {
  gymId: string
  equipmentId: string
}

export const deleteGymEquipment = async (
  { gymId, equipmentId, refresh, logout }: deleteGymEquipmentProps
) => {
  /* only admins and managers have permission */
  const token = await syncToken({ refresh, logout });
  if (token) {
    const res = await fetch(`${baseUrl}/gyms/${gymId}/equipment`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `bearer ${token}`
      },
      body: JSON.stringify({ equipmentId: equipmentId }),
      credentials: 'include'
    });

    if (!res.ok) {
      throw Error(`Response status: ${res.statusText}`);
    }

    const data: unknown = await res.json();
    const validatedData = z.object({
      gymId: z.uuidv4(), equipmentId: z.uuidv4()
    }).parse(data);
    return validatedData;
  } else {
    throw Error('Login expired.');
  }
};


// equipment

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

export const getPiece = async ({ id }: { id: string }) => {
  const res = await fetch(`${baseUrl}/equipment/${id}`);
  if (!res.ok) {
    throw Error(`Response status: ${res.statusText}`);
  }

  const data: unknown = await res.json();
  const validatedData = EquipmentSchema.parse(data);
  return validatedData;
};

interface postEquipmentProps extends TokenValidationProps {
  piece: EquipmentPostAndPut
}

// input has been validated before this function is called
export const postEquipment
  = async ({ piece, refresh, logout }: postEquipmentProps) => {
    /* only admins and managers have permission */
    const token = await syncToken({ refresh, logout });
    if (token) {
      const res = await fetch(`${baseUrl}/equipment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `bearer ${token}`
        },
        body: JSON.stringify(piece),
        credentials: 'include'
      });

      if (!res.ok) {
        throw Error(`Response status: ${res.statusText}`);
      }

      const data: unknown = await res.json();
      const validatedData = EquipmentSchema.parse(data);
      return validatedData;
    } else {
      throw Error('Login expired.');
    }
  };

interface putEquipmentProps extends TokenValidationProps {
  id: string
  piece: EquipmentPostAndPut
}

// input has been validated before this function is called
export const putEquipment
  = async ({ id, piece, refresh, logout }: putEquipmentProps) => {
    /* only admins have permission */
    const token = await syncToken({ refresh, logout });
    if (token) {
      const res = await fetch(`${baseUrl}/equipment/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `bearer ${token}`
        },
        body: JSON.stringify(piece),
        credentials: 'include'
      });

      if (!res.ok) {
        throw Error(`Response status: ${res.statusText}`);
      }

      const data: unknown = await res.json();
      const validatedData = EquipmentSchema.parse(data);
      return validatedData;
    } else {
      throw Error('Login expired.');
    }
  };

export const deleteEquipment
  = async ({ id, refresh, logout }: deleteItemProps) => {
    /* only admins have permission */
    const token = await syncToken({ refresh, logout });
    if (token) {
      const res = await fetch(`${baseUrl}/equipment/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `bearer ${token}`
        },
        credentials: 'include'
      });

      if (!res.ok) {
        throw Error(`Response status: ${res.statusText}`);
      }
    } else {
      throw Error('Login expired.');
    }
  };


// memberships

export const getMembershipsByCountry
  = async ({ country }: { country: string }) => {
    const res = await fetch(`${baseUrl}/memberships/${country}`);
    if (!res.ok) {
      throw Error(`Response status: ${res.statusText}`);
    }

    const data: unknown = await res.json();
    console.log('UNVALIDATED:', data);
    const validatedData = z.array(MembershipSchema).parse(data);
    console.log('VALIDATED:', validatedData);
    return validatedData;
  };
