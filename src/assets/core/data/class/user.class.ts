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
  imgName?: string;
  profilePhoto: string =
    environment.baseUrlHeader + AppConfigConst.DEFAULT_USER_IMG;
  authToken: any;
  mockedUser?: boolean;
  settings: UserSettings = new UserSettings();
}

export class UserSettings {
  currency: string = 'USD';
  cryptoCurrency?: string;
  github: Github = new Github();
  githubUser?: string;
  completeRequirement?: string;
  liveWallets?: string;
}

export enum Status {
  ACTIVE = 'ACTIVE',
  NOT_ACTIVE = 'NOT_ACTIVE',
  // Requirements
  COMPLETED = 'COMPLETED',
  CURRENCY = 'CURRENCY',
  WALLET = 'WALLET',
  CRYPTO_WALLET = 'CRYPTO_WALLET',
  ASSET = 'ASSET',
  NOT_COMPLETED = 'NOT_COMPLETED',
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
