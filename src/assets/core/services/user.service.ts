import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { Coin, CoinSymbol } from '../data/class/coin';
import { ResponseModel } from '../data/class/generic.class';
import { Github, MockUser, User } from '../data/class/user.class';
import { StorageConstant } from '../data/constant/modal.constant';
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
    public swalService: SwalService,
    private router: Router
  ) {}

  setValue() {
    if (this.user?.currency === Coin.EUR) this.coinSymbol = CoinSymbol.EUR;
    else if (this.user?.currency === Coin.EUR) this.coinSymbol = CoinSymbol.EUR;

    this.dashboardService.coinSymbol = this.coinSymbol;
    this.walletService.coinSymbol = this.coinSymbol;
  }

  setUserGlobally() {
    this.walletService.user = this.user;
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

  logout() {
    localStorage.removeItem(StorageConstant.ACCESSTOKEN);
    this.router.navigate(['auth/login']);
  }

  register(user: User): Observable<ResponseModel> {
    return this.http.post<ResponseModel>(environment.registerDataUrl, user);
  }

  login(username: string, password: string): Observable<ResponseModel> {
    const url =
      environment.loginDataUrl +
      '?username=' +
      username +
      '&password=' +
      password;
    if (username === MockUser.USERNAME && password === MockUser.PASSWORD) {
      return this.http.get<ResponseModel>(environment.getUserUrl);
    } else {
      return this.http.post<ResponseModel>(url, {});
    }
  }
}
