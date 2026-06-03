// console.logs temporarily for debugging purposes

import { jwtDecode } from 'jwt-decode';

export function isTokenValid (token: string) {
  // exp is defined as the number of seconds since the epoch
  const decoded: { exp: number } = jwtDecode(token);
  const currentTime = Date.now() / 1000;

  console.log('checking token validity...');
  console.log('decoded:', decoded.exp);
  console.log('currentTime:', currentTime);

  /* token is considered valid when its expiry is at least
  5 seconds further from the epoch than the current time */
  return decoded.exp > currentTime + 5;
}

interface getTokenProps {
  refresh: () => Promise<string>
  logout: () => Promise<void>
}

export default async function syncToken ({ refresh, logout }: getTokenProps) {
  console.log('syncToken activated!');
  let accessToken = localStorage.getItem('auth-token');
  console.log('current accessToken:', accessToken);
  /* Since the local storage is at the mercy of the user and their browser,
  isAuthenticated does not guarantee there being an access token. */
  if (!accessToken) {
    await logout();
    return;
  } else {
    if (!isTokenValid(accessToken)) {
      console.log('Token invalid!');
      try {
        accessToken = await refresh();
        // .refresh() throws if the refresh token has expired
      } catch (err) {
        if (err instanceof Error) {
          console.log(err.message);
        }
        await logout();
        return;
      }
    }

    console.log('Returning accessToken:', accessToken);
    return accessToken;
  }
}
