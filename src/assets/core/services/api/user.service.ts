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
  private static userStatic: User = new User();
  public currency: string = CoinSymbol.USD;
  public cryptoCurrency: string = CoinSymbol.USD;

  constructor(
    public swalService: SwalService,
    private authService: AuthService
  ) {}

  public setUserGlobally(user: User): void {
    if (user.authToken) {
      localStorage.setItem(
        StorageConstant.ACCESSTOKEN,
        user.authToken.type + ' ' + user.authToken.accessToken
      );
      localStorage.setItem(
        StorageConstant.AUTHTOKEN,
        JSON.stringify(user.authToken)
      );
    }

    this.setValue(user.attributes.money_stats_settings.currency);
    user.attributes.money_stats_settings.cryptoCurrencySymbol =
      this.cryptoCurrency;
    user.attributes.money_stats_settings.currencySymbol = this.currency;
    localStorage.setItem(StorageConstant.USERACCOUNT, JSON.stringify(user));
    this.user = user;
    const u = Object.getPrototypeOf(this).constructor;
    u.userStatic = user;
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
    this.cryptoCurrency =
      this.user.attributes.money_stats_settings.cryptoCurrency!;
  }

  public static getUserData(): User {
    const storage = localStorage.getItem(StorageConstant.USERACCOUNT);
    let user: User = this.userStatic;
    if (storage) return JSON.parse(storage);
    return user;
  }
}
