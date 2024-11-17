import { Injectable } from '@angular/core';
import { Observable, switchMap, timer } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Utils } from './utils.service';
import { SharedService } from './shared.service';
import { ResponseModel } from '../../data/class/generic.class';

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
    this.cryptoDashboardDataCache = undefined;
    this.cryptoResumeDataCache = {};
    this.assetsDataCache = undefined;
    this.getWalletsDataCache = undefined;
    this.dashboardDataCache = undefined;
    this.resumeDataCache = {};
    this.marketDataByCurrencyCache = null;
    this.getWalletByIdDataCache = {};
    this.getAssetsByIdentifierDataCache = {};
    this.getWalletsCryptoDataCache = undefined;
    this.historyCryptoDataCache = undefined;
  }

  /** @Wallets */
  getWalletsCache() {
    return Utils.copyObject(this.getWalletsDataCache);
  }

  cacheWalletsData(wallets: any) {
    if (environment.cacheEnable)
      this.getWalletsDataCache = Utils.copyObject(wallets);
  }

  getWalletByIdCache(id: number) {
    return Utils.copyObject(this.getWalletByIdDataCache[id] || null);
  }

  cacheWalletByIdData(response: any, walletId: number) {
    if (environment.cacheEnable)
      this.getWalletByIdDataCache[walletId] = Utils.copyObject(response);
  }

  getWalletsCryptoCache() {
    return Utils.copyObject(this.getWalletsCryptoDataCache);
  }

  cacheWalletsCryptoData(response: any) {
    if (environment.cacheEnable)
      this.getWalletsCryptoDataCache = Utils.copyObject(response);
  }
  /** END Wallets */

  /** @Assets  */
  getAssetsCache() {
    return Utils.copyObject(this.assetsDataCache);
  }

  cacheAssetsData(response: any) {
    if (environment.cacheEnable)
      this.assetsDataCache = Utils.copyObject(response);
  }

  getAssetsByIdentifierCache(identifier: string) {
    return Utils.copyObject(
      this.getAssetsByIdentifierDataCache[identifier] || null
    );
  }

  cacheAssetsByIdentifierCache(response: any, identifier: string) {
    if (environment.cacheEnable)
      this.getAssetsByIdentifierDataCache[identifier] =
        Utils.copyObject(response);
  }
  /** END Assets  */

  /**
   * @MarketDatas
   */
  getMarketDataByCurrencyCache() {
    return Utils.copyObject(this.marketDataByCurrencyCache);
  }

  cacheMarketDataByCurrencyData(response: any) {
    if (environment.cacheEnable)
      this.marketDataByCurrencyCache = Utils.copyObject(response);
  }
  /**
   * END @MarketDatas
   */

  /**
   * @App
   */
  getDashboardCache() {
    return Utils.copyObject(this.dashboardDataCache);
  }

  cacheDashboardData(response: any) {
    if (environment.cacheEnable)
      this.dashboardDataCache = Utils.copyObject(response);
  }

  getResumeCache(year: number) {
    return Utils.copyObject(this.resumeDataCache[year] || null);
  }

  cacheResumeData(response: any, year: number) {
    if (environment.cacheEnable)
      this.resumeDataCache[year] = Utils.copyObject(response);
  }

  getHistoryCache() {
    return Utils.copyObject(this.historyDataCache);
  }

  cacheHistoryData(response: any) {
    if (environment.cacheEnable)
      this.historyDataCache = Utils.copyObject(response);
  }
  /**
   * END @App
   */

  /**
   * @Crypto_Data
   */
  getCryptoDashboardCache() {
    return Utils.copyObject(this.cryptoDashboardDataCache);
  }

  cacheCryptoDashboardData(response: any) {
    if (environment.cacheEnable)
      this.cryptoDashboardDataCache = Utils.copyObject(response);
  }

  getCryptoResumeCache(year: number) {
    return Utils.copyObject(this.cryptoResumeDataCache[year] || null);
  }

  cacheCryptoResumeData(response: any, year: number) {
    if (environment.cacheEnable)
      this.cryptoResumeDataCache[year] = Utils.copyObject(response);
  }

  getCryptoHistoryCache() {
    return Utils.copyObject(this.historyCryptoDataCache);
  }

  cacheCryptoHistoryData(response: any) {
    if (environment.cacheEnable)
      this.historyCryptoDataCache = Utils.copyObject(response);
  }
  /**
   * END @Crypto_Data
   */
}
