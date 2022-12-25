import { GithubInterface, UserInterface } from '../interfaces/user.interface';

export class User implements UserInterface {
  name: string = 'Name';
  surname: string = 'Surname';
  email: string = 'email@email.com';
  username: string = 'username';
  role: string = 'USER';
  profilePhoto: string =
    '../../../../assets/images/img/sample/avatar/avatar1.jpg';
  value: string = 'USD';
  github: Github = new Github();
}

export class Github implements GithubInterface {
  id?: number;
  login?: string;
  username?: string;
  avatar_url?: string;
  updated_at?: Date;
  created_at?: Date;
  followers?: number;
  following?: number;
  html_url?: string;
}
