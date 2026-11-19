import type { AppEnvironment } from './environment.types';

export const environment: AppEnvironment = {
  production: false,
  apiBaseUrl: 'http://localhost:3000/api/v1',
  canonicalOrigin: 'https://tinkerindex.io',
  noIndex: true,
};
