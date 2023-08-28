import { SlideTypes } from './enums/slideTypes.enum';

export interface SlideModel {
  id?: string;
  title: string;
  displayTime: string;
  type: SlideTypes;
  options?: Array<string>;
  //TODO: to be implemented
}
