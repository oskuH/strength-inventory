import { z } from 'zod';

const TimeSchema = z.number().min(0).max(24).optional();

export const HoursSchema = z.object({
  MO: TimeSchema,
  TU: TimeSchema,
  WE: TimeSchema,
  TH: TimeSchema,
  FR: TimeSchema,
  SA: TimeSchema,
  SU: TimeSchema
});

export const GymSchema = z.object({
  id: z.uuidv4(),
  name: z.string(),
  chain: z.string().optional(),
  street: z.string(),
  streetNumber: z.string(),
  city: z.string(),
  notes: z.string().optional(),
  openingHours: HoursSchema,
  closingHours: HoursSchema
});