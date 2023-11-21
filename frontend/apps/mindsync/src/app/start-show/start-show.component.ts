import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { StartShowPopupComponent } from './start-show-popup/start-show-popup.component';
import { ActivatedRoute, Router } from '@angular/router';
import { QuizWithSlides } from 'libs/shared/src/lib/models/quiz-with-slides.model';
import { QuizModel } from 'libs/shared/src/lib/models/quiz.model';
import { SlideModel } from 'libs/shared/src/lib/models/slide.model';
import { tap, map } from 'rxjs';
import { WebSocketService } from 'libs/shared/src/lib/services/web-socket.service';
import { SelectedOptionsMessageModel } from 'libs/shared/src/lib/models/selected-options-message.model';
import {
  ChartData,
  UserAnswer,
} from 'libs/shared/src/lib/models/chart-data.model';
import { User } from 'libs/shared/src/lib/models/user.model';
import { StatisticsPopupComponent } from './statistics-popup/statistics-popup.component';
import { ToastrService } from 'ngx-toastr';
import * as XLSX from 'xlsx';
import {
  AttendeeInformation,
  SlideStatistics,
  Summary,
} from '../../../../../libs/shared/src/lib/models/excel.model';
import { ShowService } from '../../../../../libs/shared/src/lib/services/show.service';
import { UserAnswerMessageModel } from '../../../../../libs/shared/src/lib/models/selected-options-message.model';
import { formatDate } from '@angular/common';
import html2canvas from 'html2canvas';
import { QuizService } from 'libs/shared/src/lib/services/quiz.service';

@Component({
  selector: 'project-start-show',
  templateUrl: './start-show.component.html',
  styleUrls: ['./start-show.component.scss'],
})
export class StartShowComponent implements OnInit {
  currentSlideIndex = 0;
  listOfSlides: SlideModel[] = [];
  attendeesNumber = 0;
  quiz: QuizModel = { title: '' };
  answersShowed = false;
  isMultipleChoice = false;
  quizId = this.activatedRoute.snapshot.paramMap.get('id');
  slideScreenshots: Blob[] = [];

  constructor(
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private quizService: QuizService,
    private webSocketService: WebSocketService,
    private router: Router,
    private toastrService: ToastrService,
    private showService: ShowService
  ) {}

  ngOnInit(): void {
    this.openDialog();
    if (this.quizId) {
      this.loadSlides(this.quizId);
    }
  }

  nextSlide(): void {
    if (this.currentSlideIndex < this.listOfSlides.length - 1) {
      this.addScreenshotToList();
      this.webSocketService.sendMessage(
        '/app/send/current-slide',
        this.currentSlideIndex + 1
      );
      this.answersShowed = false;
      this.currentSlideIndex++;
    }
  }

  async finishShow() {
    await this.addScreenshotToList().then(() => {
      const excelFormData: FormData = this.generateExcel();
      excelFormData.append(
        'attendeesNumber',
        String(this.webSocketService.attendees.length)
      );
      this.slideScreenshots.forEach(screenshot =>
        excelFormData.append('screenshots', screenshot)
      );
      if (this.quizId)
        this.showService
          .addShow(excelFormData, this.quizId)
          .subscribe(async isAdded => {
            if (isAdded) {
              await this.router.navigate(['/dashboard']);
              this.toastrService.success(
                'Slides show completed. Please navigate to "Shows" to see details.'
              );
            }
          });
    });
  }

  handleCountdownEnded(slide: SlideModel) {
    this.answersShowed = true;
    slide.type === 'WORD_CLOUD'
      ? (this.isMultipleChoice = false)
      : (this.isMultipleChoice = true);
  }

