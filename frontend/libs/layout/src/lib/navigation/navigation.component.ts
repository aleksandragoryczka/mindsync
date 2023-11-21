import { Component, OnInit } from '@angular/core';
import {
  ButtonPopupModel,
  ButtonTypes,
  InputPopupFullDataModel,
  InputPopupModel,
} from '../../../../shared/src/lib/models/input-popup-data.model';
import { MatDialog } from '@angular/material/dialog';
import { PopupWithInputsComponent } from '../../../../ui/src/lib/popup-with-inputs/popup-with-inputs.component';
import { UserService } from '../../../../shared/src/lib/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { QuizService } from 'libs/shared/src/lib/services/quiz.service';
import StorageRealod from 'libs/shared/src/lib/utils/storage-reload';
import { WebSocketService } from '../../../../shared/src/lib/services/web-socket.service';
import { AttendeeMessageModel } from '../../../../shared/src/lib/models/attendee-message.model';

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
    private toastrService: ToastrService,
    private quizService: QuizService,
    private webSocketService: WebSocketService
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
    join: {
      ['code']: { value: '', type: 'text', placeholder: 'Code' },
      ['name']: { value: '', type: 'text', placeholder: 'Name' },
      ['surname']: { value: '', type: 'text', placeholder: 'Surname' },
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
    join: {
      title: 'Join quiz',
      description: 'Type quiz code you want to join, your name and surname:',
      inputs: this.homepageInputsPopup['join'],
      buttons: [
        {
          type: ButtonTypes.PRIMARY,
          text: 'Join',
          onClick: () => this.joinQuiz(this.homepageInputsPopup['join']),
        },

        {
          type: ButtonTypes.SECONDARY,
          text: 'Cancel',
        },
      ],
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

  joinQuiz(inputs: Record<string, InputPopupModel>): void {
    this.quizService
      .joinQuizByCode(String(inputs['code'].value))
      .subscribe(res => {
        if (res) {
          const attendee: AttendeeMessageModel = {
            name: String(inputs['name'].value),
            surname: String(inputs['surname'].value),
          };
          this.webSocketService.sendMessage(
            '/app/send/attendees',
            JSON.stringify(attendee)
          );
          this.dialog.closeAll();
          document.location.href = `http://localhost:4300/${res}?name=${String(
            inputs['name'].value
          )}&surname=${String(inputs['surname'].value)}`;
        } else {
          this.toastrService.error('Please try again.', 'Wrong Joining Code');
        }
      });
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
        text: 'Join quiz',
        router_link: '',
        popup_name: 'join',
      },
    ];
  }

  openCreateQuizPopup(): void {
    const inputs: Record<string, InputPopupModel> = {
      ['title']: {
        value: '',
        type: 'text',
        placeholder: 'Quiz title',
      },
      ['graphic']: {
        value: '',
        type: 'img',
        placeholder: 'Upload graphic',
      },
    };
    const buttons: ButtonPopupModel[] = [
      {
        type: ButtonTypes.PRIMARY,
        text: 'Create',
        onClick: () => this.createQuiz(inputs),
      },
      {
        type: ButtonTypes.SECONDARY,
        text: 'Cancel',
      },
    ];
    const data: InputPopupFullDataModel = {
      title: 'New quiz',
      description: 'Fill basic data about new quiz:',
      inputs: inputs,
      buttons: buttons,
    };
    this.dialog.open(PopupWithInputsComponent, { data: data });
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
    if (text === 'Quizzes') this.isDropdownOpen = true;
  }

  closeDropdown(): void {
    this.isDropdownOpen = false;
  }

  async logoNavigateTo(): Promise<void> {
    if (this.isUserAuthenticated) {
      await this.router.navigateByUrl('/dashboard');
    } else {
      await this.router.navigateByUrl('');
    }
  }

  private createQuiz(inputs: Record<string, InputPopupModel>): void {
    if (inputs['graphic'].value == '')
      this.toastrService.warning('Upload a quiz graphic first');
    else {
      const formData = new FormData();
      formData.append(
        'picture',
        inputs['graphic'].value as Blob,
        (inputs['graphic'].value as File).name
      );
      formData.append('title', String(inputs['title'].value));
      this.quizService.addQuiz(formData).subscribe(async isCreated => {
        if (isCreated) {
          await this.router.navigateByUrl(`/quiz/${isCreated.id}`);
          StorageRealod.reloadWithMessage(
            'Success-Message',
            'Quiz added successfully'
          );
        }
      });
    }
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
        text: 'Quizzes',
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
