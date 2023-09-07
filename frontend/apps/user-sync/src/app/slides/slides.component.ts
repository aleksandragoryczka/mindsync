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
  presentation: PresentationModel = { title: '', code: '', createdAt: '' };
  presentationId = this.activatedRoute.snapshot.paramMap.get('id');
  listOfSlides: SlideModel[] = [];
  isCountdownEnded = false;

  constructor(
    private presentationService: PresentationService,
    private activatedRoute: ActivatedRoute,
    public webSocketService: WebSocketService
  ) {}
  ngOnInit(): void {
    console.log('this.presentationId: ' + this.presentationId);
    if (this.presentationId) {
      this.loadSlides(this.presentationId);
    }
  }

  handleCountdownEnded(): void {
    this.isCountdownEnded = true;
  }

  private loadSlides(id: string): void {
    this.presentationService
      .getPresentationWithSlides(id)
      .pipe(
        tap((res: PresentationWithSlides) => {
          const presentation: PresentationModel = {
            title: res.title,
          };
          this.presentation = presentation;
        }),
        map((res: PresentationWithSlides) => res.slides)
      )
      .subscribe((slides: SlideModel[]) => {
        this.listOfSlides = slides;
      });
  }
}
