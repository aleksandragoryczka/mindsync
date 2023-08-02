import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopupWithInputsComponent } from './popup-with-inputs/popup-with-inputs.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    MatDialogModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [PopupWithInputsComponent],
  exports: [],
})
export class UiModule {}
