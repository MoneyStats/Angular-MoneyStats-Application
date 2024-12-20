import { UserInterface } from '../interfaces/user.interface';

import { environment } from 'src/environments/environment';
import { AppConfigConst } from '../constant/constant';
export class User implements UserInterface {
  name: string = 'DEFAULT_NAME';
  surname: string = 'DEFAULT_SURNAME';
  email: string = 'email@email.com';
  username: string = 'username';
  password: string = '';
  roles: string = 'USER';
  imgName?: string;
  profilePhoto: string =
    environment.baseUrlHeader + AppConfigConst.DEFAULT_USER_IMG;
  phoneNumber: string = '';
  birthDate: Date = new Date();
  gender: string = '';
  occupation: string = '';
  education: string = '';
  nationality: string = '';
  ssn: string = '';
  tokenReset: string = '';
  attributes: any;
  authToken: any;
  mockedUser?: boolean;
}

export class UserSettings {
  currency: string = 'USD';
  currencySymbol: string = '$';
  cryptoCurrency?: string;
  cryptoCurrencySymbol?: string;
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
