import type { AppEnvironment } from './environment.types';

export const environment: AppEnvironment = {
  production: true,
  apiBaseUrl: 'http://localhost:3000/api/v1',
  canonicalOrigin: 'https://tinkerindex.io',
  noIndex: false,
};
