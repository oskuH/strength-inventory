declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;
      TEST_DATABASE_URL: string;
      PORT?: number;
      JWT_SECRET: string;
    }
  }
}

export {};