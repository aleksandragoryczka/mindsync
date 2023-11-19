import { SlideModel } from './slide.model';

export interface QuizWithSlides {
  id: string;
  title: string;
  code: string;
  createdAt: string;
  slides: Array<SlideModel>;
}
