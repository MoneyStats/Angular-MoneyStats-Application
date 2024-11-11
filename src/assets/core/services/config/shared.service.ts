import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Utils } from './utils.service';
import { Wallet } from '../../data/class/dashboard.class';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  environment = environment;

  private cryptoWallets: Array<Wallet> = [];

  getCryptoWallets() {
    return Utils.copyObject(this.cryptoWallets);
  }

  setCryptoWallets(wallets: Array<Wallet>) {
    this.cryptoWallets = Utils.copyObject(wallets);
  }
}
