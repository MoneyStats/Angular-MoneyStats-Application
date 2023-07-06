import { Component, Input, OnInit } from '@angular/core';
import { Asset } from 'src/assets/core/data/class/crypto.class';
import { Wallet } from 'src/assets/core/data/class/dashboard.class';

@Component({
  selector: 'app-add-crypto-stats',
  templateUrl: './add-crypto-stats.component.html',
  styleUrls: ['./add-crypto-stats.component.scss'],
})
export class AddCryptoStatsComponent implements OnInit {
  @Input('assets') assets: Asset[] = [];
  @Input('currency') currency: string = '';
  @Input('wallets') wallets: Wallet[] = [];
  // Boolean per bottoni e titoli Add Stats
  @Input('isAddStatsSelected') isAddStatsSelected: boolean = false;
  @Input('isResumeAddAssets') isResumeAddAssets: boolean = false;

  @Input('currentIndex') currentIndex: number = 0;

  constructor() {}

  ngOnInit(): void {}
  filterWallets(wallets: Wallet[], assetName: string): Wallet[] {
    let wallAsset = wallets.filter((w) => {
      if (w.assets != undefined && w.assets.length > 0)
        return w.assets.find((a) => a.name == assetName);
      return null;
    });
    /*wallAsset.forEach((w) => {
      w.assets = w.assets.filter((a) => a.name == assetName);
    });*/
    return wallAsset;
  }

  // Mi serve per filtrare gli asset prima di fare Add Stats
  filterAsset(wallet: Wallet, assetName: string): Asset {
    return wallet.assets.find((a) => a.name == assetName)!;
  }
}
