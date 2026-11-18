export const CUSTOMER_ROLE = 'Customer';

export const CUSTOMER_LANDING_PATH = '/account';

export function getLandingPath(role) {
  if (role === CUSTOMER_ROLE) return CUSTOMER_LANDING_PATH;
  return '/';
}
