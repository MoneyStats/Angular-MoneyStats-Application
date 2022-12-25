import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { Coin, CoinSymbol } from '../data/class/coin';
import { Github, User } from '../data/class/user.class';
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

  syncGithubUser(user: string) {
    this.swalService.syncGithubUser(user);
    this.updateGithubData();
  }

  updateGithubUser() {
    this.user.github = this.swalService.githubAccount;
  }

  updateGithubData() {
    this.updateGithubUser();
    if (this.user.github === undefined) {
      setTimeout(() => {
        this.updateGithubData();
      }, 100 * 10);
    } else {
      this.user!.profilePhoto = this.user.github.avatar_url!;
    }
  }
}
