import { Component, OnInit } from '@angular/core';
import { UserService } from 'libs/shared/src/lib/services/user.service';
import { User } from '../../../../../libs/shared/src/lib/models/user.model';
import { map } from 'rxjs';
import { error } from 'console';
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

@Component({
  selector: 'project-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {
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

  get userInformation() {
    return [
      {
        icon: 'email',
        field: 'Email address:',
        value: this.userDetails?.email,
      },
      { icon: 'person', field: 'Username:', value: this.userDetails?.username },
      { icon: 'person_outline', field: 'Name:', value: this.userDetails?.name },
      {
        icon: 'assignment_ind',
        field: 'Admin:',
        value: this.admin,
      },
    ];
  }

  openEditDataPopup(): void {
    const inputs: Record<string, InputPopupModel> = {
      ['username']: {
        value: this.userDetails.username,
        type: 'text',
        placeholder: 'Username',
      },
      ['name']: {
        value: this.userDetails.name,
        type: 'text',
        placeholder: 'Name',
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
        onClick: () => this.dialog.closeAll(),
      },
    ];
    const fullPopupData: InputPopupFullDataModel = {
      title: 'Edit your Profile',
      description: '',
      inputs: inputs,
      buttons: buttons,
    };
    this.dialog.open(PopupWithInputsComponent, { data: fullPopupData });
  }

  updateUser(inputs: Record<string, InputPopupModel>): void {
    const updatedUser: UpdatedUserModel = {
      name: String(inputs['name'].value),
      username: String(inputs['username'].value),
    };
    if (this.userDetails.id)
      this.userService.updateUser(updatedUser, this.userDetails.id).subscribe(
        res => {
          location.reload();
          if (res != null)
            this.toastrService.success('Profile updated successfully');
          else
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
}
