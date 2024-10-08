import { Injectable } from '@angular/core';
import { Observable, switchMap, timer } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Utils } from './utils.service';

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
    return Utils.copyObject(this.dashboardDataCache);
  }

  cacheDashboardData(dashboard: any) {
    if (environment.cacheEnable)
      this.dashboardDataCache = Utils.copyObject(dashboard);
  }

  getResumeCache() {
    return Utils.copyObject(this.resumeDataCache);
  }

  cacheResumeData(resume: any) {
    if (environment.cacheEnable)
      this.resumeDataCache = Utils.copyObject(resume);
  }

  getWalletsCache() {
    return Utils.copyObject(this.walletsDataCache);
  }

  cacheWalletsData(wallets: any) {
    if (environment.cacheEnable)
      this.walletsDataCache = Utils.copyObject(wallets);
  }

  getCryptoDashboardCache() {
    return Utils.copyObject(this.cryptoDashboardDataCache);
  }

  cacheCryptoDashboardData(dashboard: any) {
    if (environment.cacheEnable)
      this.cryptoDashboardDataCache = Utils.copyObject(dashboard);
  }

  getCryptoResumeCache() {
    return Utils.copyObject(this.cryptoResumeDataCache);
  }

  cacheCryptoResumeData(resume: any) {
    if (environment.cacheEnable)
      this.cryptoResumeDataCache = Utils.copyObject(resume);
  }

  getAssetsCache() {
    return Utils.copyObject(this.assetsDataCache);
  }

  cacheAssetsData(assets: any) {
    if (environment.cacheEnable)
      this.assetsDataCache = Utils.copyObject(assets);
  }

  /**
   * @MarketDatas
   */
  getMarketDataByCurrencyCache() {
    return Utils.copyObject(this.marketDataByCurrencyCache);
  }

  cacheMarketDataByCurrencyData(marketDatas: any) {
    if (environment.cacheEnable)
      this.marketDataByCurrencyCache = Utils.copyObject(marketDatas);
  }
}
