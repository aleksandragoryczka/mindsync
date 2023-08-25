import {
  Component,
  ElementRef,
  Input,
  OnInit,
  Renderer2,
  forwardRef,
} from '@angular/core';
import { PresentationModel } from '../../../../../shared/src/lib/models/presentation.model';
import StringFormater from '../../../../../shared/src/lib/utils/string-formater';
import { Router } from '@angular/router';
import { PresentationService } from '../../../../../shared/src/lib/services/presentation.service';
import { CarouselSlideComponent } from '../carousel-slide.component';

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
    private presentationService: PresentationService,
    private ngEl: ElementRef,
    renderer: Renderer2
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
}
