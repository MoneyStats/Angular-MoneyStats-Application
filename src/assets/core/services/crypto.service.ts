import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, firstValueFrom, isObservable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { Coin } from '../data/class/coin';
import { ResponseModel } from '../data/class/generic.class';
import { User } from '../data/class/user.class';
import { StorageConstant } from '../data/constant/constant';
import { SwalService } from '../utils/swal.service';
import { Wallet } from '../data/class/dashboard.class';
import { Asset, CryptoDashboard } from '../data/class/crypto.class';

@Injectable({
  providedIn: 'root',
})
export class CryptoService {
  environment = environment;
  public user: User = new User();
  public currency: string = Coin.USD;
  public cryptoDashboard: CryptoDashboard = new CryptoDashboard();
  public assets: Asset[] = [];
  public operationsMap: Map<string, any[]> = new Map();

  // Used for history table
  public cryptoResume: Map<string, CryptoDashboard> = new Map<
    string,
    CryptoDashboard
  >();

  // Used for details
  public asset?: Asset;

  constructor(private http: HttpClient, public swalService: SwalService) {}

  getCryptoDashboard(): Observable<ResponseModel> {
    const authToken = localStorage.getItem(StorageConstant.ACCESSTOKEN);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: authToken!,
    });
    if (this.user.mockedUser) {
      return this.http.get<any>(environment.getCryptoDashboardMock);
    } else {
      return this.http.get<any>(environment.getCryptoDashboardDataUrl, {
        headers: headers,
      });
    }
  }

  getCryptoPrice(currency: string): Observable<ResponseModel> {
    const authToken = localStorage.getItem(StorageConstant.ACCESSTOKEN);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: authToken!,
    });
    if (this.user.mockedUser) {
      return this.http.get<any>(environment.getCryptoPriceMock);
    } else {
      const url = environment.getMarketDataUrl + '?currency=' + currency;
      return this.http.get<any>(url, {
        headers: headers,
      });
    }
  }

  getCryptoResume(): Observable<ResponseModel> {
    const authToken = localStorage.getItem(StorageConstant.ACCESSTOKEN);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: authToken!,
    });
    if (this.user.mockedUser) {
      return this.http.get<any>(environment.getCryptoResumeMock);
    } else {
      return this.http.get<any>(environment.getCryptoResumeDataUrl, {
        headers: headers,
      });
    }
  }

  getCryptoAssets(): Observable<ResponseModel> {
    const authToken = localStorage.getItem(StorageConstant.ACCESSTOKEN);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: authToken!,
    });
    if (this.user.mockedUser) {
      return this.http.get<any>(environment.getCryptoAssetsMock);
    } else {
      return this.http.get<any>(environment.getCryptoAssetDataUrl, {
        headers: headers,
      });
    }
  }

  getCryptoDetails(identifier: string): Observable<ResponseModel> {
    const authToken = localStorage.getItem(StorageConstant.ACCESSTOKEN);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: authToken!,
    });
    if (this.user.mockedUser) {
      return this.http.get<any>(environment.getCryptoDetailsMock);
    } else {
      const url =
        environment.getCryptoDetailsDataUrl + '?identifier=' + identifier;
      return this.http.get<any>(url, {
        headers: headers,
      });
    }
  }

  addOrUpdateCryptoAsset(wallet: Wallet): Observable<ResponseModel> {
    const authToken = localStorage.getItem(StorageConstant.ACCESSTOKEN);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: authToken!,
    });
    if (this.user.mockedUser) {
      let response: ResponseModel = new ResponseModel();
      response.data = wallet;
      return of(response);
    } else {
      return this.http.post<any>(environment.addCryptoAssetDataUrl, wallet, {
        headers: headers,
      });
    }
  }

  getAssetList(wallets: Wallet[]): Asset[] {
    const allAssets: Array<Asset> = [];
    wallets.forEach((wallet) => {
      wallet.assets.forEach((asset) => {
        if (allAssets.find((a) => a.name == asset.name)) {
          const index = allAssets.indexOf(
            allAssets.find((a) => a.name == asset.name)!
          );
          allAssets[index].balance! += asset.balance!;
          allAssets[index].value! += asset.value!;
          allAssets[index].performance! =
            (allAssets[index].performance! + asset.performance!) / 2;

          allAssets[index].trend! = allAssets[index].trend! + asset.trend!;

          asset.history?.forEach((history) => {
            let hist = allAssets[index].history!.find(
              (h) => h.date == history.date
            )!;
            allAssets[index].history!.find(
              (h) => h.date == history.date
            )!.balance += history.balance;
            allAssets[index].history!.find(
              (h) => h.date == history.date
            )!.trend += history.trend;
            allAssets[index].history!.find(
              (h) => h.date == history.date
            )!.percentage = (hist.percentage + history.percentage) / 2;
          });

          asset.operations.forEach((o) => {
            allAssets[index].operations.push(o);
          });
          allAssets[index].operations.sort((o) =>
            o.exitDate != undefined ? o.exitDate : o.entryDate
          );
        } else allAssets.push(asset);
      });
    });
    return allAssets;
  }
}
