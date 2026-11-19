import { Component, input } from '@angular/core';

@Component({
  selector: 'app-brand-spark',
  template: `
    <span class="brand-mark" [class.brand-mark--lg]="size() === 'lg'" aria-hidden="true">
      <svg viewBox="0 0 24 24" role="presentation" focusable="false">
        <path
          fill="currentColor"
          d="M12 2.5 13.7 9.1 20.5 11 13.7 12.9 12 19.5 10.3 12.9 3.5 11 10.3 9.1Z"
        />
      </svg>
    </span>
  `,
  styles: `
    :host {
      display: inline-flex;
    }

    .brand-mark--lg {
      width: 2.25rem;
      height: 2.25rem;
      border-radius: 0.55rem;
    }

    .brand-mark--lg svg {
      width: 1.1rem;
      height: 1.1rem;
    }
  `,
})
export class BrandSpark {
  readonly size = input<'sm' | 'lg'>('sm');
}
