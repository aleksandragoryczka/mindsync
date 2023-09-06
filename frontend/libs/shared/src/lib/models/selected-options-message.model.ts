import { OptionModel } from './option.model';

export interface SelectedOptionsMessageModel {
  name: string;
  surname: string;
  selectedOptions: OptionModel[];
}
