import { z } from 'zod';

import { GymSchema } from './schemas';

export type Gym = z.infer<typeof GymSchema>;