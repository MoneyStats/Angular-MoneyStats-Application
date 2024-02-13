import { Injectable } from '@angular/core';
import { switchMap, timer } from 'rxjs';
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
      .pipe(switchMap(() => this.clearCache()))
      .subscribe();
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
    this.dashboardDataCache = deepCopy(dashboard);
  }

  getResumeCache() {
    return deepCopy(this.resumeDataCache);
  }

  cacheResumeData(resume: any) {
    this.resumeDataCache = deepCopy(resume);
  }

  getWalletsCache() {
    return deepCopy(this.walletsDataCache);
  }

  cacheWalletsData(wallets: any) {
    this.walletsDataCache = deepCopy(wallets);
  }

  getCryptoDashboardCache() {
    return deepCopy(this.cryptoDashboardDataCache);
  }

  cacheCryptoDashboardData(dashboard: any) {
    this.cryptoDashboardDataCache = deepCopy(dashboard);
  }

  getCryptoResumeCache() {
    return deepCopy(this.cryptoResumeDataCache);
  }

  cacheCryptoResumeData(resume: any) {
    this.cryptoResumeDataCache = deepCopy(resume);
  }

  getAssetsCache() {
    return deepCopy(this.assetsDataCache);
  }

  cacheAssetsData(assets: any) {
    this.assetsDataCache = deepCopy(assets);
  }

  /**
   * @MarketDatas
   */
  getMarketDataByCurrencyCache() {
    return deepCopy(this.marketDataByCurrencyCache);
  }

  cacheMarketDataByCurrencyData(marketDatas: any) {
    this.marketDataByCurrencyCache = deepCopy(marketDatas);
  }
}
