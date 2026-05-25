import { jwtDecode } from 'jwt-decode';

export default function isTokenValid (token: string) {
  // exp is defined as the number of seconds since the epoch
  const decoded: { exp: number } = jwtDecode(token);
  const currentTime = Date.now() / 1000;

  /* token is considered valid when its expiry is at least
  5 seconds further from the epoch than the current time */
  return decoded.exp > currentTime + 5;
}
