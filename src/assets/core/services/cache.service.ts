import { Injectable } from '@angular/core';
import { Observable, switchMap, timer } from 'rxjs';
import { environment } from 'src/environments/environment';
import { deepCopy } from '@angular-devkit/core/src/utils/object';

@Injectable({
  providedIn: 'root',
})
export class CacheService {
  environment = environment;
  private cacheTimeout: number = environment.cacheTimeout;

  // App Data
  private dashboardDataCache: any;
  private resumeDataCache: any;
  private walletsDataCache: any;

  // Crypto Data
  private cryptoDashboardDataCache: any;
  private cryptoResumeDataCache: any;
  private assetsDataCache: any;

  // Market Data Cache
  private marketDataByCurrencyCache: any;

  constructor() {
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
    this.cryptoDashboardDataCache = null;
    this.cryptoResumeDataCache = null;
    this.assetsDataCache = null;
    this.walletsDataCache = null;
    this.dashboardDataCache = null;
    this.resumeDataCache = null;
    this.marketDataByCurrencyCache = null;
  }

  getDashboardCache() {
    return deepCopy(this.dashboardDataCache);
  }

  cacheDashboardData(dashboard: any) {
    if (environment.cacheEnable) this.dashboardDataCache = deepCopy(dashboard);
  }

  getResumeCache() {
    return deepCopy(this.resumeDataCache);
  }

  cacheResumeData(resume: any) {
    if (environment.cacheEnable) this.resumeDataCache = deepCopy(resume);
  }

  getWalletsCache() {
    return deepCopy(this.walletsDataCache);
  }

  cacheWalletsData(wallets: any) {
    if (environment.cacheEnable) this.walletsDataCache = deepCopy(wallets);
  }

  getCryptoDashboardCache() {
    return deepCopy(this.cryptoDashboardDataCache);
  }

  cacheCryptoDashboardData(dashboard: any) {
    if (environment.cacheEnable)
      this.cryptoDashboardDataCache = deepCopy(dashboard);
  }

  getCryptoResumeCache() {
    return deepCopy(this.cryptoResumeDataCache);
  }

  cacheCryptoResumeData(resume: any) {
    if (environment.cacheEnable) this.cryptoResumeDataCache = deepCopy(resume);
  }

  getAssetsCache() {
    return deepCopy(this.assetsDataCache);
  }

  cacheAssetsData(assets: any) {
    if (environment.cacheEnable) this.assetsDataCache = deepCopy(assets);
  }

  /**
   * @MarketDatas
   */
  getMarketDataByCurrencyCache() {
    return deepCopy(this.marketDataByCurrencyCache);
  }

  cacheMarketDataByCurrencyData(marketDatas: any) {
    if (environment.cacheEnable)
      this.marketDataByCurrencyCache = deepCopy(marketDatas);
  }
}
