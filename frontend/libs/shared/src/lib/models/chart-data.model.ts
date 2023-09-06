import { OptionModel } from './option.model';
import { User } from './user.model';

export interface ChartData {
  slideTitle: string;
  answersCount: UserAnswer[];
  allOptions: OptionModel[];
}

export interface UserAnswer {
  users: User[];
  count: number;
}
