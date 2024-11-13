import { Injectable } from '@angular/core';
import { Observable, switchMap, timer } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Utils } from './utils.service';
import { SharedService } from './shared.service';

@Injectable({
  providedIn: 'root',
})
export class CacheService {
  environment = environment;
  private cacheTimeout: number = environment.cacheTimeout;

  // App Data
  private dashboardDataCache: any;
  private resumeDataCache: { [year: number]: any } = {};
  private historyDataCache: any;
  private getWalletsDataCache: any;
  private getWalletsCryptoDataCache: any;
  private getWalletByIdDataCache: { [walletId: number]: any } = {};

  // Crypto Data
  private cryptoDashboardDataCache: any;
  private cryptoResumeDataCache: { [year: number]: any } = {};
  private historyCryptoDataCache: any;
  private assetsDataCache: any;
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
    this.cryptoDashboardDataCache = null;
    this.cryptoResumeDataCache = {};
    this.assetsDataCache = null;
    this.getWalletsDataCache = null;
    this.dashboardDataCache = null;
    this.resumeDataCache = {};
    this.marketDataByCurrencyCache = null;
    this.getWalletByIdDataCache = {};
    this.getAssetsByIdentifierDataCache = {};
    this.getWalletsCryptoDataCache = null;
    this.historyCryptoDataCache = null;
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

  cacheWalletByIdData(wallet: any) {
    if (environment.cacheEnable)
      this.getWalletByIdDataCache[wallet.id] = Utils.copyObject(wallet);
  }

  getWalletsCryptoCache() {
    return Utils.copyObject(this.getWalletsCryptoDataCache);
  }

  cacheWalletsCryptoData(wallets: any) {
    if (environment.cacheEnable)
      this.getWalletsCryptoDataCache = Utils.copyObject(wallets);
  }
  /** END Wallets */

  /** @Assets  */
  getAssetsCache() {
    return Utils.copyObject(this.assetsDataCache);
  }

  cacheAssetsData(assets: any) {
    if (environment.cacheEnable)
      this.assetsDataCache = Utils.copyObject(assets);
  }

  getAssetsByIdentifierCache(identifier: string) {
    return Utils.copyObject(
      this.getAssetsByIdentifierDataCache[identifier] || null
    );
  }

  cacheAssetsByIdentifierCache(asset: any) {
    if (environment.cacheEnable)
      this.getAssetsByIdentifierDataCache[asset.identifier] =
        Utils.copyObject(asset);
  }
  /** END Assets  */

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
  /**
   * END @MarketDatas
   */

  /**
   * @App
   */
  getDashboardCache() {
    return Utils.copyObject(this.dashboardDataCache);
  }

  cacheDashboardData(dashboard: any) {
    if (environment.cacheEnable)
      this.dashboardDataCache = Utils.copyObject(dashboard);
  }

  getResumeCache(year: number) {
    return Utils.copyObject(this.resumeDataCache[year] || null);
  }

  cacheResumeData(resume: any, year: number) {
    if (environment.cacheEnable)
      this.resumeDataCache[year] = Utils.copyObject(resume);
  }

  getHistoryCache() {
    return Utils.copyObject(this.historyDataCache);
  }

  cacheHistoryData(history: any) {
    if (environment.cacheEnable)
      this.historyDataCache = Utils.copyObject(history);
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

  cacheCryptoDashboardData(dashboard: any) {
    if (environment.cacheEnable)
      this.cryptoDashboardDataCache = Utils.copyObject(dashboard);
  }

  getCryptoResumeCache(year: number) {
    return Utils.copyObject(this.cryptoResumeDataCache[year] || null);
  }

  cacheCryptoResumeData(resume: any, year: number) {
    if (environment.cacheEnable)
      this.cryptoResumeDataCache[year] = Utils.copyObject(resume);
  }

  getCryptoHistoryCache() {
    return Utils.copyObject(this.historyCryptoDataCache);
  }

  cacheCryptoHistoryData(history: any) {
    if (environment.cacheEnable)
      this.historyCryptoDataCache = Utils.copyObject(history);
  }
  /**
   * END @Crypto_Data
   */
}
