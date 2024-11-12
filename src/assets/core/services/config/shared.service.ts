import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Utils } from './utils.service';
import { Wallet } from '../../data/class/dashboard.class';
import { Asset, CryptoDashboard } from '../../data/class/crypto.class';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  environment = environment;

  private cryptoDashboard?: CryptoDashboard;
  private cryptoAssets: Array<Asset> = [];
  private cryptoWallets: Array<Wallet> = [];
  private cryptoResumeData: any = [];

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
    return dashboard;
  }

  getCryptoWallets() {
    return Utils.copyObject(this.cryptoWallets);
  }

  setCryptoWallets(wallets: Array<Wallet>) {
    this.cryptoWallets = Utils.copyObject(wallets);
    return wallets;
  }

  getCryptoResumeData() {
    return Utils.copyObject(this.cryptoResumeData);
  }

  setCryptoResumeData(resume: any) {
    this.cryptoResumeData = Utils.copyObject(resume);
    return resume;
  }

  getCryptoAssets() {
    return Utils.copyObject(this.cryptoAssets);
  }

  setCryptoAssets(assets: Array<Asset>) {
    this.cryptoAssets = Utils.copyObject(assets);
    return assets;
  }
}
