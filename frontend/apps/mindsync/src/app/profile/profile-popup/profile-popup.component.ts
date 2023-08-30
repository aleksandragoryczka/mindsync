import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UpdatedUserModel } from 'libs/shared/src/lib/models/updated-user.model';
import { UserService } from 'libs/shared/src/lib/services/user.service';
import StorageRealod from 'libs/shared/src/lib/utils/storage-reload';
import Validation from 'libs/shared/src/lib/utils/validation';
import { ToastrService } from 'ngx-toastr';
import { UpdatedPasswordModel } from '../../../../../../libs/shared/src/lib/models/updated-password.model';

@Component({
  selector: 'project-profile-popup',
  templateUrl: './profile-popup.component.html',
  styleUrls: ['./profile-popup.component.scss'],
})
export class ProfilePopupComponent implements OnInit {
  updatePasswordForm!: FormGroup;
  userId: string;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private toastrService: ToastrService,
    public dialogRef: MatDialogRef<ProfilePopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { userId: string }
  ) {
    this.userId = data.userId;
  }

  ngOnInit(): void {
    this.updatePasswordForm = this.formBuilder.group(
      {
        currentPassword: ['', Validators.required],
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

  get f(): { [key: string]: AbstractControl } {
    return this.updatePasswordForm.controls;
  }

  onSubmitUpdatePassword(): void {
    this.submitted = true;
    if (this.updatePasswordForm.invalid) return;
    const updatedPasswordModel: UpdatedPasswordModel = {
      newPassword: this.updatePasswordForm.controls['password'].value,
      oldPassword: this.updatePasswordForm.controls['currentPassword'].value,
    };
    this.closePopup();
    this.userService
      .updatePassword(updatedPasswordModel, this.userId)
      .subscribe(
        res => {
          if (res) {
            StorageRealod.reloadWithMessage(
              'Success-Message',
              'Password changed successfully'
            );
          } else this.toastrService.error('Wrong current password.', 'Error');
        },
        error => {
          this.toastrService.error(
            'Error while updating password. Try Again.',
            'Error'
          );
        }
      );
  }

  closePopup(): void {
    this.dialogRef.close();
  }
}
