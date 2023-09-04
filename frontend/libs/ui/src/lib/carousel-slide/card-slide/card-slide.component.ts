import { Component, ElementRef, Renderer2 } from '@angular/core';
import StringFormatter from '../../../../../shared/src/lib/utils/string-formatter';
import { Router } from '@angular/router';
import { CarouselSlideComponent } from '../carousel-slide.component';

@Component({
  selector: 'project-card-slide',
  templateUrl: './card-slide.component.html',
  styleUrls: ['./card-slide.component.scss'],
})
export class CardSlideComponent extends CarouselSlideComponent {
  StringFormatter = StringFormatter;

  constructor(
    private router: Router,
    private ngEl: ElementRef,
    private renderer: Renderer2
  ) {
    super(ngEl, renderer);
  }

  async getDetailsButton(): Promise<void> {
    await this.router.navigate([`/presentation/${this.data.id}`]);
  }

  async getShowsButton() {
    await this.router.navigate([`/${this.data.id}/shows`], {
      queryParams: { title: this.data.title },
    });
  }

  async startShow() {
    await this.router.navigate([`/${this.data.id}/start-show`], {
      queryParams: { code: this.data.code },
    });
  }
}
