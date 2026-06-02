import { z } from 'zod';

export default function handleSubmitError (err: unknown) {
  let errorMessage: string;
  if (err instanceof Error) {
    errorMessage = err.message;
  } else if (err instanceof z.ZodError) {
    const messages = err.issues.map((issue) => issue.message);
    console.error(messages);
    errorMessage = err.issues[0].message;
  } else {
    errorMessage = 'Unknown error!';
  }
  return {
    success: false,
    error: errorMessage
  };
}
