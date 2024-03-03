import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { User } from '../../data/class/user.class';
import { Coin, CoinSymbol } from '../../data/class/coin';
import { SwalService } from '../../utils/swal.service';
import { AuthService } from './auth.service';
import { StorageConstant } from '../../data/constant/constant';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  environment = environment;
  public user: User = new User();
  public currency: string = CoinSymbol.USD;
  public cryptoCurrency: string = CoinSymbol.USD;

  constructor(
    public swalService: SwalService,
    private authService: AuthService
  ) {}

  syncGithubUser(user: string) {
    this.swalService.syncGithubUser(user);
    this.updateGithubData();
  }

  updateGithubUser() {
    this.user.settings.github = this.swalService.githubAccount;
  }

  updateGithubData() {
    this.updateGithubUser();
    if (this.user.settings.github === undefined) {
      setTimeout(() => {
        this.updateGithubData();
      }, 100 * 10);
    } else {
      this.user!.profilePhoto = this.user.settings.github.avatar_url!;
      this.user.settings.githubUser = JSON.stringify(this.user.settings.github);
      this.authService.updateUserData(this.user).subscribe((res) => {
        this.user = res.data;
        this.user.settings.github = JSON.parse(this.user.settings.githubUser!);
      });
    }
  }

  public setUserGlobally(user: User): void {
    if (user.authToken)
      localStorage.setItem(
        StorageConstant.ACCESSTOKEN,
        user.authToken.type + ' ' + user.authToken.accessToken
      );
    if (user.settings.githubUser) {
      user.settings.github = JSON.parse(user.settings.githubUser);
    }
    if (user.settings.githubUser) {
      user.settings.github = JSON.parse(user.settings.githubUser);
      localStorage.setItem(
        StorageConstant.GITHUBACCOUNT,
        JSON.stringify(user.settings.githubUser)
      );
    }
    localStorage.setItem(StorageConstant.USERACCOUNT, JSON.stringify(user));
    this.setValue(user.settings.currency);
    this.user = user;
    this.authService.user = user;
  }

  private setValue(currency: string): void {
    switch (currency) {
      case Coin.EUR:
        this.currency = CoinSymbol.EUR;
        break;
      case Coin.USD:
        this.currency = CoinSymbol.USD;
        break;
      case Coin.GBP:
        this.currency = CoinSymbol.GBP;
        break;
      default:
        this.currency = CoinSymbol.USD;
        break;
    }
    this.authService.coinSymbol = this.currency;
    this.cryptoCurrency = this.user.settings.cryptoCurrency!;
  }

  public static getUserStorage(): User {
    const storage = localStorage.getItem(StorageConstant.USERACCOUNT);
    let user: User = new User();
    if (storage) return JSON.parse(storage);
    return user;
  }
}
