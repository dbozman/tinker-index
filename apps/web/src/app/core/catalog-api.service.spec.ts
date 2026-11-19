import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { API_BASE_URL } from './api-config';
import { CatalogApiService } from './catalog-api.service';

describe('CatalogApiService', () => {
  let service: CatalogApiService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_BASE_URL, useValue: 'http://localhost:3000/api/v1' },
      ],
    });

    service = TestBed.inject(CatalogApiService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  it('lists featured projects', () => {
    let received = false;
    service.listProjects(6).subscribe((response) => {
      received = true;
      expect(response.data).toHaveLength(1);
      expect(response.meta.totalItems).toBe(1);
    });

    const req = http.expectOne(
      (r) =>
        r.url === 'http://localhost:3000/api/v1/projects' &&
        r.params.get('pageSize') === '6' &&
        r.params.get('sort') === 'publishedAt_desc',
    );
    expect(req.request.method).toBe('GET');
    req.flush({
      data: [{ slug: 'demo-led-shelf-lighting' }],
      meta: { page: 1, pageSize: 6, totalItems: 1, totalPages: 1 },
    });
    expect(received).toBe(true);
  });

  it('lists categories', () => {
    service.listCategories().subscribe((categories) => {
      expect(categories[0]?.slug).toBe('electronics');
    });

    const req = http.expectOne('http://localhost:3000/api/v1/categories');
    req.flush([{ slug: 'electronics', name: 'Electronics', description: null, publishedProjectCount: 3 }]);
  });

  it('maps HTTP failures to readable errors', () => {
    let message = '';
    service.listCategories().subscribe({
      error: (err: Error) => {
        message = err.message;
      },
    });

    const req = http.expectOne('http://localhost:3000/api/v1/categories');
    req.flush('nope', { status: 500, statusText: 'Server Error' });
    expect(message).toContain('500');
  });
});
