import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopupWithInputsComponent } from './popup-with-inputs/popup-with-inputs.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { SharedTableComponent } from './shared-table/shared-table.component';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { SpinnerComponent } from './spinner/spinner.component';
import { SharedCarouselComponent } from './shared-carousel/shared-carousel.component';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { ViewDirective } from '../../../shared/src/lib/directive/view.directive';
import { CarouselSlideComponent } from './carousel-slide/carousel-slide.component';
import { CarouselDynamicElementComponent } from './shared-carousel/carousel-dynamic-element/carousel-dynamic-element.component';
import { CardSlideComponent } from './carousel-slide/card-slide/card-slide.component';
import { SlideComponent } from './carousel-slide/slide/slide.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxColorsModule } from 'ngx-colors';
import {
  CountdownConfig,
  CountdownGlobalConfig,
  CountdownModule,
} from 'ngx-countdown';

function countdownConfigFactory(): CountdownConfig {
  return { format: `ss` };
}

@NgModule({
  imports: [
    CommonModule,
    MatDialogModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    NgbTooltipModule,
    SlickCarouselModule,
    MatCheckboxModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    BrowserAnimationsModule,
    NgxColorsModule,
    CountdownModule,
  ],
  declarations: [
    PopupWithInputsComponent,
    CardSlideComponent,
    SharedTableComponent,
    SpinnerComponent,
    SharedCarouselComponent,
    CarouselDynamicElementComponent,
    ViewDirective,
    CarouselSlideComponent,
    SlideComponent,
  ],
  exports: [
    CardSlideComponent,
    SharedTableComponent,
    SpinnerComponent,
    SharedCarouselComponent,
    CarouselDynamicElementComponent,
    SlideComponent,
  ],
  providers: [
    { provide: CountdownGlobalConfig, useFactory: countdownConfigFactory },
  ],
})
export class UiModule {}
