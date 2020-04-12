import { User } from './user';

export class Session {
  isLogined: boolean;
  user: User;

  constructor() {
    this.isLogined = false;
    this.user = new User();
  }

  reset(): Session {
    this.isLogined = false;
    this.user = new User();
    return this;
  }
}
