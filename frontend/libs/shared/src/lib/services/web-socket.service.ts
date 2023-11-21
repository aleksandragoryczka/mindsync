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
