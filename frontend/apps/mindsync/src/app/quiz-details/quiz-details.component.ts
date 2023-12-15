import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SlideModel } from 'libs/shared/src/lib/models/slide.model';
import { QuizService } from 'libs/shared/src/lib/services/quiz.service';
import { EMPTY, Observable, firstValueFrom, map, tap } from 'rxjs';
import { QuizModel } from '../../../../../libs/shared/src/lib/models/quiz.model';
import StringFormatter from '../../../../../libs/shared/src/lib/utils/string-formatter';
import { QuizWithSlides } from 'libs/shared/src/lib/models/quiz-with-slides.model';
import {
  ButtonPopupModel,
  ButtonTypes,
  InputPopupFullDataModel,
  InputPopupModel,
} from 'libs/shared/src/lib/models/input-popup-data.model';
import { PopupWithInputsComponent } from 'libs/ui/src/lib/popup-with-inputs/popup-with-inputs.component';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { SlideTypes } from 'libs/shared/src/lib/models/enums/slideTypes.enum';
import ColorFormatter from 'libs/shared/src/lib/utils/color-formatter';
import { OptionModel } from '../../../../../libs/shared/src/lib/models/option.model';
import StorageRealod from 'libs/shared/src/lib/utils/storage-reload';
import MultipleChoiceOptionsValidator from 'libs/shared/src/lib/utils/multiple-choice-options-validator';
import { ShowService } from 'libs/shared/src/lib/services/show.service';
import { SlideService } from 'libs/shared/src/lib/services/slide.service';

@Component({
  selector: 'project-quiz-details',
  templateUrl: './quiz-details.component.html',
  styleUrls: ['./quiz-details.component.scss'],
})
export class QuizDetailsComponent implements OnInit {
  defaultHedaerColor = '#538d22';
  defualtTitleColor = '#FFFFFF';
  defaultDisplayTime = '20';
  defaultType = SlideTypes.WORD_CLOUD;
  listOfSlides$: Observable<SlideModel[]> = EMPTY;
  quiz: QuizModel = { title: '', code: '', createdAt: '' };
  quizId = this.activatedRoute.snapshot.paramMap.get('id');
  slides: SlideModel[] = [];
  StringFormatter = StringFormatter;

  slideConfig = {
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    arrows: true,
    dots: true,
  };

  constructor(
    private activatedRoute: ActivatedRoute,
    private quizService: QuizService,
    private dialog: MatDialog,
    private toastrService: ToastrService,
    private router: Router,
    private slideService: SlideService,
    private showService: ShowService
  ) {
    if (this.quizId) {
      this.listOfSlides$ = this.loadSlides(this.quizId);
    }
  }

  ngOnInit(): void {
    const updateUserSuccessMessage = localStorage.getItem('Success-Message');
    if (updateUserSuccessMessage) {
      this.toastrService.success(updateUserSuccessMessage);
      localStorage.removeItem('Success-Message');
    }
  }

  openDeleteQuizPopup(): void {
    const inputs: Record<string, InputPopupModel> = {};
    const buttons: ButtonPopupModel[] = [
      {
        type: ButtonTypes.PRIMARY,
        text: 'Yes',
        onClick: () => this.deleteQuiz(),
      },
      {
        type: ButtonTypes.SECONDARY,
        text: 'No',
      },
    ];
    const data: InputPopupFullDataModel = {
      title: 'Delete quiz',
      description: 'Are you sure you want to delete that quiz?',
      inputs: inputs,
      buttons: buttons,
    };
    this.dialog.open(PopupWithInputsComponent, {
      data: data,
    });
  }

