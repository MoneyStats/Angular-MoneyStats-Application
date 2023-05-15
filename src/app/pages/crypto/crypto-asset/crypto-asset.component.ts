import { Component, OnInit } from '@angular/core';
import {
  Asset,
  CryptoDashboard,
} from 'src/assets/core/data/class/crypto.class';
import { Dashboard, Wallet } from 'src/assets/core/data/class/dashboard.class';
import { ApexOptions } from 'src/assets/core/data/constant/apex.chart';
import { CryptoService } from 'src/assets/core/services/crypto.service';
import { ChartService } from 'src/assets/core/utils/chart.service';
import { ScreenService } from 'src/assets/core/utils/screen.service';

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
    private charts: ChartService,
    private screenService: ScreenService
  ) {}

  ngOnInit(): void {
    this.screenService.hideFooter();
    this.cryptoDashboard = this.cryptoService.cryptoDashboard;
    this.assets = this.cryptoService.getAssetList(this.cryptoDashboard.wallets);
    let dashboard: CryptoDashboard = this.cryptoDashboard;
    dashboard.assets = this.assets;
    setTimeout(() => {
      if (this.cryptoDashboard.wallets) {
        this.chartOptions = this.charts.renderCryptoAsset(dashboard);
      }
    }, 100);
  }
}
