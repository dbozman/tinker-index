import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { SiteHeader } from './site-header';

describe('SiteHeader', () => {
  let fixture: ComponentFixture<SiteHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SiteHeader],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(SiteHeader);
    await fixture.whenStable();
  });

  it('renders brand and primary navigation destinations', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.site-header__name')?.textContent).toContain('Tinker Index');
    expect(el.querySelector('a[href="/#featured"]')?.textContent).toContain('Discover');
    expect(el.querySelector('a[href="/#categories"]')?.textContent).toContain('Categories');
    expect(el.querySelector('a[href="/about"]')?.textContent).toContain('About');
  });

  it('toggles the mobile menu', () => {
    const el = fixture.nativeElement as HTMLElement;
    const toggle = el.querySelector('.site-header__toggle') as HTMLButtonElement;
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    toggle.click();
    fixture.detectChanges();
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    expect(el.querySelector('.site-header__nav--open')).toBeTruthy();
  });
});
