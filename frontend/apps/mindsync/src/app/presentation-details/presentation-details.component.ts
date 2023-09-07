import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SlideModel } from 'libs/shared/src/lib/models/slide.model';
import { PresentationService } from 'libs/shared/src/lib/services/presentation.service';
import { EMPTY, Observable, map, tap } from 'rxjs';
import { PresentationModel } from '../../../../../libs/shared/src/lib/models/presentation.model';
import StringFormatter from '../../../../../libs/shared/src/lib/utils/string-formatter';
import { PresentationWithSlides } from 'libs/shared/src/lib/models/presentation-with-slides.model';
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
import { SlideService } from 'libs/shared/src/lib/services/slide.service';
import StorageRealod from 'libs/shared/src/lib/utils/storage-reload';

@Component({
  selector: 'project-presentation-details',
  templateUrl: './presentation-details.component.html',
  styleUrls: ['./presentation-details.component.scss'],
})
export class PresentationDetailsComponent implements OnInit {
  defaultHedaerColor = '#538d22';
  defualtTitleColor = '#FFFFFF';
  defaultDisplayTime = '20';
  defaultType = SlideTypes.WORD_CLOUD;
  listOfSlides$: Observable<SlideModel[]> = EMPTY;
  presentation: PresentationModel = { title: '', code: '', createdAt: '' };
  presentationId = this.activatedRoute.snapshot.paramMap.get('id');
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
    private presentationService: PresentationService,
    private dialog: MatDialog,
    private toastrService: ToastrService,
    private router: Router,
    private slideService: SlideService
  ) {
    if (this.presentationId) {
      this.listOfSlides$ = this.loadSlides(this.presentationId);
    }
  }

  ngOnInit(): void {
    const updateUserSuccessMessage = localStorage.getItem('Success-Message');
    if (updateUserSuccessMessage) {
      this.toastrService.success(updateUserSuccessMessage);
      localStorage.removeItem('Success-Message');
    }
  }

  openDeletePresentationPopup(): void {
    const inputs: Record<string, InputPopupModel> = {};
    const buttons: ButtonPopupModel[] = [
      {
        type: ButtonTypes.PRIMARY,
        text: 'Yes',
        onClick: () => this.deletePresentation(),
      },
      {
        type: ButtonTypes.SECONDARY,
        text: 'No',
      },
    ];
    const data: InputPopupFullDataModel = {
      title: 'Delete presentation',
      description: 'Are you sure you want to delete that presentation?',
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

  async getShowsButton() {
    await this.router.navigate([`/${this.presentationId}/shows`], {
      queryParams: { title: this.presentation.title },
    });
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
    if (this.presentationId) {
      this.slideService
        .addSlide(newSlideRequest, this.presentationId)
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

  private deletePresentation(): void {
    if (this.presentationId) {
      this.presentationService
        .deletePresentation(this.presentationId)
        .subscribe(isDeleted => {
          if (isDeleted) {
            this.dialog.closeAll();
            this.router.navigateByUrl('/dashboard');
            this.toastrService.success('Presentation deleted successfully');
          } else this.toastrService.warning('Something went wrong');
        });
    }
  }

  private loadSlides(id: string): Observable<SlideModel[]> {
    return this.presentationService.getPresentationWithSlides(id).pipe(
      tap((res: PresentationWithSlides) => {
        const presentation: PresentationModel = {
          title: res.title,
          code: res.code,
          createdAt: res.createdAt,
        };
        this.presentation = presentation;
      }),
      map((res: PresentationWithSlides) => res.slides)
    );
  }
}
