import { BehaviorSubject } from 'rxjs';
import { OptionModel } from './option.model';

export interface SelectedOptionsMessageModel {
  name: string;
  surname: string;
  selectedOptions: OptionModel[];
  //answer?: string;
}

export interface UserAnswerMessageModel {
  name: string;
  surname: string;
  slideId?: string,
  answer: string;
}
