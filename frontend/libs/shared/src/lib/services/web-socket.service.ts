import { Injectable } from '@angular/core';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { UserAnswerMessageModel } from '../models/selected-options-message.model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private stompClient: Stomp.Client | undefined;
  attendees: any[] = [];
  userOptions: any[] = [];
  userAnswers$ = new BehaviorSubject<UserAnswerMessageModel[]>([]);
  startButtonPushed = new BehaviorSubject<boolean>(false);
  currentSlideId = new BehaviorSubject<number>(0);

  userAnswers: Observable<UserAnswerMessageModel[]> =
    this.userAnswers$.asObservable();

  constructor() {
    this.initializeWebSocketConnection();
  }

  initializeWebSocketConnection(): void {
    const serverUrl = 'http://localhost:8080/ws';
    const ws = new SockJS(serverUrl);
    this.stompClient = Stomp.over(ws);

    this.stompClient.connect(
      {},
      (frame: any) => {
        this.setupSubscriptions();
      },
      this.handleError
    );
  }

  setupSubscriptions(): void {
    this.subscribeToTopic(
      '/topic/attendees',
      this.handleAttendeesMessage.bind(this)
    );
    this.subscribeToTopic(
      '/topic/current-slide',
      this.handleCurrentSlideMessage.bind(this)
    );
    this.subscribeToTopic(
      '/topic/start-button',
      this.handleStartButtonMessage.bind(this)
    );
    this.subscribeToTopic(
      '/topic/selected-options',
      this.handleSelectedOptionsMessage.bind(this)
    );
    this.subscribeToTopic(
      '/topic/user-answer',
      this.handleUserAnswerMessage.bind(this)
    );
  }

  private subscribeToTopic(
    topic: string,
    callback: (message: any) => void
  ): void {
    if (this.stompClient)
      this.stompClient.subscribe(topic, (message: any) => {
        if (message.body) {
          callback(message);
        }
      });
  }

  private handleError(error: any): void {
    console.error('WebSocket connection error:', error);
    // Handle the error appropriately, e.g., by notifying the user or retrying the connection.
  }

  sendMessage(destination: string, message: any) {
    if (this.stompClient) this.stompClient.send(destination, {}, message);
  }

  // Define handlers for different topics
  private handleAttendeesMessage(message: any) {
    if (message.body) {
      this.attendees.push(JSON.parse(message.body));
    }
  }

  private handleCurrentSlideMessage(message: any) {
    if (message.body) {
      this.currentSlideId.next(+message.body);
    }
  }

  private handleStartButtonMessage(message: any) {
    if (message.body) {
      this.startButtonPushed.next(message.body);
    }
  }

  private handleSelectedOptionsMessage(message: any) {
    if (message.body) {
      this.userOptions.push(JSON.parse(message.body));
    }
  }

  private handleUserAnswerMessage(message: any) {
    if (message.body) {
      const currentUserAnswers = this.userAnswers$.getValue();
      currentUserAnswers.push(JSON.parse(message.body));
      this.userAnswers$.next(currentUserAnswers);
    }
  }
}
/*
  msg: any[] = [];
  userOptions: any[] = [];
  userAnswers$: BehaviorSubject<UserAnswerMessageModel[]> = new BehaviorSubject<
    UserAnswerMessageModel[]
  >([]);
  userAnswers = this.userAnswers$.asObservable();
  startButtonPushed: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  slideTimeEnded: string | undefined;
  stompClient: any;
  currentSlideId: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  constructor() {
    this.initializeWebSocketConnection();
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
            const currentUserAnswers = that.userAnswers$.getValue();
            currentUserAnswers.push(JSON.parse(message.body));
            that.userAnswers$.next(currentUserAnswers);
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

  sendSelectedOptions(message: any) {
    this.stompClient.send('/app/send/selected-options', {}, message);
  }

  sendUserAnswer(message: any) {
    this.stompClient.send('/app/send/user-answer', {}, message);
  }*/
