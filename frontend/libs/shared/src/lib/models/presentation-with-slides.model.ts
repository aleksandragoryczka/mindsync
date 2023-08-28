import { SlideModel } from './slide.model';

export interface PresentationWithSlides {
  id: string;
  title: string;
  code: string;
  createdAt: string;
  slides: Array<SlideModel>;
}
