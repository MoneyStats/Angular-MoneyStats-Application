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
import { Wallet } from '../data/class/dashboard.class';
import { CryptoDashboard } from '../data/class/crypto.class';

@Injectable({
  providedIn: 'root',
})
export class CryptoService {
  environment = environment;
  public user: User = new User();
  public currency: string = Coin.USD;

  constructor(
    private http: HttpClient,
    public swalService: SwalService,
    private router: Router
  ) {}

  getCryptoDashboard(): Observable<ResponseModel> {
    return this.http.get<any>(environment.getCryptoDashboardMock);
  }

  getCryptoPrice(): Observable<ResponseModel> {
    return this.http.get<any>(environment.getCryptoPriceMock);
  }
}
