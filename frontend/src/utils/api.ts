import { GymSchema } from './schemas';

const baseUrl = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api';

export const getGyms = async () => {
  const res = await fetch(`${baseUrl}/gyms`);
  if (!res.ok) {
    throw new Error(`Response status: ${res.statusText}`);
  }

  const data: unknown = await res.json();

  const validatedData = GymSchema.parse(data);

  return validatedData;
};