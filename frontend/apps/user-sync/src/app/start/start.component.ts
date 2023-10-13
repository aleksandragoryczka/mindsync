import { Component } from '@angular/core';
import { AttendeeMessageModel } from 'libs/shared/src/lib/models/attendee-message.model';
import { PresentationService } from '../../../../../libs/shared/src/lib/services/presentation.service';
import {
  ButtonTypes,
  InputPopupFullDataModel,
  InputPopupModel,
} from 'libs/shared/src/lib/models/input-popup-data.model';
import { WebSocketService } from 'libs/shared/src/lib/services/web-socket.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { PopupWithInputsComponent } from 'libs/ui/src/lib/popup-with-inputs/popup-with-inputs.component';

@Component({
  selector: 'project-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss'],
})
export class StartComponent {
  inputs: Record<string, InputPopupModel> = {
    ['code']: { value: '', type: 'text', placeholder: 'Code' },
    ['name']: { value: '', type: 'text', placeholder: 'Name' },
    ['surname']: { value: '', type: 'text', placeholder: 'Surname' },
  };
  inputPopupData: InputPopupFullDataModel = {
    title: 'Join Presentation',
    description:
      'Type presentation code you want to join, your name and surname:',
    inputs: this.inputs,
    buttons: [
      {
        type: ButtonTypes.PRIMARY,
        text: 'Join',
        onClick: () => this.joinPresentation(this.inputs),
      },

      {
        type: ButtonTypes.SECONDARY,
        text: 'Cancel',
      },
    ],
  };

  constructor(
    private presentationService: PresentationService,
    private webSocketService: WebSocketService,
    private toastrService: ToastrService,
    private router: Router,
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute
  ) {
    this.dialog.open(PopupWithInputsComponent, {
      data: this.inputPopupData,
      disableClose: true,
    });
  }

  joinPresentation(inputs: Record<string, InputPopupModel>): void {
    this.presentationService
      .joinPresentationByCode(String(inputs['code'].value))
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
          this.router.navigate([`${res}`], {
            queryParams: {
              name: `${String(inputs['name'].value)}`,
              surname: `${String(inputs['surname'].value)}`,
            },
          });
        } else {
          this.toastrService.error('Please try again.', 'Wrong Joining Code');
        }
      });
  }
}
