import { AfterViewInit, Component, ElementRef, Renderer2 } from '@angular/core';
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
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import * as am4plugins_wordCloud from '@amcharts/amcharts4/plugins/wordCloud';

@Component({
  selector: 'project-slide',
  templateUrl: './slide.component.html',
  styleUrls: ['./slide.component.scss'],
})
export class SlideComponent
  extends CarouselSlideComponent
  implements AfterViewInit
{
  slideTypes = SlideTypes;
  slides: any[] = [];
  slideActions: SharedTableDataFunc[] = [];
  ColorFormatter = ColorFormatter;
  chart: am4plugins_wordCloud.WordCloud | undefined;

  constructor(
    private presentationService: PresentationService,
    private ngEl: ElementRef,
    private renderer: Renderer2,
    private dialog: MatDialog,
    private toastrService: ToastrService,
    private slideService: SlideService
  ) {
    super(ngEl, renderer);
  }

  ngAfterViewInit(): void {
    this.wordCloudSetup();
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
        func: (arg: string) => this.openDeleteSlidePopup(arg),
        arg: this.data.id,
        tooltip: TooltipTexts.delete,
      },
    ];

    const updateSuccessMessage = localStorage.getItem('Success-Message');
    if (updateSuccessMessage) {
      this.toastrService.success(updateSuccessMessage);
      localStorage.removeItem('Success-Message');
    }
  }

  private wordCloudSetup(): void {
    const newChart = am4core.create(
      `chartdiv-${this.data.id}`,
      am4plugins_wordCloud.WordCloud
    );
    const series = newChart.series.push(
      new am4plugins_wordCloud.WordCloudSeries()
    );

    series.accuracy = 4;
    series.labels.template.tooltipText = '{word}: {value}';
    series.fontFamily = 'Open Sans';
    series.minFontSize = 13;
    series.randomness = 0.5;
    const customColorsList = [am4core.color(this.data.titleColor)];
    series.colors = new am4core.ColorSet();
    series.colors.list = customColorsList;
    series.text = `Sed ut perspiciatis, unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa, quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt, explicabo. Nemo enim ipsam voluptatem, quia voluptas sit, aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos, qui ratione voluptatem sequi nesciunt, neque porro quisquam est, qui dolorem ipsum, quia dolor sit, amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt, ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit, qui in ea voluptate velit esse, quam nihil molestiae consequatur, vel illum, qui dolorem eum fugiat, quo voluptas nulla pariatur`;
    
    this.chart = newChart;
  }

  private deleteSlide(slideId: string) {
    this.slideService.deleteSlide(slideId).subscribe(isDeleted => {
      if (!isDeleted) this.toastrService.warning('Something went wrong');
      else {
        StorageRealod.reloadWithMessage(
          'Success-Message',
          'Slide deleted successfully'
        );
      }
    });
  }

  private openDeleteSlidePopup(slideId: string): void {
    const inputs: Record<string, InputPopupModel> = {};
    const buttons: ButtonPopupModel[] = [
      {
        type: ButtonTypes.PRIMARY,
        text: 'Yes',
        onClick: () => this.deleteSlide(slideId),
      },
      {
        type: ButtonTypes.SECONDARY,
        text: 'No',
      },
    ];
    const data: InputPopupFullDataModel = {
      title: 'Delete slide',
      description: 'Are you sure want to delete that slide?',
      inputs: inputs,
      buttons: buttons,
    };
    this.dialog.open(PopupWithInputsComponent, { data: data });
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
