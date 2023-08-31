import { Component, OnInit } from '@angular/core';
import {
  InputPopupFullDataModel,
  InputPopupModel,
} from '../../../../shared/src/lib/models/input-popup-data.model';
import { MatDialog } from '@angular/material/dialog';
import { PopupWithInputsComponent } from '../../../../ui/src/lib/popup-with-inputs/popup-with-inputs.component';
import { UserService } from '../../../../shared/src/lib/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'project-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent implements OnInit {
  isUserAuthenticated = false;
  isDropdownOpen = false;
  userMenu: { text: string; router_link?: string }[] = [];

  constructor(
    private dialog: MatDialog,
    public userService: UserService,
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.userService.isAuthenticated$.subscribe(authenticated => {
      this.isUserAuthenticated = authenticated;
      this.updateUserMenu();
    });
    this.verifyUser();
  }

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
    },
    register: {
      title: 'Register',
      description: '',
      inputs: this.homepageInputsPopup['register'],
    },
  };

  openPopup(popup_name: string | null): void {
    if (popup_name !== null) {
      const data = this.homepageInputPopupFullData[popup_name];
      this.dialog.open(PopupWithInputsComponent, {
        data: data,
      });
    }
  }

  get defaultMenu() {
    return [
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
      {
        text: 'Join presentation',
        router_link: '',
        popup_name: null,
      },
    ];
  }

  async logOut(text: string): Promise<void> {
    if (text === 'Log Out') {
      this.userService.logOut();
      await this.router.navigateByUrl('');
    }
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

  private verifyUser(): void {
    const verificationCode = this.activatedRoute.snapshot.queryParams['code'];
    if (verificationCode) {
      this.userService
        .verifyUser(verificationCode)
        .subscribe((verified: boolean) => {
          if (verified) {
            this.toastrService.success(
              'Now you can Sign in',
              'Your Account is verified'
            );
          }
        });
    }
  }

  private updateUserMenu(): void {
    const menu = [
      {
        text: 'Presentations',
      },
      {
        text: 'Profile',
        router_link: '/profile',
      },
      {
        text: 'Log Out',
        router_link: '',
      },
    ];

    this.userService.isAdmin$.subscribe(admin => {
      if (admin) {
        const adminMenu = [...menu];
        adminMenu.splice(2, 0, {
          text: 'Admin Panel',
          router_link: '/admin-panel',
        });
        this.userMenu = adminMenu;
      } else {
        this.userMenu = menu;
      }
    });
  }
}
