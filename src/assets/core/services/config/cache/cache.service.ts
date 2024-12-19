import { Injectable } from '@angular/core';
import { Observable, switchMap, timer } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Utils } from '../utils.service';
import { SharedService } from '../shared.service';
import { ResponseModel } from '../../../data/class/generic.class';
import { CacheData } from './cache.constant';

@Injectable({
  providedIn: 'root',
})
export class CacheService {
  environment = environment;
  private cacheTimeout: number = environment.cacheTimeout;

  // App Data
  private dashboardDataCache?: ResponseModel;
  private resumeDataCache: { [year: number]: any } = {};
  private historyDataCache?: ResponseModel;
  private getWalletsDataCache?: ResponseModel;
  private getWalletsCryptoDataCache?: ResponseModel;
  private getWalletByIdDataCache: { [walletId: number]: any } = {};

  // Crypto Data
  private cryptoDashboardDataCache?: ResponseModel;
  private cryptoResumeDataCache: { [year: number]: any } = {};
  private historyCryptoDataCache?: ResponseModel;
  private assetsDataCache?: ResponseModel;
  private getAssetsByIdentifierDataCache: { [identifier: string]: any } = {};

  // Market Data Cache
  private marketDataByCurrencyCache: any;

  constructor(private shared: SharedService) {
    timer(0, this.cacheTimeout)
      .pipe(switchMap(() => this.clearCacheObservable()))
      .subscribe();
  }

  clearCacheObservable(): Observable<any> {
    this.clearCache();
    return new Observable((observer) => {
      observer.next(null);
      observer.complete();
    });
  }

  clearCache(): any {
    this.shared.clearData();
    this.removeDashboardCache();
    this.removeResumeData();
    this.removeHistoryData();
    this.removeWalletsData();
    this.removeWalletByIdData();
    this.removeWalletsCryptoData();
    this.removeAssetsData();
    this.removeAssetsByIdentifierCache();
    this.removeMarketDataByCurrencyData();
    this.removeCryptoDashboardData();
    this.removeCryptoResumeData();
    this.removeCryptoHistoryData();
  }

  /**
   * @App
   */
  getDashboardCache() {
    let data = Utils.copyObject(this.dashboardDataCache);
    return data;
  }

  cacheDashboardData(response: any) {
    if (environment.cacheEnable) {
      this.dashboardDataCache = Utils.copyObject(response);
    }
  }

  private removeDashboardCache() {
    this.dashboardDataCache = undefined;
  }

  getResumeCache(year: number) {
    let data = Utils.copyObject(this.resumeDataCache[year] || null);
    return data;
  }

  cacheResumeData(response: any, year: number) {
    if (environment.cacheEnable) {
      this.resumeDataCache[year] = Utils.copyObject(response);
    }
  }

  private removeResumeData(): void {
    this.resumeDataCache = {}; // Resetta la cache in memoria
  }

  getHistoryCache() {
    let data = Utils.copyObject(this.historyDataCache);
    return data;
  }

  cacheHistoryData(response: any) {
    if (environment.cacheEnable) {
      this.historyDataCache = Utils.copyObject(response);
    }
  }

  private removeHistoryData() {
    this.historyDataCache = undefined;
  }
  /**
   * END @App
   */

  /** @Wallets */
  getWalletsCache() {
    let data = Utils.copyObject(this.getWalletsDataCache);
    return data;
  }

  cacheWalletsData(wallets: any) {
    if (environment.cacheEnable) {
      this.getWalletsDataCache = Utils.copyObject(wallets);
    }
  }

  private removeWalletsData() {
    this.getWalletsDataCache = undefined;
  }

  getWalletByIdCache(id: number) {
    let data = Utils.copyObject(this.getWalletByIdDataCache[id] || null);
    return data;
  }

  cacheWalletByIdData(response: any, walletId: number) {
    if (environment.cacheEnable) {
      this.getWalletByIdDataCache[walletId] = Utils.copyObject(response);
    }
  }

  private removeWalletByIdData(): void {
    this.getWalletByIdDataCache = {};
  }

  getWalletsCryptoCache() {
    let data = Utils.copyObject(this.getWalletsCryptoDataCache);
    return data;
  }

  cacheWalletsCryptoData(response: any) {
    if (environment.cacheEnable) {
      this.getWalletsCryptoDataCache = Utils.copyObject(response);
    }
  }

  private removeWalletsCryptoData() {
    this.getWalletsCryptoDataCache = undefined;
  }
  /** END Wallets */

  /** @Assets  */
  getAssetsCache() {
    let data = Utils.copyObject(this.assetsDataCache);
    return data;
  }

  cacheAssetsData(response: any) {
    if (environment.cacheEnable) {
      this.assetsDataCache = Utils.copyObject(response);
    }
  }

  removeAssetsData() {
    this.assetsDataCache = undefined;
  }

  getAssetsByIdentifierCache(identifier: string) {
    let data = Utils.copyObject(
      this.getAssetsByIdentifierDataCache[identifier] || null
    );
    return data;
  }

  cacheAssetsByIdentifierCache(response: any, identifier: string) {
    if (environment.cacheEnable) {
      this.getAssetsByIdentifierDataCache[identifier] =
        Utils.copyObject(response);
    }
  }

  private removeAssetsByIdentifierCache(): void {
    this.getAssetsByIdentifierDataCache = {};
  }
  /** END Assets  */

  /**
   * @MarketDatas
   */
  getMarketDataByCurrencyCache() {
    let data = Utils.copyObject(this.marketDataByCurrencyCache);
    return data;
  }

  cacheMarketDataByCurrencyData(response: any) {
    if (environment.cacheEnable) {
      this.marketDataByCurrencyCache = Utils.copyObject(response);
    }
  }

  private removeMarketDataByCurrencyData() {
    this.marketDataByCurrencyCache = null;
  }
  /**
   * END @MarketDatas
   */

  /**
   * @Crypto_Data
   */
  getCryptoDashboardCache() {
    let data = Utils.copyObject(this.cryptoDashboardDataCache);
    return data;
  }

  cacheCryptoDashboardData(response: any) {
    if (environment.cacheEnable) {
      this.cryptoDashboardDataCache = Utils.copyObject(response);
    }
  }

  private removeCryptoDashboardData() {
    this.cryptoDashboardDataCache = undefined;
  }

  getCryptoResumeCache(year: number) {
    let data = Utils.copyObject(this.cryptoResumeDataCache[year] || null);
    return data;
  }

  cacheCryptoResumeData(response: any, year: number) {
    if (environment.cacheEnable) {
      this.cryptoResumeDataCache[year] = Utils.copyObject(response);
    }
  }

  private removeCryptoResumeData(): void {
    this.cryptoResumeDataCache = {}; // Resetta la cache in memoria
  }

  getCryptoHistoryCache() {
    let data = Utils.copyObject(this.historyCryptoDataCache);
    return data;
  }

  cacheCryptoHistoryData(response: any) {
    if (environment.cacheEnable) {
      this.historyCryptoDataCache = Utils.copyObject(response);
    }
  }

  private removeCryptoHistoryData() {
    this.historyCryptoDataCache = undefined;
  }
  /**
   * END @Crypto_Data
   */
}
