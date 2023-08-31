import { Component, ElementRef, Renderer2 } from '@angular/core';
import { CarouselSlideComponent } from '../carousel-slide.component';
import { PresentationService } from 'libs/shared/src/lib/services/presentation.service';
import { SharedTableDataFunc } from 'libs/shared/src/lib/models/shared-table-data.model';
import { TooltipTexts } from '../../../../../shared/src/lib/models/enums/tooltips-texts.enum';
import { SlideTypes } from '../../../../../shared/src/lib/models/enums/slideTypes.enum';
import { SlideModel } from '../../../../../shared/src/lib/models/slide.model';
import {
  ButtonPopupModel,
  ButtonTypes,
  InputPopupFullDataModel,
  InputPopupModel,
} from 'libs/shared/src/lib/models/input-popup-data.model';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { PopupWithInputsComponent } from '../../popup-with-inputs/popup-with-inputs.component';
import StringFormatter from 'libs/shared/src/lib/utils/string-formatter';
import ColorFormatter from '../../../../../shared/src/lib/utils/color-formatter';
import { SlideService } from '../../../../../shared/src/lib/services/slide.service';
import StorageRealod from '../../../../../shared/src/lib/utils/storage-reload';
import { OptionModel } from 'libs/shared/src/lib/models/option.model';

@Component({
  selector: 'project-slide',
  templateUrl: './slide.component.html',
  styleUrls: ['./slide.component.scss'],
})
export class SlideComponent extends CarouselSlideComponent {
  slideTypes = SlideTypes;
  slides: any[] = [];
  slideActions: SharedTableDataFunc[] = [];
  ColorFormatter = ColorFormatter;

  constructor(
    private presentationService: PresentationService,
    private ngEl: ElementRef,
    private renderer: Renderer2,
    private dialog: MatDialog,
    private toastrService: ToastrService,
    private slideService: SlideService
  ) {
    super(ngEl, renderer);
    //console.log(this.data);
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.slides = this.data;
    this.slideActions = [
      {
        icon: 'timer',
        func: () => console.log(''),
        arg: '1',
        tooltip: `Time of display: ${this.data.displayTime}s`,
      },
      {
        icon: 'edit',
        func: (arg: OptionModel[]) => this.openEditSlidePopup(arg),
        arg: JSON.parse(JSON.stringify(this.data.options)),
        tooltip: TooltipTexts.edit,
      },
      {
        icon: 'delete',
        func: () => console.log(''),
        arg: '1',
        tooltip: TooltipTexts.delete,
      },
    ];

    const updateSuccessMessage = localStorage.getItem('Success-Message');
    if (updateSuccessMessage) {
      this.toastrService.success(updateSuccessMessage);
      localStorage.removeItem('Success-Message');
    }
  }

  private openEditSlidePopup(options: OptionModel[]): void {
    const inputs: Record<string, InputPopupModel> = {
      ['title']: {
        value: this.data.title,
        type: 'text',
        placeholder: 'Slide title',
      },
      ['headerColor']: {
        value: this.data.headerColor,
        type: 'color',
        placeholder: 'Main theme',
      },
      ['titleColor']: {
        value: this.data.titleColor,
        type: 'color',
        placeholder: 'Text color',
      },
      ['displayTime']: {
        value: this.data.displayTime,
        type: 'select',
        placeholder: 'Display time',
        selectOptions: StringFormatter.generateListOfSelectedOptions(),
      },
      ['type']: {
        value: this.data.type,
        type: 'select',
        placeholder: 'Slide type',
        selectOptions: StringFormatter.getTypesOfSlides(),
      },
    };
    const buttons: ButtonPopupModel[] = [
      {
        type: ButtonTypes.PRIMARY,
        text: 'Edit',
        onClick: () => this.updateSlide(inputs, options),
      },
      {
        type: ButtonTypes.SECONDARY,
        text: 'Cancel',
      },
    ];

    const fullPopupData: InputPopupFullDataModel = {
      title: 'Edit slide',
      description: '',
      inputs: inputs,
      buttons: buttons,
      options: options,
    };
    this.dialog.open(PopupWithInputsComponent, {
      data: fullPopupData,
    });
  }

  private updateSlide(
    inputs: Record<string, InputPopupModel>,
    options: OptionModel[]
  ): void {
    const updatedSlide: SlideModel = {
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
    console.log(updatedSlide.options);
    if (this.isSlideNotChanged(updatedSlide)) {
      this.toastrService.warning('You did not edit any data.');
      return;
    }
    if (this.isMultipleChoiceWithOptions(updatedSlide)) {
      this.toastrService.warning(
        'MULTIPLE_CHOICE type slide must have at least 2 non-blank options.'
      );
      return;
    }
    this.slideService.updateSlide(updatedSlide, this.data.id).subscribe(
      res => {
        if (res) {
          StorageRealod.reloadWithMessage(
            'Success-Message',
            'Slide updated successfully'
          );
        } else this.toastrService.error('Wrong current password.', 'Error');
      },
      error => {
        this.toastrService.error(
          'Error while updating slide. Try Again.',
          'Error'
        );
      }
    );
  }

  private isMultipleChoiceWithOptions(updatedSlide: SlideModel): boolean {
    if (
      updatedSlide.type === SlideTypes.MULTIPLE_CHOICE &&
      updatedSlide.options &&
      this.filterNonBlankOptions(updatedSlide.options)
    )
      return true;
    return false;
  }

  private filterNonBlankOptions(updatedArray: OptionModel[]) {
    const nonEmptyUpdatedArray = updatedArray.filter(
      value => value.option !== ''
    );
    if (nonEmptyUpdatedArray.length < 2) return true;
    return false;
  }

  private isSlideNotChanged(updatedSlide: SlideModel): boolean {
    const originalSlide = this.data;
    let val =
      updatedSlide.title === originalSlide.title &&
      updatedSlide.displayTime === originalSlide.displayTime &&
      updatedSlide.headerColor === originalSlide.headerColor &&
      updatedSlide.titleColor === originalSlide.titleColor &&
      updatedSlide.type === originalSlide.type;
    if (updatedSlide.options)
      val =
        val && this.areArrayEquals(updatedSlide.options, originalSlide.options);
    return val;
  }

  private areArrayEquals(
    updatedArray: OptionModel[],
    originalArray: OptionModel[]
  ): boolean {
    if (updatedArray.length < originalArray.length) return false;
    const nonEmptyUpdatedArray = updatedArray.filter(
      value => value.option !== ''
    );

    if (nonEmptyUpdatedArray.length !== originalArray.length) return false;

    return nonEmptyUpdatedArray.every(
      (value, index) => value === originalArray[index]
    );
  }
}
