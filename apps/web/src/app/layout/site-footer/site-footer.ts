import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { BrandSpark } from '../../shared/ui/brand-spark/brand-spark';

@Component({
  selector: 'app-site-footer',
  imports: [RouterLink, BrandSpark],
  templateUrl: './site-footer.html',
  styleUrl: './site-footer.scss',
})
export class SiteFooter {
  readonly year = new Date().getFullYear();
}
