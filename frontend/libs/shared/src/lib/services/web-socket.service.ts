import { Injectable } from '@angular/core';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { AttendeeMessageModel } from '../models/attendee-message.model';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  webSocketEndpoint = 'http://localhost:8080/ws';
  topic = '/topic/attendees';
  msg: any[] = [];
  startButtonPushed = true; //TODO: to be false
  stompClient: any;

  constructor() {
    this.initializeWebSocketConnection();
    this.isStartButtonPushed();
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
            //const newAttendee: AttendeeMessageModel = JSON.parse(message.body);
            that.msg.push(JSON.parse(message.body));
          }
        }
      );
    });
  }

  isStartButtonPushed(): void {
    const serveUrl = 'http://localhost:8080/ws';
    const ws = new SockJS(serveUrl);
    this.stompClient = Stomp.over(ws);
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this;
    this.stompClient.connect({}, function (frame: any) {
      that.stompClient.subscribe(
        '/topic/start-button',
        (message: { body: any }) => {
          if (message.body) {
            //const newAttendee: AttendeeMessageModel = JSON.parse(message.body);
            that.startButtonPushed = message.body;
          }
        }
      );
    });
  }

  sendMessage(message: any) {
    this.stompClient.send('/app/send/attendees', {}, message);
  }

  sendPushStartButtonMessage(message: boolean) {
    this.stompClient.send('/app/send/start-button', {}, message);
  }
}
