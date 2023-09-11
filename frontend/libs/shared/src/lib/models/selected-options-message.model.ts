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
  answer: string;
}
