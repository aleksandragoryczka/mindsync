import { User } from './user.model';
export interface UserWithQuizzesCountModel {
  user: User;
  quizzesCount: number;
}
