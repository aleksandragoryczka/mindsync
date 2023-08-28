import { ShowModel } from './show.model';
import { SlideModel } from './slide.model';
export interface PresentationModel {
  id?: string;
  title?: string;
  code?: string;
  createdAt?: string;
  thumbnailUrl?: string;
  slides?: SlideModel[];
  shows?: ShowModel[];
}
