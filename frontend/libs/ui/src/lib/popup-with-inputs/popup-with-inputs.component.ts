import { Component, Inject, Input, OnInit } from '@angular/core';
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
import { RegisterModel } from 'libs/shared/src/lib/models/register.model';
import { ToastrService } from 'ngx-toastr';
import { SlideTypes } from 'libs/shared/src/lib/models/enums/slideTypes.enum';
import { TooltipTexts } from 'libs/shared/src/lib/models/enums/tooltips-texts.enum';
import StringFormatter from 'libs/shared/src/lib/utils/string-formatter';

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
  isMultipleChoiceType!: boolean;
  TooltipTexts = TooltipTexts;
  uploadedFileName = '';
  StringFormatter = StringFormatter;

  constructor(
    public dialogRef: MatDialogRef<PopupWithInputsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: InputPopupFullDataModel,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
    private toastrService: ToastrService
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
        surname: ['', Validators.required, Validators.minLength(3)],
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
    record['type'] && record['type'].value === SlideTypes.MULTIPLE_CHOICE
      ? (this.isMultipleChoiceType = true)
      : (this.isMultipleChoiceType = false);
    return Object.entries(record);
  }

  checkIfDataInputs(record: Record<string, InputPopupModel>): boolean {
    if (Object.keys(record).length > 0) return true;
    return false;
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

    this.userService.login(credentials).subscribe(
      async loggedIn => {
        if (loggedIn !== null) {
          this.closePopup();
          await this.router.navigate([`/dashboard`]);
        } else {
          this.toastrService.error(
            'Your account is not verified. Please check your mail box'
          );
        }
      },
      error => this.toastrService.error('Wrong credentials provided. Try again')
    );
  }

  onSubmitRegistration(): void {
    this.submitted = true;
    if (this.registrationForm.invalid) return;
    const newUser: RegisterModel = {
      email: this.registrationForm.controls['email'].value,
      username: this.registrationForm.controls['username'].value,
      name: this.registrationForm.controls['name'].value,
      surname: this.registrationForm.controls['surname'].value,
      password: this.registrationForm.controls['password'].value,
    };
    this.closePopup();
    this.userService.register(newUser).subscribe(user => {
      if (user) {
        this.toastrService.success(
          'Now please check your email to verify your account',
          'You have registred successfully.',
          { timeOut: 5000 }
        );
      } else this.toastrService.error('Error during registration. Try again');
    });
  }

  onTypeChange(event: any) {
    if (
      Object.keys(SlideTypes).includes(event.value) &&
      event.value === SlideTypes.MULTIPLE_CHOICE
    ) {
      this.isMultipleChoiceType = true;
    }
  }

  addOptionField() {
    if (this.data.options?.length == 6)
      this.toastrService.warning('You can add 6 options maximally');
    else this.data.options?.push({ option: '', isCorrect: false });
  }

  removeOptionField() {
    if (this.data.options?.length == 0)
      this.toastrService.warning(
        'First add new option',
        'No option to be deleted'
      );
    else this.data.options?.pop();
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    this.uploadedFileName = file.name;
    this.data.inputs['graphic'].value = file;
  }

  async buttonClick(button: ButtonPopupModel): Promise<void> {
    if (button.onClick != null) await button.onClick();
    else this.closePopup();
  }
}
