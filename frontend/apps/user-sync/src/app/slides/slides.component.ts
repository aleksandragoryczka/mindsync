import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QuizWithSlides } from 'libs/shared/src/lib/models/quiz-with-slides.model';
import { QuizModel } from 'libs/shared/src/lib/models/quiz.model';
import { SlideModel } from 'libs/shared/src/lib/models/slide.model';
import { QuizService } from 'libs/shared/src/lib/services/quiz.service';
import { Observable, EMPTY, map, tap, BehaviorSubject } from 'rxjs';
import { WebSocketService } from '../../../../../libs/shared/src/lib/services/web-socket.service';
import { OptionModel } from 'libs/shared/src/lib/models/option.model';
import {
  ButtonPopupModel,
  ButtonTypes,
  InputPopupFullDataModel,
  InputPopupModel,
} from 'libs/shared/src/lib/models/input-popup-data.model';
import { MatDialog } from '@angular/material/dialog';
import { PopupWithInputsComponent } from 'libs/ui/src/lib/popup-with-inputs/popup-with-inputs.component';
import {
  SelectedOptionsMessageModel,
  UserAnswerMessageModel,
} from 'libs/shared/src/lib/models/selected-options-message.model';

@Component({
  selector: 'project-slides',
  templateUrl: './slides.component.html',
  styleUrls: ['./slides.component.scss'],
})
export class SlidesComponent implements OnInit, AfterViewInit {
  userAnswer = '';
  quiz: QuizModel = { title: '', code: '', createdAt: '' };
  quizId = this.activatedRoute.snapshot.paramMap.get('id');
  listOfSlides: SlideModel[] = [];
  private isCountdownEndedSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  isCountdownEnded: Observable<boolean> =
    this.isCountdownEndedSubject.asObservable();

  constructor(
    private quizService: QuizService,
    private activatedRoute: ActivatedRoute,
    public webSocketService: WebSocketService,
    private dialog: MatDialog
  ) {}

  ngAfterViewInit(): void {
    this.openUserInputPopup(0);
  }

  ngOnInit(): void {
    if (this.quizId) {
      this.loadSlides(this.quizId);
    }
  }

  handleCountdownEnded(): void {
    this.isCountdownEndedSubject.next(true);
  }

  sendUserAnswer(): void {
    const userAnswer: UserAnswerMessageModel = {
      name: this.activatedRoute.snapshot.queryParamMap.get('name') ?? '',
      surname: this.activatedRoute.snapshot.queryParamMap.get('surname') ?? '',
      slideId:
        this.listOfSlides[this.webSocketService.currentSlideId.getValue()].id,
      answer: this.userAnswer,
    };
    this.webSocketService.sendMessage(
      '/app/send/user-answer',
      JSON.stringify(userAnswer)
    );
  }

  openUserInputPopup(currentIndex: number): void {
    const inputs: Record<string, InputPopupModel> = {
      ['answer']: {
        value: '',
        type: 'text',
        placeholder: 'Type your answer',
      },
    };
    const buttons: ButtonPopupModel[] = [
      {
        type: ButtonTypes.PRIMARY,
        text: 'Send answer',
        onClick: () => console.log(''),
      },
    ];
    const data: InputPopupFullDataModel = {
      title: this.listOfSlides[currentIndex].title,
      description: 'Answer question',
      inputs: inputs,
      buttons: buttons,
    };
    this.dialog.open(PopupWithInputsComponent, {
      data: data,
      disableClose: true,
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
      .subscribe((slides: SlideModel[]) => {
        this.listOfSlides = slides;
      });
  }
}
