import { ComponentFixture, TestBed } from '@angular/core/testing';
import type { ProjectListItem } from '@tinker-index/contracts';

import { ProjectCard } from './project-card';

const sampleProject: ProjectListItem = {
  slug: 'demo-led-shelf-lighting',
  title: 'LED Shelf Lighting',
  summary: 'Add warm under-shelf lighting with a simple LED strip kit.',
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
};

describe('ProjectCard', () => {
  let fixture: ComponentFixture<ProjectCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectCard],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectCard);
    fixture.componentRef.setInput('project', sampleProject);
    await fixture.whenStable();
  });

  it('renders title, summary, category, and demo badge', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.project-card__title')?.textContent).toContain('LED Shelf Lighting');
    expect(el.querySelector('.project-card__summary')?.textContent).toContain('under-shelf');
    expect(el.querySelector('.project-card__category')?.textContent).toContain('Electronics');
    expect(el.querySelector('.project-card__demo')?.textContent).toContain('Demo');
  });

  it('formats difficulty, cost, and duration as chips', () => {
    const el = fixture.nativeElement as HTMLElement;
    const chips = Array.from(el.querySelectorAll('.project-card__chips li')).map(
      (node) => node.textContent?.trim(),
    );
    expect(chips).toContain('Beginner');
    expect(chips).toContain('$24');
    expect(chips).toContain('1h 30m');
  });

  it('shows a visual placeholder when no image is present', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.project-card__media')).toBeTruthy();
    expect(el.querySelector('img')).toBeNull();
  });
});
