import { GithubInterface, UserInterface } from '../interfaces/user.interface';

import { environment } from 'src/environments/environment';
import { AppConfigConst } from '../constant/constant';
export class User implements UserInterface {
  name: string = 'DEFAULT_NAME';
  surname: string = 'DEFAULT_SURNAME';
  email: string = 'email@email.com';
  username: string = 'username';
  password: string = '';
  role: string = 'USER';
  profilePhoto: string =
    environment.baseUrlHeader + AppConfigConst.DEFAULT_USER_IMG;
  currency: string = 'USD';
  authToken: any;
  mockedUser?: boolean;
  github: Github = new Github();
  githubUser?: string;
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

export class GithubIssues {
  title?: string;
  body?: string;
  assignees?: string[];
  labels?: string[];
}

export enum MockUser {
  USERNAME = 'moneystats',
  PASSWORD = 'moneystats',
}
