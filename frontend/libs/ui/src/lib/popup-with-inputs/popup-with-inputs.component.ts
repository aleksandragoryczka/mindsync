import { Component, Inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LoginModel } from '../../../../shared/src/lib/models/login.model';
import Validation from '../../../../shared/src/lib/utils/validation';
import { UserService } from '../../../../shared/src/lib/services/user.service';
import {
  ButtonPopupModel,
  ButtonTypes,
  InputPopupFullDataModel,
  InputPopupModel,
} from 'libs/shared/src/lib/models/input-popup-data.model';
import { Router } from '@angular/router';

@Component({
  selector: 'project-popup-with-inputs',
  templateUrl: './popup-with-inputs.component.html',
  styleUrls: ['./popup-with-inputs.component.scss'],
})
export class PopupWithInputsComponent implements OnInit {
  primary = ButtonTypes.PRIMARY;
  loginForm!: FormGroup;
  registrationForm!: FormGroup;
  submitted = false;

  constructor(
    public dialogRef: MatDialogRef<PopupWithInputsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: InputPopupFullDataModel,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
    this.registrationForm = this.formBuilder.group(
      {
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
      },
      { validators: [Validation.match('password', 'repeatPassword')] }
    );
  }

  get rf(): { [key: string]: AbstractControl } {
    return this.registrationForm.controls;
  }

  get lf(): { [key: string]: AbstractControl } {
    return this.loginForm.controls;
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
    this.submitted = true;
    if (this.loginForm.invalid) return;

    const credentials: LoginModel = {
      email: this.loginForm.controls['email'].value,
      password: this.loginForm.controls['password'].value,
    };

    this.userService.login(credentials).subscribe(loggedIn => {
      async () => {
        if (loggedIn) {
          await this.router.navigate([`/dashboard`]);
          this.closePopup();
        }
      };
    });
  }

  onSubmitRegistration(): void {
    this.submitted = true;
    if (this.registrationForm.valid) return;
    //TODO: implement registration form
  }

  async buttonClick(button: ButtonPopupModel): Promise<void> {
    if (button.onClick != null) await button.onClick();
    this.closePopup();
  }
}
