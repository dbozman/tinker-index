import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { API_BASE_URL } from '../../core/api-config';
import { HomePage } from './home.page';

describe('HomePage', () => {
  let fixture: ComponentFixture<HomePage>;
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomePage],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_BASE_URL, useValue: 'http://localhost:3000/api/v1' },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  function flushCatalog(): void {
    http.expectOne((r) => r.url.includes('/projects')).flush({
      data: [
        {
          slug: 'demo-led-shelf-lighting',
          title: 'LED Shelf Lighting',
          summary: 'Warm under-shelf lighting.',
          category: { slug: 'electronics', name: 'Electronics' },
          tags: [],
          difficulty: { value: 'BEGINNER', provenance: 'SOURCE_VERIFIED' },
          estimatedCost: {
            value: { amountCents: 2400, currency: 'USD' },
            provenance: 'AI_ESTIMATED',
          },
          estimatedDuration: {
            value: { minutes: 90 },
            provenance: 'AI_ESTIMATED',
          },
          creator: null,
          sourceUrl: 'https://example.com',
          isDemo: true,
          publishedAt: '2026-01-01T00:00:00.000Z',
        },
      ],
      meta: { page: 1, pageSize: 6, totalItems: 1, totalPages: 1 },
    });

    http.expectOne((r) => r.url.includes('/categories')).flush([
      {
        slug: 'electronics',
        name: 'Electronics',
        description: 'Circuits and sensors.',
        publishedProjectCount: 3,
      },
    ]);
  }

  it('renders brand, tagline, and primary sections', async () => {
    fixture.detectChanges();
    flushCatalog();
    await fixture.whenStable();
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('h1')?.textContent).toContain('Discover your next');
    expect(el.querySelector('#featured')).toBeTruthy();
    expect(el.querySelector('#categories')).toBeTruthy();
    expect(el.textContent).toContain('Why Tinker Index?');
    expect(el.textContent).toContain('LED Shelf Lighting');
    expect(el.textContent).toContain('Electronics');
    expect(el.textContent).toContain('Get curious. Get building.');
  });

  it('shows an error state when the API fails', async () => {
    fixture.detectChanges();
    http.expectOne((r) => r.url.includes('/projects')).flush('down', {
      status: 500,
      statusText: 'Server Error',
    });
    http.expectOne((r) => r.url.includes('/categories')).flush([
      {
        slug: 'electronics',
        name: 'Electronics',
        description: 'Circuits and sensors.',
        publishedProjectCount: 3,
      },
    ]);
    await fixture.whenStable();
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.status-banner--error')?.textContent).toMatch(/failed|500/i);
    expect(el.textContent).toContain('Electronics');
  });
});
