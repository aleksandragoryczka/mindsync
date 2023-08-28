import { Component, ElementRef, Renderer2 } from '@angular/core';
import { CarouselSlideComponent } from '../carousel-slide.component';
import { Router } from '@angular/router';
import { PresentationService } from 'libs/shared/src/lib/services/presentation.service';

@Component({
  selector: 'project-slide',
  templateUrl: './slide.component.html',
  styleUrls: ['./slide.component.scss'],
})
export class SlideComponent extends CarouselSlideComponent {
  constructor(
    private router: Router,
    private presentationService: PresentationService,
    private ngEl: ElementRef,
    renderer: Renderer2
  ) {
    super(ngEl, renderer);
  }
}
