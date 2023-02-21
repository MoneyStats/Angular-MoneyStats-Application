import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { Coin, CoinSymbol } from '../data/class/coin';
import { ResponseModel } from '../data/class/generic.class';
import { Github, GithubIssues, MockUser, User } from '../data/class/user.class';
import { StorageConstant } from '../data/constant/constant';
import { SwalService } from '../utils/swal.service';
import { DashboardService } from './dashboard.service';
import { StatsService } from './stats.service';
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
    private router: Router,
    private statsService: StatsService
  ) {}

  setValue() {
    switch (this.user?.currency) {
      case Coin.EUR:
        this.coinSymbol = CoinSymbol.EUR;
        break;
      case Coin.USD:
        this.coinSymbol = CoinSymbol.USD;
        break;
      case Coin.GBP:
        this.coinSymbol = CoinSymbol.GBP;
        break;
      default:
        break;
    }

    this.dashboardService.coinSymbol = this.coinSymbol;
    this.walletService.coinSymbol = this.coinSymbol;
  }

  setUserGlobally() {
    this.walletService.user = this.user;
    this.dashboardService.user = this.user;
    this.statsService.user = this.user;
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
      this.user.githubUser = JSON.stringify(this.user.github);
      this.updateUserData(this.user).subscribe((res) => {
        this.user = res.data;
        this.user.github = JSON.parse(this.user.githubUser!);
      });
    }
  }

  logout() {
    localStorage.removeItem(StorageConstant.ACCESSTOKEN);
    this.router.navigate(['auth/login']);
  }

  register(user: User, invitationCode: string): Observable<ResponseModel> {
    return this.http.post<ResponseModel>(
      environment.registerDataUrl + '?invitationCode=' + invitationCode,
      user
    );
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

  checkLogin(authToken: string): Observable<ResponseModel> {
    if (this.user?.mockedUser) {
      return this.http.get<ResponseModel>(environment.getUserUrl);
    } else {
      const headers = new HttpHeaders({ authToken: authToken! });
      return this.http.get<ResponseModel>(environment.checkLoginDataUrl, {
        headers: headers,
      });
    }
  }

  getTemplate(): Observable<any> {
    return this.http.get<any>(environment.getTemplate);
  }

  openIssues(githubIssues: GithubIssues): Observable<ResponseModel> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.post<ResponseModel>(
      environment.openGithubIssues,
      githubIssues,
      {
        headers: headers,
      }
    );
  }

  updateUserData(user: User): Observable<ResponseModel> {
    const authToken = localStorage.getItem(StorageConstant.ACCESSTOKEN);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      authToken: authToken!,
    });
    if (this.user?.mockedUser) {
      let response: ResponseModel = new ResponseModel();
      response.data = user;
      return of(response);
    } else {
      return this.http.post<ResponseModel>(
        environment.updateUserDataUrl,
        user,
        {
          headers: headers,
        }
      );
    }
  }
}
