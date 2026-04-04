// work in progress

import { use, useState } from 'react';

import { redirect as tanstackRedirect } from '@tanstack/react-router';

import { AuthContext } from '../../utils/contexts';

import { Route } from '../../routes/(auth)/login';

export default function Login () {
  const auth = use(AuthContext);
  const { redirect } = Route.useSearch();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await auth.login(username, password);
      tanstackRedirect({ to: redirect });
    } catch {
      setError('Invalid username or password');
    } finally {
      setIsLoading(false);
    }
  };

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
          onSubmit={() => handleSubmit}
          className='flex flex-col items-center gap-3'
        >
          <div className='flex flex-col items-center'>
            <label htmlFor='username'>
              username
            </label>
            <input
              id='username'
              type='text'
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
              className='border'
              required
            />
          </div>

          <div className='flex flex-col items-center'>
            <label htmlFor='password'>
              password
            </label>
            <input
              id='password'
              type='password'
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              className='border'
              required
            />
          </div>

          <div className='flex flex-col items-center'>
            {error && (
              <div>
                {error}
              </div>
            )}

            <button
              type='submit'
              disabled={isLoading}
              className={`
                border
                ${error === ''
      ? 'mt-6'
      : ''}`}
            >
              {isLoading
                ? 'Logging in...'
                : 'Log in'}
            </button>
          </div>
        </form>
      </div>

      <div className='flex flex-col justify-center gap-3 p-3'>
        <button className='border'>
          Sign up
        </button>
        <button className='border'>
          Recover
        </button>
      </div>
    </div>
  );
}
