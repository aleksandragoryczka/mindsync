import { Component, ElementRef, Input, Renderer2 } from '@angular/core';
import StringFormater from '../../../../../shared/src/lib/utils/string-formater';
import { Router } from '@angular/router';
import { CarouselSlideComponent } from '../carousel-slide.component';
import { PresentationModel } from 'libs/shared/src/lib/models/presentation.model';

@Component({
  selector: 'project-card-slide',
  templateUrl: './card-slide.component.html',
  styleUrls: ['./card-slide.component.scss'],
  //providers: [{provide: CarouselSlideComponent, useExisting: forwardRef(())}]
})
export class CardSlideComponent extends CarouselSlideComponent {
  //@Input() data!: PresentationModel;
  stringFormater = StringFormater;

  constructor(
    private router: Router,
    private ngEl: ElementRef,
    private renderer: Renderer2
  ) {
    super(ngEl, renderer);
    console.log(this.data);
  }

  async getDetailsButton(): Promise<void> {
    await this.router.navigate([`/presentation/${this.data.id}`]);
  }

  async getShowsButton() {
    await this.router.navigate([`/${this.data.id}/shows`], {
      queryParams: { title: this.data.title },
    });
  }
}
