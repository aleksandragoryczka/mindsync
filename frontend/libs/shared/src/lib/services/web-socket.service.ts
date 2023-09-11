import { Injectable } from '@angular/core';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { AttendeeMessageModel } from '../models/attendee-message.model';
import {
  SelectedOptionsMessageModel,
  UserAnswerMessageModel,
} from '../models/selected-options-message.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  msg: any[] = [];
  userOptions: any[] = [];
  x: any[] = [];
  userAnswers$: BehaviorSubject<UserAnswerMessageModel[]> = new BehaviorSubject<
    UserAnswerMessageModel[]
  >([]);
  userAnswers = this.userAnswers$.asObservable();

  //startButtonPushed = false; //TODO: to be false
  startButtonPushed: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  slideTimeEnded: string | undefined;
  stompClient: any;
  currentSlideId: BehaviorSubject<number> = new BehaviorSubject<number>(0);

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
            that.currentSlideId.next(+message.body);
          }
        }
      );
      that.stompClient.subscribe(
        '/topic/start-button',
        (message: { body: any }) => {
          if (message.body) {
            that.startButtonPushed.next(message.body);
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
      that.stompClient.subscribe(
        '/topic/user-answer',
        (message: { body: any }) => {
          if (message.body) {
            that.x.push(JSON.parse(message.body));
            const currentUserAnswers = that.userAnswers$.getValue();
            currentUserAnswers.push(JSON.parse(message.body));
            console.log(currentUserAnswers);
            that.userAnswers$.next(currentUserAnswers);
            //that.userAnswers$.next(Object.assign([], JSON.parse(message.body)));
            //that.userAnswers.push(JSON.parse(message.body));
          }
        }
      );
    });
  }

  sendMessage(message: any) {
    this.stompClient.send('/app/send/attendees', {}, message);
  }

  sendCurrentSlideIndexMessage(message: number) {
    this.stompClient.send('/app/send/current-slide', {}, message);
  }

  sendPushStartButtonMessage(message: boolean) {
    this.stompClient.send('/app/send/start-button', {}, message);
  }

  sendTimeEnded(slideIdMessage: string) {
    this.stompClient.send('/app/send/time-end', {}, slideIdMessage);
  }

  sendSelectedOptions(message: any) {
    this.stompClient.send('/app/send/selected-options', {}, message);
  }

  sendUserAnswer(message: any) {
    this.stompClient.send('/app/send/user-answer', {}, message);
  }
}
