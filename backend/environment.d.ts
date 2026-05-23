import { Secret } from 'jsonwebtoken';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;
      JWT_ACCESS_SECRET: Secret;
      JWT_REFRESH_SECRET: Secret;
      TEST_DATABASE_URL: string;
      PORT?: number;
    }
  }
}

export { };
