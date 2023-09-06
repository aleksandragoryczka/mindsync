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
import { SelectedOptionsMessageModel } from 'libs/shared/src/lib/models/selected-options-message.model';
import {
  ChartData,
  UserAnswer,
} from 'libs/shared/src/lib/models/chart-data.model';
import { User } from 'libs/shared/src/lib/models/user.model';
import { StatisticsPopupComponent } from './statistics-popup/statistics-popup.component';
import { OptionModel } from 'libs/shared/src/lib/models/option.model';

@Component({
  selector: 'project-start-show',
  templateUrl: './start-show.component.html',
  styleUrls: ['./start-show.component.scss'],
})
export class StartShowComponent implements OnInit {
  @ViewChild('cd') slide!: SlideComponent;
  currentSlideIndex = 0;
  currentSlide?: SlideModel;
  listOfSlides: SlideModel[] = [];
  //slidesLength = 0;
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
    if (this.presentationId) this.loadSlides(this.presentationId);
  }

  nextSlide(): void {
    if (this.currentSlideIndex < this.listOfSlides.length - 1) {
      this.currentSlideIndex++;
      this.answersShowed = false;
    }
  }

  handleCountdownEnded(slide: SlideModel) {
    this.answersShowed = true;
    //this.currentSlide = slide;
    //this.webSocketService.sendTimeEnded(slid);
  }

  openStatisticsPopup(): void {
    //const userAnswer = this.webSocketService.userOptions;
    //const chartData = this.mapToChartData(this.webSocketService.userOptions);
    const userAnswer: SelectedOptionsMessageModel[] = [
      {
        name: 'John',
        surname: 'Doe',
        selectedOptions: [
          {
            id: '1',
            option: 'Option A',
            isCorrect: true,
          },
          {
            id: '2',
            option: 'Option B',
            isCorrect: false,
          },
        ],
      },
      {
        name: 'Alice',
        surname: 'Smith',
        selectedOptions: [
          {
            id: '1',
            option: 'Option A',
            isCorrect: true,
          },
          {
            id: '3',
            option: 'Option C',
            isCorrect: false,
          },
        ],
      },
    ];
    const chartData = this.mapToChartData(this.webSocketService.userOptions);
    //const chartData: ChartData = this.mapToChartData(userAnswer);

    this.dialog.open(StatisticsPopupComponent, {
      data: chartData,
    });
  }

  private mapToChartData(
    userOptions: SelectedOptionsMessageModel[]
  ): ChartData {
    const answersCount: UserAnswer[] = [];
    const optionMap: { [optionId: string]: UserAnswer } = {};

    for (const selectedOption of userOptions) {
      for (const option of selectedOption.selectedOptions) {
        if (option.id) {
          const optionId = option.id;
          if (!optionMap[optionId]) {
            optionMap[optionId] = {
              users: [],
              count: 0,
            };
          }
          const user: User = {
            name: selectedOption.name,
            surname: selectedOption.surname,
          };
          optionMap[optionId].users.push(user);
          optionMap[optionId].count++;
        }
      }
    }
    for (const optionId in optionMap) answersCount.push(optionMap[optionId]);

    const mockAllOptions: OptionModel[] = [
      {
        id: '1',
        option: 'Option A',
        isCorrect: true,
      },
      {
        id: '2',
        option: 'Option B',
        isCorrect: false,
      },
      {
        id: '3',
        option: 'Option C',
        isCorrect: false,
      },
      // Add more mock data as needed
    ];
    /*const chartData: ChartData = {
      slideTitle: 'dddddddddddd',
      answersCount: answersCount,
      allOptions: mockAllOptions,
    };*/
    const chartData: ChartData = {
      slideTitle: this.currentSlide?.title ?? '',
      answersCount: answersCount,
      allOptions: this.currentSlide?.options ?? [],
    };

    return chartData;
  }

  private startCountdown(): void {
    this.webSocketService.sendCurrentSlideMessage(
      this.listOfSlides[this.currentSlideIndex].id ?? ''
    );
    this.slide.startCountdown();
  }

  private openDialog(): void {
    const dialogRef = this.dialog.open(StartShowPopupComponent);
    dialogRef.afterClosed().subscribe(res => {
      this.attendeesNumber = res;
      this.startCountdown();
    });
  }

  private loadSlides(id: string): void {
    this.presentationService
      .getPresentationWithSlides(id)
      .pipe(
        tap((res: PresentationWithSlides) => {
          const presentation: PresentationModel = {
            title: res.title,
          };
          console.log(res.slides.length);
          //this.slidesLength = res.slides.length;
          this.presentation = presentation;
        }),
        map((res: PresentationWithSlides) => res.slides)
      )
      .subscribe((slides: SlideModel[]) => (this.listOfSlides = slides));
  }
}
