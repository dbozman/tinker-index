import { ComponentFixture, TestBed } from '@angular/core/testing';
import type { CategorySummary } from '@tinker-index/contracts';

import { CategoryCard } from './category-card';

const sampleCategory: CategorySummary = {
  slug: 'electronics',
  name: 'Electronics',
  description: 'Circuits, sensors, and embedded builds.',
  publishedProjectCount: 3,
};

describe('CategoryCard', () => {
  let fixture: ComponentFixture<CategoryCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryCard],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryCard);
    fixture.componentRef.setInput('category', sampleCategory);
    await fixture.whenStable();
  });

  it('renders name, description, and project count', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.category-card__title')?.textContent).toContain('Electronics');
    expect(el.querySelector('.category-card__description')?.textContent).toContain('Circuits');
    expect(el.querySelector('.category-card__count')?.textContent).toContain('3 projects');
  });
});
