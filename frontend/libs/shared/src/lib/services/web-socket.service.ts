import { Injectable } from '@angular/core';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { AttendeeMessageModel } from '../models/attendee-message.model';
import { SelectedOptionsMessageModel } from '../models/selected-options-message.model';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  msg: any[] = [];
  userOptions: any[] = [];
  //startButtonPushed = false; //TODO: to be false
  slideTimeEnded: string | undefined;
  stompClient: any;
  currentSlideId: number | undefined;

  constructor() {
    this.initializeWebSocketConnection();
    // this.isStartButtonPushed();
  }

  initializeWebSocketConnection(): void {
    const serveUrl = 'http://localhost:8080/ws';
    const ws = new SockJS(serveUrl);
    this.stompClient = Stomp.over(ws);
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this;
    this.stompClient.connect({}, function (frame: any) {
      that.stompClient.subscribe(
        '/topic/attendees',
        (message: { body: any }) => {
          if (message.body) {
            that.msg.push(JSON.parse(message.body));
          }
        }
      );
      that.stompClient.subscribe(
        '/topic/current-slide',
        (message: { body: any }) => {
          if (message.body) {
            that.currentSlideId = message.body;
          }
        }
      );
      //TODO: unused
      that.stompClient.subscribe(
        '/topic/time-end',
        (message: { body: any }) => {
          if (message.body) {
            that.slideTimeEnded = message.body;
          }
        }
      );
      that.stompClient.subscribe(
        '/topic/selected-options',
        (message: { body: any }) => {
          if (message.body) {
            that.userOptions.push(JSON.parse(message.body));
          }
        }
      );
    });
  }

  sendMessage(message: any) {
    this.stompClient.send('/app/send/attendees', {}, message);
  }

  sendCurrentSlideMessage(message: string) {
    this.stompClient.send('/app/send/current-slide', {}, parseInt(message));
  }
  /*
  sendPushStartButtonMessage(message: boolean) {
    this.stompClient.send('/app/send/start-button', {}, message);
  }*/

  sendTimeEnded(slideIdMessage: string) {
    this.stompClient.send('/app/send/time-end', {}, slideIdMessage);
  }

  sendSelectedOptions(message: any) {
    this.stompClient.send('/app/send/selected-options', {}, message);
  }
}