import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Coin, CoinSymbol } from '../data/class/coin';
import { User } from '../data/class/user.class';
import { DashboardService } from './dashboard.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  environment = environment;
  public user: User = new User();
  public coinSymbol: string = CoinSymbol.USD;
  constructor(
    private http: HttpClient,
    private dashboardService: DashboardService
  ) {}

  getUser(): Observable<User> {
    return this.http.get<User>(environment.getUserUrl);
  }

  setValue() {
    if (this.user?.value === Coin.EUR) this.coinSymbol = CoinSymbol.EUR;
    else if (this.user?.value === Coin.EUR) this.coinSymbol = CoinSymbol.EUR;

    this.dashboardService.coinSymbol = this.coinSymbol;
  }
}
