import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SlideModel } from 'libs/shared/src/lib/models/slide.model';
import { PresentationService } from 'libs/shared/src/lib/services/presentation.service';
import { EMPTY, Observable, map, tap } from 'rxjs';
import { PresentationModel } from '../../../../../libs/shared/src/lib/models/presentation.model';
import StringFormatter from '../../../../../libs/shared/src/lib/utils/string-formatter';
import { PresentationWithSlides } from 'libs/shared/src/lib/models/presentation-with-slides.model';

@Component({
  selector: 'project-presentation-details',
  templateUrl: './presentation-details.component.html',
  styleUrls: ['./presentation-details.component.scss'],
})
export class PresentationDetailsComponent {
  listOfSlides$: Observable<SlideModel[]> = EMPTY;
  presentation: PresentationModel = { title: '', code: '', createdAt: '' };
  slides: SlideModel[] = [];
  StringFormatter = StringFormatter;

  slideConfig = {
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    arrows: true,
    dots: true,
  };

  constructor(
    private activatedRoute: ActivatedRoute,
    private presentationService: PresentationService
  ) {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      this.listOfSlides$ = this.loadSlides('7'); //TODO: to be replaced with 'id'
      //console.log(this.listOfSlides$);
    }
  }

  private loadSlides(id: string): Observable<SlideModel[]> {
    return this.presentationService.getPresentationWithSlides(id).pipe(
      tap((res: PresentationWithSlides) => {
        const presentation: PresentationModel = {
          title: res.title,
          code: res.code,
          createdAt: res.createdAt,
        };
        this.presentation = presentation;
      }),
      map((res: PresentationWithSlides) => res.slides)
    );
  }
}
