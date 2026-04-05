// work in progress

import { use, useActionState } from 'react';

import { AuthContext } from '../../utils/contexts';

import { Route } from '../../routes/(auth)/login';

import { LoginRequestSchema } from '@strength-inventory/schemas';

export default function Login () {
  const auth = use(AuthContext);
  const { redirect } = Route.useSearch();
  const navigate = Route.useNavigate();

  const [state, submitAction, isPending] = useActionState(login, {
    success: false,
    error: null,
    enteredUsername: ''
  });

  interface State {
    success: boolean
    error: string | null
    enteredUsername: string
  }

  async function login (_previousState: State, formData: FormData) {
    const req = Object.fromEntries(formData.entries());

    try {
      const validatedReq = LoginRequestSchema.parse(req);
      await auth.login(validatedReq.username, validatedReq.password);
      return { success: true, error: null, enteredUsername: '' };
    } catch {
      return {
        success: false,
        error: 'Invalid username or password',
        enteredUsername: formData.get('username') as string
      };
    }
  }

  if (state.success) {
    navigate({ to: redirect, search: true }).catch((err: unknown) => {
      console.error('Redirect failed', err);
    });
  }

  console.log(redirect);
  return (
    <div
      className='
      flex flex-col self-center items-stretch mt-3 border
      bg-tertiary dark:bg-tertiary-dark w-85 md:w-135
      text-primary-text dark:text-primary-text-dark'
    >
      <div
        className='
        flex flex-col items-center
        bg-secondary dark:bg-secondary-dark p-3'
      >
        <form
          action={submitAction}
          className='flex flex-col items-center gap-3'
        >
          <div className='flex flex-col items-center'>
            <label htmlFor='username'>
              username
            </label>
            <input
              id='username'
              name='username'
              type='text'
              defaultValue={state.enteredUsername}
              className='border bg-background dark:bg-background-dark'
              required
            />
          </div>

          <div className='flex flex-col items-center'>
            <label htmlFor='password'>
              password
            </label>
            <input
              id='password'
              name='password'
              type='password'
              className='border bg-background dark:bg-background-dark'
              required
            />
          </div>

          <div className='flex flex-col items-center'>
            <div>
              {state.error}
            </div>

            <button
              type='submit'
              disabled={isPending}
              className={`
                border bg-primary w-30 cursor-pointer
                ${!state.error
      ? 'mt-6'
      : ''}`}
            >
              {isPending
                ? 'logging in...'
                : 'log in'}
            </button>
          </div>
        </form>
      </div>

      <div className='flex flex-col justify-center gap-3 p-3'>
        <button className='border bg-secondary cursor-pointer'>
          sign up
        </button>
        <button className='border bg-secondary cursor-pointer'>
          recover
        </button>
      </div>
    </div>
  );
}
