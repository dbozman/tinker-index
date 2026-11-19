import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { SeoService } from '../../core/seo.service';

@Component({
  selector: 'app-about-page',
  imports: [RouterLink],
  templateUrl: './about.page.html',
  styleUrl: './about.page.scss',
})
export class AboutPage implements OnInit {
  private readonly seo = inject(SeoService);

  ngOnInit(): void {
    this.seo.apply({
      title: 'About — Tinker Index',
      description:
        'Tinker Index helps makers discover DIY projects matched to skills, tools, time, and budget—with credit to original creators.',
      path: '/about',
    });
  }
}
