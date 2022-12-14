import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { Coin, CoinSymbol } from '../data/class/coin';
import { User } from '../data/class/user.class';
import { SwalService } from '../utils/swal.service';
import { DashboardService } from './dashboard.service';
import { WalletService } from './wallet.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  environment = environment;
  public user: User = new User();
  public coinSymbol: string = CoinSymbol.USD;
  public github: any;

  constructor(
    private http: HttpClient,
    private dashboardService: DashboardService,
    private walletService: WalletService,
    public swalService: SwalService
  ) {}

  getUser(): Observable<User> {
    return this.http.get<User>(environment.getUserUrl);
  }

  setValue() {
    if (this.user?.value === Coin.EUR) this.coinSymbol = CoinSymbol.EUR;
    else if (this.user?.value === Coin.EUR) this.coinSymbol = CoinSymbol.EUR;

    this.dashboardService.coinSymbol = this.coinSymbol;
    this.walletService.coinSymbol = this.coinSymbol;
  }

  getGithubUser(user: string) {
    this.swalService.getGithubUser(user);
  }

  updateGithubUser() {
    this.github = this.swalService.githubAccount;
  }
}
