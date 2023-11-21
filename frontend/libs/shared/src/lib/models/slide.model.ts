import { SlideTypes } from './enums/slideTypes.enum';
import { OptionModel } from './option.model';

export interface SlideModel {
  id?: string;
  title: string;
  displayTime: string;
  type: SlideTypes | string;
  headerColor?: string;
  titleColor?: string;
  options?: Array<OptionModel>;
}
