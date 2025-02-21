import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AccessSphereResponse, User } from '../../data/class/user.class';
import { Coin, CoinSymbol } from '../../data/class/coin';
import { SwalService } from '../../utils/swal.service';
import { AuthService } from './auth.service';
import { StorageConstant } from '../../data/constant/constant';
import { Utils } from '../config/utils.service';

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

  /**
   * @deprecated
   */
  public setUserGlobally_old(user: User): void {
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
    this.setValue(
      user.attributes.money_stats_settings.currency,
      user.attributes.money_stats_settings.cryptoCurrency
    );
    user.attributes.money_stats_settings.cryptoCurrencySymbol =
      this.cryptoCurrency;
    user.attributes.money_stats_settings.currencySymbol = this.currency;
    localStorage.setItem(StorageConstant.USERACCOUNT, JSON.stringify(user));
    this.user = user;
    const u = Object.getPrototypeOf(this).constructor;
    u.userStatic = user;
    this.authService.user = user;
  }

  public setUserGlobally(access_sphere_response: AccessSphereResponse): void {
    const token = access_sphere_response.token;
    if (!Utils.isNullOrEmpty(token)) {
      localStorage.setItem(
        StorageConstant.ACCESSTOKEN,
        token?.token_type + ' ' + token?.access_token
      );
      localStorage.setItem(StorageConstant.AUTHTOKEN, JSON.stringify(token));
    }
    const user = access_sphere_response.user!;
    this.setValue(
      user.attributes.money_stats_settings.currency,
      user.attributes.money_stats_settings.cryptoCurrency
    );
    user.attributes.money_stats_settings.currencySymbol = this.currency;
    localStorage.setItem(StorageConstant.USERACCOUNT, JSON.stringify(user));
    this.user = user;
    const u = Object.getPrototypeOf(this).constructor;
    u.userStatic = user;
    this.authService.user = user;
  }

  private setValue(currency: string, cryptoCurrency: string): void {
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
    if (cryptoCurrency) this.cryptoCurrency = cryptoCurrency;
  }

  public static getUserData(): User {
    const storage = localStorage.getItem(StorageConstant.USERACCOUNT);
    let user: User = this.userStatic;
    if (storage) return JSON.parse(storage);
    return user;
  }
}
