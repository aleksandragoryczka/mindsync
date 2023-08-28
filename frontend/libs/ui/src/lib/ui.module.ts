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
import { ViewDirective } from './view.directive';
import { CarouselSlideComponent } from './carousel-slide/carousel-slide.component';
import { CarouselDynamicElementComponent } from './shared-carousel/carousel-dynamic-element/carousel-dynamic-element.component';
import { CardSlideComponent } from './carousel-slide/card-slide/card-slide.component';
import { SlideComponent } from './carousel-slide/slide/slide.component';

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
})
export class UiModule {}
