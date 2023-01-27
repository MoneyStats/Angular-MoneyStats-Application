import { GithubInterface, UserInterface } from '../interfaces/user.interface';

import { environment } from 'src/environments/environment';
export class User implements UserInterface {
  name: string = 'Name';
  surname: string = 'Surname';
  email: string = 'email@email.com';
  username: string = 'username';
  password: string = '';
  role: string = 'USER';
  profilePhoto: string = '../../../../assets/images/sample/avatar.png';
  currency: string = 'USD';
  authToken: any;
  mockedUser?: boolean;
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

export enum MockUser {
  USERNAME = 'moneystats',
  PASSWORD = 'moneystats',
}
