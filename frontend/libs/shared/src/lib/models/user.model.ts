import { Roles } from './enums/roles.enum';

export interface User {
  id?: string;
  name?: string;
  surname?: string;
  username?: string;
  email?: string;
  //role?: Roles;
  roles?: string[];
}
