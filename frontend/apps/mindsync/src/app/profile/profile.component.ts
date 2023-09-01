import { Component, OnInit } from '@angular/core';
import { UserService } from 'libs/shared/src/lib/services/user.service';
import { User } from '../../../../../libs/shared/src/lib/models/user.model';
import {
  ButtonPopupModel,
  ButtonTypes,
  InputPopupModel,
} from 'libs/shared/src/lib/models/input-popup-data.model';
import { InputPopupFullDataModel } from '../../../../../libs/shared/src/lib/models/input-popup-data.model';
import { MatDialog } from '@angular/material/dialog';
import { PopupWithInputsComponent } from 'libs/ui/src/lib/popup-with-inputs/popup-with-inputs.component';
import { UpdatedUserModel } from '../../../../../libs/shared/src/lib/models/updated-user.model';
import { ToastrService } from 'ngx-toastr';
import { ProfilePopupComponent } from './profile-popup/profile-popup.component';
import StorageRealod from '../../../../../libs/shared/src/lib/utils/storage-reload';

@Component({
  selector: 'project-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  userDetails!: User;
  admin = false;
  constructor(
    private userService: UserService,
    private dialog: MatDialog,
    private toastrService: ToastrService
  ) {
    this.userService.getUserDetails().subscribe(res => {
      if (res != undefined) this.userDetails = res;
    });
    this.userService.isAdmin$.subscribe(res => (this.admin = res));
  }

  ngOnInit(): void {
    const updateUserSuccessMessage = localStorage.getItem('Success-Message');
    if (updateUserSuccessMessage) {
      this.toastrService.success(updateUserSuccessMessage);
      localStorage.removeItem('Success-Message');
    }
  }

  get userInformation() {
    return [
      {
        icon: 'email',
        field: 'Email address:',
        value: this.userDetails?.email,
      },
      { icon: 'person', field: 'Username:', value: this.userDetails?.username },
      {
        icon: 'person_outline',
        field: 'Full name:',
        value: this.userDetails?.name + ' ' + this.userDetails?.surname,
      },
      {
        icon: 'assignment_ind',
        field: 'Admin:',
        value: this.admin,
      },
    ];
  }

  openEditDataPopup(): void {
    const inputs: Record<string, InputPopupModel> = {
      ['name']: {
        value: this.userDetails.name,
        type: 'text',
        placeholder: 'Name',
      },
      ['surname']: {
        value: this.userDetails.surname,
        type: 'text',
        placeholder: 'Surname',
      },
      ['username']: {
        value: this.userDetails.username,
        type: 'text',
        placeholder: 'Username',
      },
    };
    const buttons: ButtonPopupModel[] = [
      {
        type: ButtonTypes.PRIMARY,
        text: 'Edit',
        onClick: () => this.updateUser(inputs),
      },

      {
        type: ButtonTypes.SECONDARY,
        text: 'Cancel',
      },
    ];
    const fullPopupData: InputPopupFullDataModel = {
      title: 'Edit your Profile',
      description: '',
      inputs: inputs,
      buttons: buttons,
    };
    console.log(fullPopupData);
    this.dialog.open(PopupWithInputsComponent, { data: fullPopupData });
  }

  updateUser(inputs: Record<string, InputPopupModel>): void {
    const updatedUser: UpdatedUserModel = {
      name: String(inputs['name'].value),
      surname: String(inputs['surname'].value),
      username: String(inputs['username'].value),
    };
    if (
      updatedUser.name === this.userDetails.name &&
      updatedUser.surname === this.userDetails.surname &&
      updatedUser.username === this.userDetails.username
    ) {
      this.toastrService.warning('You did not edit any data.');
      return;
    }
    if (
      updatedUser.name?.length === 0 ||
      updatedUser.surname?.length === 0 ||
      updatedUser.username?.length === 0
    ) {
      this.toastrService.warning('Updated field cannot be blank.');
      return;
    }
    if (this.userDetails.id)
      this.userService.updateUser(updatedUser, this.userDetails.id).subscribe(
        res => {
          if (res != null) {
            StorageRealod.reloadWithMessage(
              'Success-Message',
              'Profile updated successfully'
            );
          } else
            this.toastrService.error(
              'Error while updating profile. Try Again.',
              'Error'
            );
        },
        error => {
          this.toastrService.error(
            'Error while updating profile. Try Again.',
            'Error'
          );
        }
      );
  }

  openChangePasswordPopup(): void {
    this.dialog.open(ProfilePopupComponent, {
      data: { userId: this.userDetails.id },
    });
  }
}
