import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AttendeeMessageModel } from 'libs/shared/src/lib/models/attendee-message.model';
import { WebSocketService } from 'libs/shared/src/lib/services/web-socket.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'project-start-show-popup',
  templateUrl: './start-show-popup.component.html',
  styleUrls: ['./start-show-popup.component.scss'],
})
export class StartShowPopupComponent implements OnInit {
  attendees: AttendeeMessageModel[] = [];
  code = '';
  constructor(
    public webSocketService: WebSocketService,
    private activatedRoute: ActivatedRoute,
    public dialogRef: MatDialogRef<StartShowPopupComponent>
  ) {
    this.code = this.activatedRoute.snapshot.queryParamMap.get('code') ?? '';
  }

  ngOnInit(): void {
    this.attendees = this.webSocketService.msg;
  }

  startShow(): void {
    this.dialogRef.close(this.attendees.length);
  }
}
