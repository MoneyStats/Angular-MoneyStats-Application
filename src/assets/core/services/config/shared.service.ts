import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Utils } from './utils.service';
import { Wallet } from '../../data/class/dashboard.class';
import { Asset, CryptoDashboard } from '../../data/class/crypto.class';
import { Coin } from '../../data/class/coin';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  environment = environment;

  private wallets: Array<Wallet> = [];
  private wallet?: Wallet;

  private cryptoCurrency: string = Coin.USD;
  private cryptoDashboard?: CryptoDashboard;
  private cryptoAssets: Array<Asset> = [];
  private cryptoWallets: Array<Wallet> = [];
  private cryptoResumeData: any;
  private cryptoHistoryData: { [year: number]: any } = {};

  /**
   * Cleaned By @CacheService
   */
  clearData() {
    this.wallet = undefined;
    this.wallets = [];
    this.cryptoCurrency = Coin.USD;
    this.cryptoDashboard = undefined;
    this.cryptoAssets = [];
    this.cryptoWallets = [];
    this.cryptoResumeData = null;
    this.cryptoHistoryData = {};
  }

  getWallet() {
    return Utils.copyObject(this.wallet);
  }

  setWallet(wallet: Wallet) {
    this.wallet = Utils.copyObject(wallet);
    return Utils.copyObject(wallet);
  }

  getWallets() {
    return Utils.copyObject(this.wallets);
  }

  setWallets(wallets: Array<Wallet>) {
    this.wallets = Utils.copyObject(wallets);
    return Utils.copyObject(wallets);
  }

  /**
   * @Crypto_Data
   */
  getCryptoDashboardData(): CryptoDashboard {
    return Utils.copyObject(this.cryptoDashboard);
  }

  setCryptoDashboardData(dashboard: any) {
    this.cryptoDashboard = Utils.copyObject(dashboard);
    if (
      Utils.isNullOrEmpty(this.cryptoWallets) &&
      !Utils.isNullOrEmpty(dashboard.wallets)
    )
      this.cryptoWallets = Utils.copyObject(dashboard.wallets);
    if (
      Utils.isNullOrEmpty(this.cryptoAssets) &&
      !Utils.isNullOrEmpty(dashboard.assets)
    )
      this.cryptoAssets = Utils.copyObject(dashboard.assets);
    this.cryptoCurrency = dashboard.currency;
    return Utils.copyObject(dashboard);
  }

  getCryptoWallets() {
    return Utils.copyObject(this.cryptoWallets);
  }

  setCryptoWallets(wallets: Array<Wallet>) {
    this.cryptoWallets = Utils.copyObject(wallets);
    return Utils.copyObject(wallets);
  }

  getCryptoResumeData() {
    return Utils.copyObject(this.cryptoResumeData);
  }

  setCryptoResumeData(resume: any) {
    this.cryptoResumeData = Utils.copyObject(resume);
    return Utils.copyObject(resume);
  }

  getCryptoAssets() {
    return Utils.copyObject(this.cryptoAssets);
  }

  setCryptoAssets(assets: Array<Asset>) {
    this.cryptoAssets = Utils.copyObject(assets);
    return Utils.copyObject(assets);
  }

  getCryptoHistoryData() {
    return Utils.copyObject(this.cryptoHistoryData);
  }

  setCryptoHistoryData(history: any) {
    this.cryptoHistoryData = Utils.copyObject(history);
    return Utils.copyObject(history);
  }

  getCryptoCurrency() {
    return Utils.copyObject(this.cryptoCurrency);
  }
}
