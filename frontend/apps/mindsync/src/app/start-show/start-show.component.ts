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
import { SharedTableData } from 'libs/shared/src/lib/models/shared-table-data.model';
import { UserAnswer } from '../../../../../libs/shared/src/lib/models/chart-data.model';

@Component({
  selector: 'project-start-show',
  templateUrl: './start-show.component.html',
  styleUrls: ['./start-show.component.scss'],
})
export class StartShowComponent implements OnInit {
  @ViewChild('cd') slide!: SlideComponent;
  currentSlideIndex = 0;
  currentSlide?: SlideModel;
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
    //this.openDialog();
    if (this.presentationId)
      this.listOfSlides$ = this.loadSlides(this.presentationId);
  }

  handleCountdownEnded(slide: SlideModel) {
    this.answersShowed = true;
    this.currentSlide = slide;
    //this.webSocketService.sendTimeEnded(slideId);
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
    const tableData: SharedTableData = {
      cols: [userAnswer.]
    }
    const chartData: ChartData = this.mapToChartData(userAnswer);
    this.dialog.open(StatisticsPopupComponent, { data: chartData });
  }

  private mapToSharedTableData(userOptions: SelectedOptionsMessageModel[]): SharedTableData[] {
    const results: SharedTableData[] = []
    userOptions.forEach(user => {
      const userPoints = this.countSlidePointsForUser(user.selectedOptions);
      const result: SharedTableData = {
        cols: [`${user.name} ${user.surname}`, userPoints[0], userPoints[1]]
      }
    })
  }

  private countSlidePointsForUser(selectedOptions: OptionModel[]): n[]{
    let correctAnswers = 0;
    let wrongAnswers = 0
    selectedOptions.forEach(opt => opt.isCorrect ? correctAnswers++ : wrongAnswers++);
    return [correctAnswers, wrongAnswers];
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
    /*
    const chartData: ChartData = {
      slideTitle: this.currentSlide?.title ?? '',
      answersCount: answersCount,
      allOptions: this.currentSlide?.options ?? [],
    };*/

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
    const chartData: ChartData = {
      slideTitle: 'dddddddddddd',
      answersCount: answersCount,
      allOptions: mockAllOptions,
    };

    return chartData;
  }

  private startCountdown(): void {
    this.slide.startCountdown();
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
