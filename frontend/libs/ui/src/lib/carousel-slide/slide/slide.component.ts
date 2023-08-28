import { Component, ElementRef, Renderer2 } from '@angular/core';
import { CarouselSlideComponent } from '../carousel-slide.component';
import { Router } from '@angular/router';
import { PresentationService } from 'libs/shared/src/lib/services/presentation.service';
import { SharedTableDataFunc } from 'libs/shared/src/lib/models/shared-table-data.model';
import { TooltipTexts } from '../../../../../shared/src/lib/models/enums/tooltips-texts.enum';
import { SlideTypes } from '../../../../../shared/src/lib/models/enums/slideTypes.enum';

@Component({
  selector: 'project-slide',
  templateUrl: './slide.component.html',
  styleUrls: ['./slide.component.scss'],
})
export class SlideComponent extends CarouselSlideComponent {
  slideTypes = SlideTypes;

  constructor(
    private router: Router,
    private presentationService: PresentationService,
    private ngEl: ElementRef,
    renderer: Renderer2
  ) {
    super(ngEl, renderer);
  }

  slideActions: SharedTableDataFunc[] = [
    {
      icon: 'timer',
      func: () => console.log(''),
      arg: '1',
      tooltip: 'Time of display: 30s',
    },
    {
      icon: 'edit',
      func: () => console.log(''),
      arg: '1',
      tooltip: TooltipTexts.edit,
    },
    {
      icon: 'delete',
      func: () => console.log(''),
      arg: '1',
      tooltip: TooltipTexts.delete,
    },
  ];
}
