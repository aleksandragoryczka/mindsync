import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Roles } from 'libs/shared/src/lib/models/enums/roles.enum';
import {
  InputPopupModel,
  ButtonPopupModel,
  ButtonTypes,
  InputPopupFullDataModel,
} from 'libs/shared/src/lib/models/input-popup-data.model';
import { PaginatedResult } from 'libs/shared/src/lib/models/paginated-result.model';
import { SharedTableData } from 'libs/shared/src/lib/models/shared-table-data.model';
import { UserWithPresentationsCountModel } from 'libs/shared/src/lib/models/user-with-presentations-count.model';
import { User } from 'libs/shared/src/lib/models/user.model';
import { PresentationService } from 'libs/shared/src/lib/services/presentation.service';
import { UserService } from 'libs/shared/src/lib/services/user.service';
import { PopupWithInputsComponent } from 'libs/ui/src/lib/popup-with-inputs/popup-with-inputs.component';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, map, switchMap } from 'rxjs';

@Component({
  selector: 'project-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss'],
})
export class AdminPanelComponent {
  caption = 'List of users';
  headers = [
    'Full name',
    'Username',
    'E-mail',
    'Total presentations number',
    'Role',
  ];
  rowsPerPage = 10;
  totalNumberOfPages = 1;
  currentPage$ = new BehaviorSubject<number>(0);
  listOfUsers$: Observable<SharedTableData[]> = this.loadUsers();

  constructor(
    private userService: UserService,
    private toastrService: ToastrService,
    private dialog: MatDialog,
    private presentationService: PresentationService
  ) {}

  setPage(pageNumber: number): void {
    this.currentPage$.next(pageNumber);
  }

  private loadUsers(): Observable<SharedTableData[]> {
    return this.currentPage$.pipe(
      switchMap(currentPage => this.userService.getAllUsers(currentPage)),
      switchMap((res: PaginatedResult<User>) => {
        this.totalNumberOfPages = res.totalPages ?? 1;
        if (res.content.length === 0 && this.currentPage$.value - 1 > 0)
          this.currentPage$.next(this.currentPage$.value - 1);
        return this.presentationService.getUsersWithPresentationsCount().pipe(
          map(
            (
              usersWithPresentationsCounts: UserWithPresentationsCountModel[]
            ) => {
              return this.mapData(res, usersWithPresentationsCounts);
            }
          )
        );
      })
    );
  }

  private checkIsAdmin(roles: string[] | undefined): boolean {
    if (roles && roles.includes(Roles.ROLE_ADMIN.toString())) {
      return true;
    }
    return false;
  }

  getUsersWithPresentationsCounts() {
    return this.presentationService.getUsersWithPresentationsCount();
  }

  private mapData(
    data: PaginatedResult<User>,
    usersWithPresentationsCounts: UserWithPresentationsCountModel[]
  ): SharedTableData[] {
    const users = data.content;
    const results: SharedTableData[] = [];
    users.forEach(user => {
      const isAdmin = this.checkIsAdmin(user.roles);
      const result: SharedTableData = {
        cols: [
          `${user.name} ${user.surname}`,
          user.username ?? '',
          user.email ?? '',
          String(
            usersWithPresentationsCounts.filter(
              count => count.user.id === user.id
            )[0]?.presentationsCount ?? 0
          ),
          isAdmin ? 'ADMIN' : 'USER',
        ],
        actions: [
          {
            icon: 'account_circle',
            func: (arg: User) =>
              isAdmin
                ? this.openRemoveAdminPopup(arg)
                : this.openGiveAdminPopup(arg),
            arg: user,
            tooltip: isAdmin ? 'Remove Admin' : 'Give Admin',
          },
        ],
      };
      results.push(result);
    });
    return results;
  }

  private openRemoveAdminPopup(user: User): void {
    const inputs: Record<string, InputPopupModel> = {};
    const buttons: ButtonPopupModel[] = [
      {
        type: ButtonTypes.PRIMARY,
        text: 'Yes',
        onClick: () => this.removeAdmin(user),
      },
      {
        type: ButtonTypes.SECONDARY,
        text: 'No',
      },
    ];
    const data: InputPopupFullDataModel = {
      title: 'Remove admin',
      description: `Are you sure you want to remove ${user.username} ADMIN role?`,
      inputs: inputs,
      buttons: buttons,
    };
    this.dialog.open(PopupWithInputsComponent, {
      data: data,
    });
  }

  private openGiveAdminPopup(user: User): void {
    const inputs: Record<string, InputPopupModel> = {};
    const buttons: ButtonPopupModel[] = [
      {
        type: ButtonTypes.PRIMARY,
        text: 'Yes',
        onClick: () => this.giveAdmin(user),
      },
      {
        type: ButtonTypes.SECONDARY,
        text: 'No',
      },
    ];
    const data: InputPopupFullDataModel = {
      title: 'Give admin',
      description: `Are you sure you want to give ${user.username} ADMIN role?`,
      inputs: inputs,
      buttons: buttons,
    };
    this.dialog.open(PopupWithInputsComponent, {
      data: data,
    });
  }

  private giveAdmin(user: User): void {
    if (user.id) {
      this.userService.giveAdmin(user?.id).subscribe(res => {
        if (res) {
          this.dialog.closeAll();
          this.listOfUsers$ = this.loadUsers();
          this.toastrService.success(
            `ADMIN Role was given to ${user.username}`
          );
        } else {
          this.toastrService.error('Something went wrong');
        }
      });
    }
  }

  private removeAdmin(user: User): void {
    if (user.id) {
      this.userService.removeAdmin(user?.id).subscribe(res => {
        if (res) {
          this.dialog.closeAll();
          this.listOfUsers$ = this.loadUsers();
          this.toastrService.success(
            `ADMIN Role was removed for ${user.username}`
          );
        } else {
          this.toastrService.error('Something went wrong');
        }
      });
    }
  }
}
