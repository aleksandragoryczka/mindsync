import { Component, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { CarouselSlideComponent } from '../carousel-slide.component';
import { Router } from '@angular/router';
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
import StringFormater from 'libs/shared/src/lib/utils/string-formater';
import { EditSlidePopupComponent } from './edit-slide-popup/edit-slide-popup.component';

@Component({
  selector: 'project-slide',
  templateUrl: './slide.component.html',
  styleUrls: ['./slide.component.scss'],
})
export class SlideComponent extends CarouselSlideComponent {
  slideTypes = SlideTypes;
  //@Input() data!: SlideModel;
  slides: any[] = [];
  slideActions: SharedTableDataFunc[] = [];
  constructor(
    private presentationService: PresentationService,
    private ngEl: ElementRef,
    private renderer: Renderer2,
    private dialog: MatDialog,
    private toastrService: ToastrService
  ) {
    super(ngEl, renderer);
    //console.log(this.data);
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.slides = this.data;
    //console.log(this.data.displayTime);
    //console.log(this.slides);

    this.slideActions = [
      {
        icon: 'timer',
        func: () => console.log(''),
        arg: '1',
        tooltip: `Time of display: ${this.data.displayTime}s`,
      },
      {
        icon: 'edit',
        func: (arg: string) => this.openEditSlidePopup(arg),
        arg: this.data.id,
        tooltip: TooltipTexts.edit,
      },
      {
        icon: 'delete',
        func: () => console.log(''),
        arg: '1',
        tooltip: TooltipTexts.delete,
      },
    ];
  }

  private openEditSlidePopup(id: string): void {
    const inputs: Record<string, InputPopupModel> = {
      ['title']: {
        value: this.data.title,
        type: 'text',
        placeholder: 'Slide title',
      },
      ['displayTime']: {
        value: this.data.displayTime,
        type: 'select',
        placeholder: 'Display time',
        selectOptions: StringFormater.generateListOfSelectedOptions(),
      },
      ['type']: {
        value: this.data.type,
        type: 'select',
        placeholder: 'Slide type',
        selectOptions: StringFormater.getTypesOfSlides(),
      },
    };
    const buttons: ButtonPopupModel[] = [
      {
        type: ButtonTypes.PRIMARY,
        text: 'Edit',
        onClick: () => this.updateSlide(inputs),
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
    };
    this.dialog.open(PopupWithInputsComponent, {
      data: fullPopupData,
    });
  }

  private updateSlide(inputs: Record<string, InputPopupModel>): void {
    console.log(inputs['type'].value);
    console.log(inputs['title'].value);
    console.log(inputs['displayTime'].value);
    const updatedSlide: SlideModel = {
      title: String(inputs['title'].value),
      displayTime: String(inputs['displayTime'].value),
      type: String(inputs['type'].value),
    };
    //if (updatedSlide.type === 'MULTIPLE_CHOICE') {
    //  this.dialog.open(PopupWithInputsComponent, { height: '500px' });
    // }
  }
}
