import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PresentationWithSlides } from 'libs/shared/src/lib/models/presentation-with-slides.model';
import { PresentationModel } from 'libs/shared/src/lib/models/presentation.model';
import { SlideModel } from 'libs/shared/src/lib/models/slide.model';
import { PresentationService } from 'libs/shared/src/lib/services/presentation.service';
import { Observable, EMPTY, map, tap } from 'rxjs';

@Component({
  selector: 'project-slides',
  templateUrl: './slides.component.html',
  styleUrls: ['./slides.component.scss'],
})
export class SlidesComponent {
  listOfSlides$: Observable<SlideModel[]> = EMPTY;
  presentation: PresentationModel = { title: '', code: '', createdAt: '' };
  presentationId = this.activatedRoute.snapshot.paramMap.get('id');
  slides: SlideModel[] = [];

  constructor(
    private presentationService: PresentationService,
    private activatedRoute: ActivatedRoute
  ) {
    //if (this.presentationId)
      //this.listOfSlides$ = this.loadSlides(this.presentationId);
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
