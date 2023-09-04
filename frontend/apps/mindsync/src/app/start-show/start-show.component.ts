import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { StartShowPopupComponent } from './start-show-popup/start-show-popup.component';
import { ActivatedRoute } from '@angular/router';
import { PresentationWithSlides } from 'libs/shared/src/lib/models/presentation-with-slides.model';
import { PresentationModel } from 'libs/shared/src/lib/models/presentation.model';
import { SlideModel } from 'libs/shared/src/lib/models/slide.model';
import { Observable, tap, map, EMPTY } from 'rxjs';
import { PresentationService } from 'libs/shared/src/lib/services/presentation.service';
import { CountdownComponent } from 'ngx-countdown';
import { SlideComponent } from 'libs/ui/src/lib/carousel-slide/slide/slide.component';
import { WebSocketService } from 'libs/shared/src/lib/services/web-socket.service';

@Component({
  selector: 'project-start-show',
  templateUrl: './start-show.component.html',
  styleUrls: ['./start-show.component.scss'],
})
export class StartShowComponent implements OnInit {
  @ViewChild('cd') slide!: SlideComponent;
  currentSlideIndex = 0;
  listOfSlides$: Observable<SlideModel[]> = EMPTY;
  attendeesNumber = 0;
  presentation: PresentationModel = { title: '' };
  answersShowed = false;
  presentationId = this.activatedRoute.snapshot.paramMap.get('id');

  constructor(
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private presentationService: PresentationService,
    private webSocketService: WebSocketService
  ) {}

  ngOnInit(): void {
    this.openDialog();
    if (this.presentationId)
      this.listOfSlides$ = this.loadSlides(this.presentationId);
  }

  private startCountdown(): void {
    this.slide.startCountdown();
  }

  handleCountdownEnded() {
    this.answersShowed = true;
  }

  private openDialog(): void {
    const dialogRef = this.dialog.open(StartShowPopupComponent);
    dialogRef.afterClosed().subscribe(res => {
      this.attendeesNumber = res;
      this.webSocketService.sendPushStartButtonMessage(true);
      this.startCountdown();
    });
  }

  private loadSlides(id: string): Observable<SlideModel[]> {
    return this.presentationService.getPresentationWithSlides(id).pipe(
      tap((res: PresentationWithSlides) => {
        const presentation: PresentationModel = {
          title: res.title,
        };
        this.presentation = presentation;
      }),
      map((res: PresentationWithSlides) => res.slides)
    );
  }
}
