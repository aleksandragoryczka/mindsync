import { Component } from '@angular/core';
import {
  ButtonTypes,
  InputPopupFullDataModel,
  InputPopupModel,
} from '../../../../shared/src/lib/models/input-popup-data.model';
import { MatDialog } from '@angular/material/dialog';
import { PopupWithInputsComponent } from '../../../../ui/src/lib/popup-with-inputs/popup-with-inputs.component';

@Component({
  selector: 'project-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent {
  isUserAuthenticated = true;
  isDropdownOpen = false;

  constructor(private dialog: MatDialog) {}

  homepageInputsPopup: Record<string, Record<string, InputPopupModel>> = {
    login: {
      ['Email']: { value: '', type: 'text', placeholder: 'Email' },
      ['Password']: { value: '', type: 'text', placeholder: 'Password' },
    },
    register: {
      ['Name']: { value: '', type: 'text', placeholder: 'Name' },
      ['Username']: { value: '', type: 'text', placeholder: 'Username' },
      ['Email']: { value: '', type: 'email', placeholder: 'Email' },
      ['Password']: { value: '', type: 'password', placeholder: 'Password' },
      ['Repeat password']: {
        value: '',
        type: 'text',
        placeholder: 'Repeat password',
      },
    },
  };

  homepageInputPopupFullData: Record<string, InputPopupFullDataModel> = {
    login: {
      title: 'Sign In',
      description: '',
      inputs: this.homepageInputsPopup['login'],
      buttons: [
        {
          type: ButtonTypes.PRIMARY,
          text: 'Sign In',
        },
        {
          type: ButtonTypes.SECONDARY,
          text: 'Cancel',
          onClick: () => {
            console.log('');
          },
        },
      ],
    },
    register: {
      title: 'Register',
      description: '',
      inputs: this.homepageInputsPopup['register'],
      buttons: [
        {
          type: ButtonTypes.PRIMARY,
          text: 'Register',
        },
        {
          type: ButtonTypes.SECONDARY,
          text: 'Cancel',
          onClick: () => {
            console.log('');
          },
        },
      ],
    },
  };

  openPopup(popup_name: string | null): void {
    if (popup_name !== null) {
      const data = this.homepageInputPopupFullData[popup_name];
      this.dialog.open(PopupWithInputsComponent, {
        data: data,
        panelClass: 'mindsync-popup',
      });
    }
  }

  get defaultMenu() {
    return [
      {
        text: 'Join presentation',
        router_link: '#',
        popup_name: null,
      },
      {
        text: 'Home',
        router_link: '',
        popup_name: null,
      },
      {
        text: 'Register',
        router_link: '',
        popup_name: 'register',
      },
      {
        text: 'Sign In',
        router_link: '',
        popup_name: 'login',
      },
    ];
  }

  //TODO: Add Admin Panel
  get userMenu() {
    return [
      {
        text: 'Presentations',
        router_link: '',
      },
      {
        text: 'Profile',
        router_link: '#',
      },
      {
        text: 'Log Out',
        router_link: '#',
      },
    ];
  }

  trackByFn(
    index: number,
    item: { text: string; router_link: string }
  ): string {
    return item.router_link;
  }

  openDropdown(text: string): void {
    if (text === 'Presentations') this.isDropdownOpen = true;
  }

  closeDropdown(): void {
    this.isDropdownOpen = false;
  }
}
