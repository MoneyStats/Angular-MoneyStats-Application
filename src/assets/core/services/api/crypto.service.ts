import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Coin } from '../../data/class/coin';
import { ResponseModel } from '../../data/class/generic.class';
import { User } from '../../data/class/user.class';
import { StorageConstant } from '../../data/constant/constant';
import { SwalService } from '../../utils/swal.service';
import { Wallet } from '../../data/class/dashboard.class';
import { Asset, CryptoDashboard } from '../../data/class/crypto.class';
import { CacheService } from '../config/cache.service';

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

  constructor(
    private http: HttpClient,
    public swalService: SwalService,
    public cache: CacheService
  ) {}

  getCryptoDashboardData(): Observable<ResponseModel> {
    if (this.cache.getCryptoDashboardCache())
      return of(this.cache.getCryptoDashboardCache());
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

  getCryptoPriceData(currency: string): Observable<ResponseModel> {
    if (this.cache.getMarketDataByCurrencyCache())
      return of(this.cache.getMarketDataByCurrencyCache());
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

  getCryptoResumeData(): Observable<ResponseModel> {
    if (this.cache.getCryptoResumeCache())
      return of(this.cache.getCryptoResumeCache());
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

  getCryptoAssetsData(): Observable<ResponseModel> {
    if (this.cache.getAssetsCache()) return of(this.cache.getAssetsCache());
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
    this.cache.clearCache();
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

  addOrUpdateCryptoAssets(wallets: Wallet[]): Observable<ResponseModel> {
    this.cache.clearCache();
    const authToken = localStorage.getItem(StorageConstant.ACCESSTOKEN);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: authToken!,
    });
    if (this.user.mockedUser) {
      let response: ResponseModel = new ResponseModel();
      response.data = wallets;
      return of(response);
    } else {
      return this.http.post<any>(environment.addCryptoAssetsDataUrl, wallets, {
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
