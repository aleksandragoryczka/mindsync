export interface Summary {
  presentationTitle?: string;
  showTime: string;
  attendeeNumber: number;
}

export interface AttendeeInformation {
  id: number;
  name: string;
  surname: string;
}

export interface SlideStatistics {
  id: number;
  title: string;
  displayTime: string;
  slideType: string;
  wordcloudAnswers: string;
  answersOptions: string;
  correctAnswers: string;
}
