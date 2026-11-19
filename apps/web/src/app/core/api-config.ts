import { InjectionToken } from '@angular/core';

import { environment } from './environment';

function readApiBaseUrlFromProcess(): string | undefined {
  const proc = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process;
  return proc?.env?.['API_BASE_URL']?.trim() || undefined;
}

export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL', {
  providedIn: 'root',
  factory: () => readApiBaseUrlFromProcess() || environment.apiBaseUrl,
});
