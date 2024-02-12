import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CoinSymbol } from '../data/class/coin';
import { ResponseModel } from '../data/class/generic.class';
import { User } from '../data/class/user.class';
import { StorageConstant } from '../data/constant/constant';
import { SwalService } from '../utils/swal.service';
import { Wallet } from '../data/class/dashboard.class';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  environment = environment;
  isOnboardingCrypto: boolean = false;
  public user: User = new User();
  public coinSymbol: string = CoinSymbol.USD;

  constructor(private http: HttpClient, public swalService: SwalService) {}

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

  vibrate() {
    navigator.vibrate([5]);
  }
}
