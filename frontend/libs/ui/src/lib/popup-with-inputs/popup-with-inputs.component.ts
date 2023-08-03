import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LoginModel } from '../../../../shared/src/lib/models/login.model';
import {
  ButtonPopupModel,
  ButtonTypes,
  InputPopupFullDataModel,
  InputPopupModel,
} from 'libs/shared/src/lib/models/input-popup-data.model';

@Component({
  selector: 'project-popup-with-inputs',
  templateUrl: './popup-with-inputs.component.html',
  styleUrls: ['./popup-with-inputs.component.scss'],
})
export class PopupWithInputsComponent {
  primary = ButtonTypes.PRIMARY;
  loginForm: FormGroup;
  registrationForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<PopupWithInputsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: InputPopupFullDataModel,
    private formBuilder: FormBuilder
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
    this.registrationForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      name: ['', Validators.required, Validators.minLength(3)],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(40),
        ],
      ],
      repeatPassword: ['', Validators.required],
    });
  }

  closePopup(): void {
    this.dialogRef.close();
  }

  getRecordValues(
    record: Record<string, InputPopupModel>
  ): [string, InputPopupModel][] {
    return Object.entries(record);
  }

  getTitle(input: InputPopupFullDataModel): string {
    return Object.values(input)[0];
  }

  trackByFn(index: number, item: [key: string, val: InputPopupModel]): string {
    return item[0];
  }

  onSubmitLogin(): void {
    if (this.loginForm.invalid) return;
    const credentials: LoginModel = {
      email: this.loginForm.controls['email'].value,
      password: this.loginForm.controls['password'].value,
    };
  }

  onSubmitRegistration(): void {
    if (this.registrationForm.valid) return;
  }

  async buttonClick(button: ButtonPopupModel): Promise<void> {
    if (button.onClick != null) await button.onClick();
    this.closePopup();
  }
}
