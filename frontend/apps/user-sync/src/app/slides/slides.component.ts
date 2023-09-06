import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PresentationWithSlides } from 'libs/shared/src/lib/models/presentation-with-slides.model';
import { PresentationModel } from 'libs/shared/src/lib/models/presentation.model';
import { SlideModel } from 'libs/shared/src/lib/models/slide.model';
import { PresentationService } from 'libs/shared/src/lib/services/presentation.service';
import { Observable, EMPTY, map, tap } from 'rxjs';
import { WebSocketService } from '../../../../../libs/shared/src/lib/services/web-socket.service';
import { OptionModel } from 'libs/shared/src/lib/models/option.model';

@Component({
  selector: 'project-slides',
  templateUrl: './slides.component.html',
  styleUrls: ['./slides.component.scss'],
})
export class SlidesComponent implements OnInit {
  currentSlideIndex = 0;
  listOfSlides$: Observable<SlideModel[]> | null = null;
  presentation: PresentationModel = { title: '', code: '', createdAt: '' };
  presentationId = this.activatedRoute.snapshot.paramMap.get('id');
  slides: SlideModel[] = [];
  isStarted = false;
  isCountdownEnded = false;

  constructor(
    private presentationService: PresentationService,
    private activatedRoute: ActivatedRoute,
    public webSocketService: WebSocketService
  ) {}

  ngOnInit(): void {
    if (this.presentationId)
      this.listOfSlides$ = this.loadSlides(this.presentationId);
  }

  handleCountdownEnded(): void {
    this.isCountdownEnded = true;
    this.currentSlideIndex = this.webSocketService.currentSlideId ?? 0;
  }

  handleUserSelectedOptions(options: OptionModel[]): void {
    console.log('selected options: ' + options);
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
