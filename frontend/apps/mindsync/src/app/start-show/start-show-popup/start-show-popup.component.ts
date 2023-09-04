import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
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
  //msg: any[] = [];
  constructor(
    public webSocketService: WebSocketService,
    private activatedRoute: ActivatedRoute
  ) {
    this.code = this.activatedRoute.snapshot.queryParamMap.get('code') ?? '';
  }

  ngOnInit(): void {
    this.attendees = this.webSocketService.msg;

    // console.log(this.attendees);
  }
}
