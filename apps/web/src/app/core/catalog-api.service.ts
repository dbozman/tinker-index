import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import type {
  CategorySummary,
  PaginatedResponse,
  ProjectListItem,
} from '@tinker-index/contracts';
import { Observable, catchError, throwError } from 'rxjs';

import { API_BASE_URL } from './api-config';

@Injectable({ providedIn: 'root' })
export class CatalogApiService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = inject(API_BASE_URL);

  listProjects(pageSize = 6): Observable<PaginatedResponse<ProjectListItem>> {
    return this.http
      .get<PaginatedResponse<ProjectListItem>>(`${this.apiBaseUrl}/projects`, {
        params: {
          page: '1',
          pageSize: String(pageSize),
          sort: 'publishedAt_desc',
        },
      })
      .pipe(catchError((error: unknown) => this.handleError(error)));
  }

  listCategories(): Observable<CategorySummary[]> {
    return this.http
      .get<CategorySummary[]>(`${this.apiBaseUrl}/categories`)
      .pipe(catchError((error: unknown) => this.handleError(error)));
  }

  private handleError(error: unknown): Observable<never> {
    if (error instanceof HttpErrorResponse) {
      const message =
        error.status === 0
          ? 'Unable to reach the catalog API. Is the API running?'
          : `Catalog request failed (${error.status}).`;
      return throwError(() => new Error(message));
    }

    return throwError(() =>
      error instanceof Error ? error : new Error('Unexpected catalog error.'),
    );
  }
}
