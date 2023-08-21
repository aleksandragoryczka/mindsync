import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopupWithInputsComponent } from './popup-with-inputs/popup-with-inputs.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedCardComponent } from './shared-card/shared-card.component';
import { MatCardModule } from '@angular/material/card';
import { SharedTableComponent } from './shared-table/shared-table.component';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    MatDialogModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    NgbTooltipModule,
  ],
  declarations: [
    PopupWithInputsComponent,
    SharedCardComponent,
    SharedTableComponent,
  ],
  exports: [SharedCardComponent, SharedTableComponent],
})
export class UiModule {}