  openAddSlidePopup(): void {
    const inputs: Record<string, InputPopupModel> = {
      ['title']: {
        value: '',
        type: 'text',
        placeholder: 'Slide title',
      },
      ['headerColor']: {
        value: this.defaultHedaerColor,
        type: 'color',
        placeholder: 'Main theme',
      },
      ['titleColor']: {
        value: this.defualtTitleColor,
        type: 'color',
        placeholder: 'Text color',
      },
      ['displayTime']: {
        value: this.defaultDisplayTime,
        type: 'select',
        placeholder: 'Display time',
        selectOptions: StringFormatter.generateListOfSelectedOptions(),
      },
      ['type']: {
        value: this.defaultType,
        type: 'select',
        placeholder: 'Slide type',
        selectOptions: StringFormatter.getTypesOfSlides(),
      },
    };
    const options: OptionModel[] = [];
    const buttons: ButtonPopupModel[] = [
      {
        type: ButtonTypes.PRIMARY,
        text: 'Add',
        onClick: () => this.addSlide(inputs, options),
      },
      {
        type: ButtonTypes.SECONDARY,
        text: 'Cancel',
      },
    ];
    const data: InputPopupFullDataModel = {
      title: 'New slide',
      description: 'Fill basic data about new slide:',
      inputs: inputs,
      buttons: buttons,
      options: options,
    };
    this.dialog.open(PopupWithInputsComponent, { data: data });
  }

  async startShow() {
    const slides = await firstValueFrom(this.listOfSlides$);
    if (slides.length > 0) {
      await this.router.navigate([`/${this.quizId}/start-show`], {
        queryParams: { code: this.quiz.code },
      });
    } else {
      this.toastrService.warning(
        'You have to add at least one Slide to start a show.'
      );
    }
  }

  async getShowsButton() {
    if (this.quizId) {
      this.quizService.getQuizWithShows(this.quizId).subscribe(async res => {
        if (res.shows.totalElements > 0) {
          await this.router.navigate([`/${this.quizId}/shows`], {
            queryParams: { title: this.quiz.title },
          });
        } else {
          this.toastrService.warning(
            'There is no Shows connected with that Quiz'
          );
        }
      });
    }
  }

  private addSlide(
    inputs: Record<string, InputPopupModel>,
    options: OptionModel[]
  ): void {
    const newSlideRequest: SlideModel = {
      title: String(inputs['title'].value),
      headerColor: ColorFormatter.convertColors(
        String(inputs['headerColor'].value)
      ),
      titleColor: ColorFormatter.convertColors(
        String(inputs['titleColor'].value)
      ),
      displayTime: String(inputs['displayTime'].value),
      type: String(inputs['type'].value),
      options: options.filter(value => value.option != ''),
    };
    if (
      MultipleChoiceOptionsValidator.isMultipleChoiceWithOptions(
        newSlideRequest
      )
    ) {
      this.toastrService.warning(
        'MULTIPLE_CHOICE type slide must have at least 2 non-blank options.'
      );
      return;
    }
    if (this.quizId) {
      this.slideService
        .addSlide(newSlideRequest, this.quizId)
        .subscribe(isCreated => {
          if (isCreated)
            StorageRealod.reloadWithMessage(
              'Success-Message',
              'Slide created successfully'
            );
          else {
            this.toastrService.error('Something went wrong.');
          }
        });
    }
  }

  private deleteQuiz(): void {
    if (this.quizId) {
      this.quizService.deleteQuiz(this.quizId).subscribe(isDeleted => {
        if (isDeleted) {
          this.dialog.closeAll();
          this.router.navigateByUrl('/dashboard');
          this.toastrService.success('Quiz deleted successfully');
        } else this.toastrService.warning('Something went wrong');
      });
    }
  }

  private loadSlides(id: string): Observable<SlideModel[]> {
    return this.quizService.getQuizWithSlides(id).pipe(
      tap((res: QuizWithSlides) => {
        const quiz: QuizModel = {
          title: res.title,
          code: res.code,
          createdAt: res.createdAt,
        };
        this.quiz = quiz;
      }),
      map((res: QuizWithSlides) => res.slides)
    );
  }
}
