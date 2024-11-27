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
    if (!data) return Utils.getFromSession(CacheData.DASHBOARD);
    return data;
  }

  cacheDashboardData(response: any) {
    if (environment.cacheEnable) {
      this.dashboardDataCache = Utils.copyObject(response);
      Utils.setInSession(CacheData.DASHBOARD, response);
    }
  }

  private removeDashboardCache() {
    this.dashboardDataCache = undefined;
    Utils.removeFromSession(CacheData.DASHBOARD);
  }

  getResumeCache(year: number) {
    let data = Utils.copyObject(this.resumeDataCache[year] || null);
    if (!data) return Utils.getFromSession(CacheData.RESUME + year);
    return data;
  }

  cacheResumeData(response: any, year: number) {
    if (environment.cacheEnable) {
      this.resumeDataCache[year] = Utils.copyObject(response);
      Utils.setInSession(CacheData.RESUME + year, response);
    }
  }

  private removeResumeData(): void {
    this.resumeDataCache = {}; // Resetta la cache in memoria

    // Rimuovi tutte le chiavi relative a RESUME dal sessionStorage
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && key.startsWith(CacheData.RESUME)) {
        Utils.removeFromSession(key);
        i--; // Aggiorna l'indice per compensare la rimozione
      }
    }
  }

  getHistoryCache() {
    let data = Utils.copyObject(this.historyDataCache);
    if (!data) return Utils.getFromSession(CacheData.HISTORY);
    return data;
  }

  cacheHistoryData(response: any) {
    if (environment.cacheEnable) {
      this.historyDataCache = Utils.copyObject(response);
      Utils.setInSession(CacheData.HISTORY, response);
    }
  }

  private removeHistoryData() {
    this.historyDataCache = undefined;
    Utils.removeFromSession(CacheData.HISTORY);
  }
  /**
   * END @App
   */

  /** @Wallets */
  getWalletsCache() {
    let data = Utils.copyObject(this.getWalletsDataCache);
    if (!data) return Utils.getFromSession(CacheData.WALLETS);
    return data;
  }

  cacheWalletsData(wallets: any) {
    if (environment.cacheEnable) {
      this.getWalletsDataCache = Utils.copyObject(wallets);
      Utils.setInSession(CacheData.WALLETS, wallets);
    }
  }

  private removeWalletsData() {
    this.getWalletsDataCache = undefined;
    Utils.removeFromSession(CacheData.WALLETS);
  }

  getWalletByIdCache(id: number) {
    let data = Utils.copyObject(this.getWalletByIdDataCache[id] || null);
    if (!data) return Utils.getFromSession(CacheData.WALLET_ID + id);
    return data;
  }

  cacheWalletByIdData(response: any, walletId: number) {
    if (environment.cacheEnable) {
      this.getWalletByIdDataCache[walletId] = Utils.copyObject(response);
      Utils.setInSession(CacheData.WALLET_ID + walletId, response);
    }
  }

  private removeWalletByIdData(): void {
    this.getWalletByIdDataCache = {};

    // Rimuovi tutte le chiavi relative a RESUME dal sessionStorage
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && key.startsWith(CacheData.WALLET_ID)) {
        Utils.removeFromSession(key);
        i--; // Aggiorna l'indice per compensare la rimozione
      }
    }
  }

  getWalletsCryptoCache() {
    let data = Utils.copyObject(this.getWalletsCryptoDataCache);
    if (!data) return Utils.getFromSession(CacheData.CRYPTO_WALLETS);
    return data;
  }

  cacheWalletsCryptoData(response: any) {
    if (environment.cacheEnable) {
      this.getWalletsCryptoDataCache = Utils.copyObject(response);
      Utils.setInSession(CacheData.CRYPTO_WALLETS, response);
    }
  }

  private removeWalletsCryptoData() {
    this.getWalletsCryptoDataCache = undefined;
    Utils.removeFromSession(CacheData.CRYPTO_WALLETS);
  }
  /** END Wallets */

  /** @Assets  */
  getAssetsCache() {
    let data = Utils.copyObject(this.assetsDataCache);
    if (!data) return Utils.getFromSession(CacheData.CRYPTO_ASSETS);
    return data;
  }

  cacheAssetsData(response: any) {
    if (environment.cacheEnable) {
      this.assetsDataCache = Utils.copyObject(response);
      Utils.setInSession(CacheData.CRYPTO_ASSETS, response);
    }
  }

  removeAssetsData() {
    this.assetsDataCache = undefined;
    Utils.removeFromSession(CacheData.CRYPTO_ASSETS);
  }

  getAssetsByIdentifierCache(identifier: string) {
    let data = Utils.copyObject(
      this.getAssetsByIdentifierDataCache[identifier] || null
    );
    if (!data)
      return Utils.getFromSession(
        CacheData.CRYPTO_ASSET_BY_IDENTIFIER + identifier
      );
    return data;
  }

  cacheAssetsByIdentifierCache(response: any, identifier: string) {
    if (environment.cacheEnable) {
      this.getAssetsByIdentifierDataCache[identifier] =
        Utils.copyObject(response);
      Utils.setInSession(
        CacheData.CRYPTO_ASSET_BY_IDENTIFIER + identifier,
        response
      );
    }
  }

  private removeAssetsByIdentifierCache(): void {
    this.getAssetsByIdentifierDataCache = {};

    // Rimuovi tutte le chiavi relative a RESUME dal sessionStorage
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && key.startsWith(CacheData.CRYPTO_ASSET_BY_IDENTIFIER)) {
        Utils.removeFromSession(key);
        i--; // Aggiorna l'indice per compensare la rimozione
      }
    }
  }
  /** END Assets  */

  /**
   * @MarketDatas
   */
  getMarketDataByCurrencyCache() {
    let data = Utils.copyObject(this.marketDataByCurrencyCache);
    if (!data) return Utils.getFromSession(CacheData.MARKET_DATA);
    return data;
  }

  cacheMarketDataByCurrencyData(response: any) {
    if (environment.cacheEnable) {
      this.marketDataByCurrencyCache = Utils.copyObject(response);
      Utils.setInSession(CacheData.MARKET_DATA, response);
    }
  }

  private removeMarketDataByCurrencyData() {
    this.marketDataByCurrencyCache = null;
    Utils.removeFromSession(CacheData.MARKET_DATA);
  }
  /**
   * END @MarketDatas
   */

  /**
   * @Crypto_Data
   */
  getCryptoDashboardCache() {
    let data = Utils.copyObject(this.cryptoDashboardDataCache);
    if (!data) return Utils.getFromSession(CacheData.CRYPTO_DASHBOARD);
    return data;
  }

  cacheCryptoDashboardData(response: any) {
    if (environment.cacheEnable) {
      this.cryptoDashboardDataCache = Utils.copyObject(response);
      Utils.setInSession(CacheData.CRYPTO_DASHBOARD, response);
    }
  }

  private removeCryptoDashboardData() {
    this.cryptoDashboardDataCache = undefined;
    Utils.removeFromSession(CacheData.CRYPTO_DASHBOARD);
  }

  getCryptoResumeCache(year: number) {
    let data = Utils.copyObject(this.cryptoResumeDataCache[year] || null);
    if (!data) return Utils.getFromSession(CacheData.CRYPTO_RESUME + year);
    return data;
  }

  cacheCryptoResumeData(response: any, year: number) {
    if (environment.cacheEnable) {
      this.cryptoResumeDataCache[year] = Utils.copyObject(response);
      Utils.setInSession(CacheData.CRYPTO_RESUME + year, response);
    }
  }

  private removeCryptoResumeData(): void {
    this.cryptoResumeDataCache = {}; // Resetta la cache in memoria

    // Rimuovi tutte le chiavi relative a RESUME dal sessionStorage
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && key.startsWith(CacheData.CRYPTO_RESUME)) {
        Utils.removeFromSession(key);
        i--; // Aggiorna l'indice per compensare la rimozione
      }
    }
  }

  getCryptoHistoryCache() {
    let data = Utils.copyObject(this.historyCryptoDataCache);
    if (!data) return Utils.getFromSession(CacheData.CRYPTO_HISTORY);
    return data;
  }

  cacheCryptoHistoryData(response: any) {
    if (environment.cacheEnable) {
      this.historyCryptoDataCache = Utils.copyObject(response);
      Utils.setInSession(CacheData.CRYPTO_HISTORY, response);
    }
  }

  private removeCryptoHistoryData() {
    this.historyCryptoDataCache = undefined;
    Utils.removeFromSession(CacheData.CRYPTO_HISTORY);
  }
  /**
   * END @Crypto_Data
   */
}
