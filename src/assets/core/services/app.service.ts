import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CoinSymbol } from '../data/class/coin';
import { ResponseModel } from '../data/class/generic.class';
import { GithubIssues, User } from '../data/class/user.class';
import { StorageConstant } from '../data/constant/constant';
import { SwalService } from '../utils/swal.service';
import { Wallet } from '../data/class/dashboard.class';
import { CacheService } from './cache.service';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  environment = environment;
  isOnboardingCrypto: boolean = false;
  public user: User = new User();
  public coinSymbol: string = CoinSymbol.USD;

  constructor(
    private http: HttpClient,
    public swalService: SwalService,
    private cache: CacheService
  ) {}

  backupData(): Observable<ResponseModel> {
    const authToken = localStorage.getItem(StorageConstant.ACCESSTOKEN);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: authToken!,
    });
    if (this.user?.mockedUser) {
      let response: ResponseModel = new ResponseModel();
      return of(response);
    } else {
      return this.http.get<ResponseModel>(environment.backupDataUrl, {
        headers: headers,
      });
    }
  }

  restoreData(wallets: Wallet[]): Observable<ResponseModel> {
    const authToken = localStorage.getItem(StorageConstant.ACCESSTOKEN);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: authToken!,
    });
    if (this.user?.mockedUser) {
      let response: ResponseModel = new ResponseModel();
      return of(response);
    } else {
      return this.http.post<ResponseModel>(
        environment.restoreDataUrl,
        wallets,
        {
          headers: headers,
        }
      );
    }
  }

  cleanCache(): Observable<ResponseModel> {
    this.cache.clearCache();
    const authToken = localStorage.getItem(StorageConstant.ACCESSTOKEN);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: authToken!,
    });
    if (this.user?.mockedUser) {
      let response: ResponseModel = new ResponseModel();
      return of(response);
    } else {
      return this.http.patch<ResponseModel>(environment.cleanCacheUrl, null, {
        headers: headers,
      });
    }
  }

  importMarketData(): Observable<ResponseModel> {
    this.cache.clearCache();
    const authToken = localStorage.getItem(StorageConstant.ACCESSTOKEN);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: authToken!,
    });
    if (this.user?.mockedUser) {
      let response: ResponseModel = new ResponseModel();
      return of(response);
    } else {
      return this.http.patch<ResponseModel>(environment.marketDataUrl, null, {
        headers: headers,
      });
    }
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

  getTemplate(): Observable<any> {
    return this.http.get<any>(environment.getTemplate);
  }
}
