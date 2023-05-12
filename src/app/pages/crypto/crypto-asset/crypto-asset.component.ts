import { Component, OnInit } from '@angular/core';
import {
  Asset,
  CryptoDashboard,
} from 'src/assets/core/data/class/crypto.class';
import { Dashboard, Wallet } from 'src/assets/core/data/class/dashboard.class';
import { ApexOptions } from 'src/assets/core/data/constant/apex.chart';
import { CryptoService } from 'src/assets/core/services/crypto.service';
import { ChartService } from 'src/assets/core/utils/chart.service';

@Component({
  selector: 'app-crypto-asset',
  templateUrl: './crypto-asset.component.html',
  styleUrls: ['./crypto-asset.component.scss'],
})
export class CryptoAssetComponent implements OnInit {
  public chartOptions?: Partial<ApexOptions>;
  cryptoDashboard: CryptoDashboard = new CryptoDashboard();
  assets: Asset[] = [];

  constructor(
    private cryptoService: CryptoService,
    private charts: ChartService
  ) {}

  ngOnInit(): void {
    this.cryptoDashboard = this.cryptoService.cryptoDashboard;
    this.assets = this.getAssetList(this.cryptoDashboard.wallets);
    let dashboard: Dashboard = new Dashboard();
    dashboard.wallets = this.cryptoDashboard.wallets;
    setTimeout(() => {
      if (this.cryptoDashboard.wallets) {
        this.chartOptions = this.charts.renderChartLine(dashboard);
      }
    }, 100);
  }

  getAssetList(wallets: Wallet[]): Asset[] {
    let allAssets: Array<Asset> = [];
    wallets.forEach((wallet) => {
      wallet.assets.forEach((asset) => {
        if (allAssets.find((a) => a.name == asset.name)) {
          const index = allAssets.indexOf(
            allAssets.find((a) => a.name == asset.name)!
          );
          allAssets[index].balance! += asset.balance!;
          allAssets[index].value! += asset.value!;
          allAssets[index].performance! =
            (allAssets[index].performance! + asset.performance!) / 2;

          // TODO: Add also operation
          asset.operations.forEach((o) => {
            allAssets[index].operations.push(o);
          });
          allAssets[index].operations.sort((o) =>
            o.exitDate != undefined ? o.exitDate : o.entryDate
          );
        } else allAssets.push(asset);
      });
    });
    return allAssets;
  }
}
