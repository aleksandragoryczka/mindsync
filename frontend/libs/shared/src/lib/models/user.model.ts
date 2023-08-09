import { Roles } from './enums/roles.enum';

export interface User {
  id?: string;
  name?: string;
  username?: string;
  email?: string;
  role?: Roles;
}
