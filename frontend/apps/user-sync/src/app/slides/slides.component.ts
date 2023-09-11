import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PresentationWithSlides } from 'libs/shared/src/lib/models/presentation-with-slides.model';
import { PresentationModel } from 'libs/shared/src/lib/models/presentation.model';
import { SlideModel } from 'libs/shared/src/lib/models/slide.model';
import { PresentationService } from 'libs/shared/src/lib/services/presentation.service';
import { Observable, EMPTY, map, tap } from 'rxjs';
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
  presentation: PresentationModel = { title: '', code: '', createdAt: '' };
  presentationId = this.activatedRoute.snapshot.paramMap.get('id');
  listOfSlides: SlideModel[] = [];
  isCountdownEnded = false;

  constructor(
    private presentationService: PresentationService,
    private activatedRoute: ActivatedRoute,
    public webSocketService: WebSocketService,
    private dialog: MatDialog
  ) {}

  ngAfterViewInit(): void {
    this.openUserInputPopup(0);
  }

  ngOnInit(): void {
    if (this.presentationId) {
      this.loadSlides(this.presentationId);
    }
  }

  handleCountdownEnded(): void {
    this.isCountdownEnded = true;
  }

  sendUserAnswer(): void {
    const userAnswer: UserAnswerMessageModel = {
      name: this.activatedRoute.snapshot.queryParamMap.get('name') ?? '',
      surname: this.activatedRoute.snapshot.queryParamMap.get('surname') ?? '',
      answer: this.userAnswer,
    };
    console.log(userAnswer);
    this.webSocketService.sendUserAnswer(JSON.stringify(userAnswer));
  }

  openUserInputPopup(currentIndex: number): void {
    console.log(this.listOfSlides);
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