  generateExcel(): FormData {
    const showDetailsJson = this.mapShowDetailsToExcel();
    const wsSummary: XLSX.WorkSheet = XLSX.utils.json_to_sheet([
      showDetailsJson[0],
    ]);
    const wsAttendeeInformation: XLSX.WorkSheet = XLSX.utils.json_to_sheet(
      showDetailsJson[1]
    );
    const wsSlideStatistics: XLSX.WorkSheet = XLSX.utils.json_to_sheet(
      showDetailsJson[2]
    );
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, wsSummary, 'Summary');
    XLSX.utils.book_append_sheet(
      wb,
      wsAttendeeInformation,
      'Attendee Information'
    );
    XLSX.utils.book_append_sheet(wb, wsSlideStatistics, 'Slide Statistics');
    const excelBuffer = XLSX.write(wb, {
      bookType: 'xlsx',
      type: 'array',
    });
    const formData = new FormData();
    formData.append(
      'excelFile',
      new Blob([excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })
    );
    return formData;
  }

  openStatisticsPopup(): void {
    const chartData = this.mapToChartData(this.webSocketService.userOptions);
    this.dialog.open(StatisticsPopupComponent, {
      data: chartData,
    });
  }

  private async addScreenshotToList(): Promise<void> {
    const currentSlide = this.listOfSlides[this.currentSlideIndex];
    if (currentSlide.type === 'MULTIPLE_CHOICE') {
      await this.captureStatisticsScreenshot().then(screenshot =>
        this.slideScreenshots.push(screenshot)
      );
    } else if (currentSlide.type === 'WORD_CLOUD') {
      await this.captureWordcloudScreenshot().then(screenshot =>
        this.slideScreenshots.push(screenshot)
      );
    }
  }

  private captureWordcloudScreenshot(): Promise<Blob> {
    return new Promise<Blob>(resolve => {
      const wordcloudContent = document.querySelector(
        '.wordcloudSlide'
      ) as HTMLElement;
      this.captureScreenshot(wordcloudContent).then(screenshot =>
        resolve(screenshot)
      );
    });
  }

  private captureStatisticsScreenshot(): Promise<Blob> {
    const chartData = this.mapToChartData(this.webSocketService.userOptions);
    const dialgoRef = this.dialog.open(StatisticsPopupComponent, {
      data: chartData,
      position: { top: '-9999px', left: '-9999px' },
      hasBackdrop: false,
    });

    return new Promise<Blob>(resolve => {
      dialgoRef.afterOpened().subscribe(() => {
        const dialogContent = document.querySelector('.chart') as HTMLElement;
        this.captureScreenshot(dialogContent).then(screenshot => {
          dialgoRef.close();
          resolve(screenshot);
        });
      });
    });
  }

  private captureScreenshot(element: HTMLElement) {
    return html2canvas(element).then(canvas => {
      return new Promise<Blob>(resolve => {
        canvas.toBlob(blob => {
          if (blob) {
            resolve(blob);
          }
        }, 'image/png');
      });
    });
  }

  private mapShowDetailsToExcel(): any[] {
    const attendeesNumber = this.webSocketService.attendees.length;
    const summary: Summary = {
      quizTitle: this.quiz.title,
      showTime: formatDate(new Date(), 'dd-MM-yyyy hh:mm:ss', 'en-US'),
      attendeeNumber: attendeesNumber,
    };

    const attendeeInformations: AttendeeInformation[] = [];
    for (let i = 0; i < attendeesNumber; i++) {
      const attendee: AttendeeInformation = {
        id: i + 1,
        name: this.webSocketService.attendees[i].name,
        surname: this.webSocketService.attendees[i].surname,
      };
      attendeeInformations.push(attendee);
    }

    const slidesStatistics: SlideStatistics[] = [];
    for (let i = 0; i < this.listOfSlides.length; i++) {
      const currentSlide: SlideModel = this.listOfSlides[i];
      const slide: SlideStatistics = {
        id: i + 1,
        title: currentSlide.title,
        displayTime: currentSlide.displayTime,
        slideType: currentSlide.type,
        wordcloudAnswers:
          currentSlide.type === 'WORD_CLOUD'
            ? this.generateWordCloudAnswer(currentSlide)
            : '',
        answersOptions:
          currentSlide.type === 'MULTIPLE_CHOICE'
            ? this.generateMultipleChoiceAnswers(currentSlide)
            : '',
        correctAnswers:
          currentSlide.type === 'MULTIPLE_CHOICE'
            ? this.generateCorrectAnwersList(currentSlide)
            : '',
      };
      slidesStatistics.push(slide);
    }
    return [summary, attendeeInformations, slidesStatistics];
  }

  private generateCorrectAnwersList(slide: SlideModel): string {
    const correctAnswers: string[] = [];
    slide.options?.forEach(opt => {
      if (opt.isCorrect) correctAnswers.push(opt.option);
    });
    return correctAnswers.join(',');
  }

  private generateMultipleChoiceAnswers(slide: SlideModel): string {
    const allAnswers: string[] = [];
    slide.options?.forEach(opt => {
      allAnswers.push(opt.option);
    });
    return allAnswers.join(',');
  }

  private generateWordCloudAnswer(slide: SlideModel): string {
    const wordcloudWords: string[] = [];
    this.webSocketService.userAnswers.subscribe(
      (res: UserAnswerMessageModel[]) => {
        res.forEach((answer: UserAnswerMessageModel) => {
          if (answer.slideId === String(slide.id))
            wordcloudWords.push(answer.answer);
        });
      }
    );
    return wordcloudWords.join(',');
  }

  private mapToChartData(
    userSelectedOptions: SelectedOptionsMessageModel[]
  ): ChartData {
    const answersCount: UserAnswer[] = [];
    const optionMap: { [optionId: string]: UserAnswer } = {};
    this.listOfSlides[this.currentSlideIndex].options?.forEach(option => {
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
    for (const optionId in optionMap) answersCount.push(optionMap[optionId]);

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
      this.webSocketService.sendMessage(
        '/app/send/current-slide',
        this.currentSlideIndex
      );
    });
  }

  private loadSlides(id: string): void {
    this.quizService
      .getQuizWithSlides(id)
      .pipe(
        tap((res: QuizWithSlides) => {
          const quiz: QuizModel = {
            title: res.title,
          };
          this.quiz = quiz;
        }),
        map((res: QuizWithSlides) => res.slides)
      )
      .subscribe((slides: SlideModel[]) => (this.listOfSlides = slides));
  }
}
