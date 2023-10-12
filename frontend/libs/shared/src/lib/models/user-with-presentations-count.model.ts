import { User } from './user.model';
export interface UserWithPresentationsCountModel {
  user: User;
  presentationsCount: number;
}
