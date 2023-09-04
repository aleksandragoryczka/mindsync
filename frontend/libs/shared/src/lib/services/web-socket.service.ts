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
  stompClient: any;

  constructor() {
    this.initializeWebSocketConnection();
  }

  initializeWebSocketConnection() {
    const serveUrl = 'http://localhost:8080/ws';
    const ws = new SockJS(serveUrl);
    this.stompClient = Stomp.over(ws);
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this;
    this.stompClient.connect({}, function (frame: any) {
      console.log('dupa');
      that.stompClient.subscribe(
        '/topic/attendees',
        (message: { body: any }) => {
          console.log('tuaja');
          if (message.body) {
            console.log(message.body);
            const newAttendee: AttendeeMessageModel = JSON.parse(message.body);
            that.msg.push(newAttendee);
          }
        }
      );
    });
  }

  sendMessage(message: any) {
    this.stompClient.send('/app/send/attendees', {}, message);
  }

  /*
  _connect(): void {
    console.log('Initialize websocket connection');
    const ws = new SockJS(this.webSocketEndpoint);
    this.stompClient = Stomp.over(ws);
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const _this = this;
    _this.stompClient.connect(
      {},
      function (frame: any) {
        _this.stompClient.subscribe(_this.topic, function (sdkEvent: any) {
          _this.onMessageReceived(sdkEvent);
        });
      },
      this.errorCallBack
    );
  }

  _disconnect() {
    if (this.stompClient !== null) {
      this.stompClient.disconnect();
    }
    console.log('Disconnected');
  }

  //on error, schedule a reconnection attempt
  errorCallBack(error: string) {
    console.log('errorCalBAck -> ' + error);
    setTimeout(() => {
      this._connect();
    }, 4000);
  }

  _send(messgae: any) {
    console.log('calling api via web socket');
    this.stompClient.send('/app/attendees', {}, JSON.stringify(messgae));
  }

  onMessageReceived(message: any) {
    console.log('Message recieved form server: ' + message);
    this.appComponent.handleMessage(JSON.stringify(message.body));
  }*/
}
