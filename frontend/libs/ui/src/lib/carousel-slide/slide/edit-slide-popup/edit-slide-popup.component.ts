import { Component, Inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SlideTypes } from 'libs/shared/src/lib/models/enums/slideTypes.enum';
import {
  InputPopupFullDataModel,
  InputPopupModel,
} from 'libs/shared/src/lib/models/input-popup-data.model';

@Component({
  selector: 'project-edit-slide-popup',
  templateUrl: './edit-slide-popup.component.html',
  styleUrls: ['./edit-slide-popup.component.scss'],
})
export class EditSlidePopupComponent implements OnInit {
  showExtraFields: Record<string, boolean> = {};
  form: FormGroup = new FormGroup({});

  constructor(
    public dialogRef: MatDialogRef<EditSlidePopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: InputPopupFullDataModel,
    private formBuilder: FormBuilder
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    console.log(this.data.inputs);
  }

  closePopup(): void {
    this.dialogRef.close();
  }

  getRecordValues(
    record: Record<string, InputPopupModel>
  ): [string, InputPopupModel][] {
    return Object.entries(record);
  }

  changeType(key: string) {
    const selectedOption = this.data.inputs[key].value;
    this.showExtraFields[key] = selectedOption === SlideTypes.MULTIPLE_CHOICE;
  }

  onSubmitForm() {
    console.log('f');
  }

  private initForm(): void {
    const formControls: Record<string, AbstractControl> = {};
    for (const input of this.getRecordValues(this.data.inputs)) {
      formControls[input[0]] = new FormControl(
        input[1].value,
        Validators.required
      );
    }
    this.form = this.formBuilder.group(formControls);
  }
}
