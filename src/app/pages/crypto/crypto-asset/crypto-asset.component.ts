import { Component, OnInit } from '@angular/core';
import {
  Asset,
  CryptoDashboard,
} from 'src/assets/core/data/class/crypto.class';
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
  public chart1Y?: Partial<ApexOptions>;
  public chart3Y?: Partial<ApexOptions>;
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
    this.assets = this.cryptoDashboard.assets;

    setTimeout(() => {
      if (this.cryptoDashboard.wallets) {
        if (this.screenService?.screenWidth! <= 780) {
          this.chartOptions = this.charts.renderCryptoAsset(
            this.cryptoDashboard,
            200
          );
        } else
          this.chartOptions = this.charts.renderCryptoAsset(
            this.cryptoDashboard
          );
      }
    }, 100);
  }

  graph1Y() {
    this.assets.forEach((asset) => {
      asset.history?.filter(
        (h) =>
          h.date.toString().split('-')[0] ===
          new Date().getFullYear().toString()
      );
    });
    setTimeout(() => {
      this.chart1Y = this.charts.renderCryptoAsset(this.cryptoDashboard);
    }, 200);
  }

  graph3Y() {
    let last3 = [
      new Date().getFullYear().toString(),
      (new Date().getFullYear() - 1).toString(),
      (new Date().getFullYear() - 2).toString(),
    ];
    let last3Year = this.assets.forEach((asset) => {
      asset.history?.filter((h) =>
        last3.includes(h.date.toString().split('-')[0])
      );
    });
    setTimeout(() => {
      this.chart3Y = this.charts.renderCryptoAsset(this.cryptoDashboard);
    }, 200);
  }
}
