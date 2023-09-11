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
  currentSlideIndex = 0;
  //currentSlide?: SlideModel;
  listOfSlides: SlideModel[] = [];
  //slidesLength = 0;
  attendeesNumber = 0;
  presentation: PresentationModel = { title: '' };
  answersShowed = false;
  isMultipleChoice = false;
  presentationId = this.activatedRoute.snapshot.paramMap.get('id');

  constructor(
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private presentationService: PresentationService,
    private webSocketService: WebSocketService
  ) {}

  ngOnInit(): void {
    this.openDialog();
    if (this.presentationId) {
      this.loadSlides(this.presentationId);
    }
  }

  nextSlide(): void {
    if (this.currentSlideIndex < this.listOfSlides.length - 1) {
      this.webSocketService.sendCurrentSlideIndexMessage(
        this.currentSlideIndex + 1
      );
      this.answersShowed = false;
      this.currentSlideIndex++;
    }
  }

  handleCountdownEnded(slide: SlideModel) {
    this.answersShowed = true;
    slide.type === 'WORD_CLOUD'
      ? (this.isMultipleChoice = false)
      : (this.isMultipleChoice = true);
  }

  openStatisticsPopup(): void {
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
    userSelectedOptions: SelectedOptionsMessageModel[]
  ): ChartData {
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
    const answersCount: UserAnswer[] = [];
    const optionMap: { [optionId: string]: UserAnswer } = {};
    this.listOfSlides[this.currentSlideIndex].options?.forEach(option => {
      //mockAllOptions.forEach(option => {
      if (option.id) {
        const optionId = option.id;
        if (!optionMap[optionId]) {
          optionMap[optionId] = {
            users: [],
            count: 0,
          };
        }
      }
    });
    userSelectedOptions.forEach(res => {
      if (res.selectedOptions)
        res.selectedOptions.forEach(opt => {
          if (opt.id) {
            const optionId = opt.id;
            if (optionMap[optionId]) {
              const user: User = {
                name: res.name,
                surname: res.surname,
              };
              optionMap[optionId].users.push(user);
              optionMap[optionId].count++;
            }
          }
        });
    });
    /*for (const selectedOption of userOptions) {
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
    }*/
    for (const optionId in optionMap) answersCount.push(optionMap[optionId]);
    /*
    const chartData: ChartData = {
      slideTitle: 'dddddddddddd',
      answersCount: answersCount,
      allOptions: mockAllOptions,
    };*/

    const chartData: ChartData = {
      slideTitle: this.listOfSlides[this.currentSlideIndex].title ?? '',
      answersCount: answersCount,
      allOptions: this.listOfSlides[this.currentSlideIndex].options ?? [],
    };

    return chartData;
  }

  private openDialog(): void {
    const dialogRef = this.dialog.open(StartShowPopupComponent, {
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
      this.attendeesNumber = res;
      this.webSocketService.sendPushStartButtonMessage(true);
      //this.webSocketService.sendCurrentSlideMessage(this.currentSlideIndex);
      this.webSocketService.sendCurrentSlideIndexMessage(
        this.currentSlideIndex
      );
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
          //this.slidesLength = res.slides.length;
          this.presentation = presentation;
        }),
        map((res: PresentationWithSlides) => res.slides)
      )
      .subscribe((slides: SlideModel[]) => (this.listOfSlides = slides));
  }
}
