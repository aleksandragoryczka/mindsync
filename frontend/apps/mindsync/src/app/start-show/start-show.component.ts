import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { StartShowPopupComponent } from './start-show-popup/start-show-popup.component';
import { ActivatedRoute } from '@angular/router';
import { PresentationWithSlides } from 'libs/shared/src/lib/models/presentation-with-slides.model';
import { PresentationModel } from 'libs/shared/src/lib/models/presentation.model';
import { SlideModel } from 'libs/shared/src/lib/models/slide.model';
import { Observable, tap, map, EMPTY } from 'rxjs';
import { PresentationService } from 'libs/shared/src/lib/services/presentation.service';

@Component({
  selector: 'project-start-show',
  templateUrl: './start-show.component.html',
  styleUrls: ['./start-show.component.scss'],
})
export class StartShowComponent implements OnInit {
  currentSlideIndex = 0;
  listOfSlides$: Observable<SlideModel[]> = EMPTY;
  attendeesNumber = 0;
  presentation: PresentationModel = { title: '' };
  answersShowed = false;
  presentationId = this.activatedRoute.snapshot.paramMap.get('id');

  constructor(
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private presentationService: PresentationService
  ) {
    console.log('tuaj: ' + this.presentationId);
    //if (this.presentationId)
    // this.listOfSlides$ = this.loadSlides(this.presentationId);
  }

  ngOnInit(): void {
    //this.openDialog();
    if (this.presentationId)
      this.listOfSlides$ = this.loadSlides(this.presentationId);
  }

  nextSlide(): void {
    console.log('f');
  }

  handleCountdownEnded() {
    this.answersShowed = true;
    console.log('counting completed');
  }

  private openDialog(): void {
    const dialogRef = this.dialog.open(StartShowPopupComponent);
    dialogRef.afterClosed().subscribe(res => {
      this.attendeesNumber = res;
      if (this.presentationId) {
        this.listOfSlides$ = this.loadSlides(this.presentationId);
      }
      console.log(this.listOfSlides$);
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
