import { Component, OnInit } from '@angular/core';
import {
  Asset,
  CryptoDashboard,
} from 'src/assets/core/data/class/crypto.class';
import { ApexOptions } from 'src/assets/core/data/constant/apex.chart';
import { CryptoService } from 'src/assets/core/services/crypto.service';
import { ChartService } from 'src/assets/core/utils/chart.service';
import { ScreenService } from 'src/assets/core/utils/screen.service';
import { deepCopy } from '@angular-devkit/core/src/utils/object';
import { LoggerService } from 'src/assets/core/utils/log.service';

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

  showZeroBalance: boolean = false;

  constructor(
    private cryptoService: CryptoService,
    private charts: ChartService,
    private screenService: ScreenService,
    private logger: LoggerService
  ) {}

  ngOnInit(): void {
    this.screenService.hideFooter();
    this.cryptoDashboard = deepCopy(this.cryptoService.cryptoDashboard);
    this.cryptoService.getCryptoAssets().subscribe((data) => {
      this.logger.LOG(data.message!, 'CryptoAssetComponent');
      this.assets = data.data;
      this.cryptoService.assets = data.data;
      this.cryptoDashboard.assets = data.data;
    });
    this.graph1Y();
  }

  graphAll() {
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
    let dashboard = deepCopy(this.cryptoDashboard);
    dashboard.assets.forEach((asset) => {
      asset.history = asset.history?.filter(
        (h) =>
          h.date.toString().split('-')[0] ===
          new Date().getFullYear().toString()
      );
    });
    if (dashboard.statsAssetsDays)
      dashboard.statsAssetsDays = dashboard.statsAssetsDays.filter(
        (s) =>
          s.toString().split('-')[0] === new Date().getFullYear().toString()
      );
    setTimeout(() => {
      if (this.screenService?.screenWidth! <= 780)
        this.chart1Y = this.charts.renderCryptoAsset(dashboard, 200);
      else this.chart1Y = this.charts.renderCryptoAsset(dashboard);
    }, 200);
  }

  graph3Y() {
    let dashboard = deepCopy(this.cryptoDashboard);
    let last3 = [
      new Date().getFullYear().toString(),
      (new Date().getFullYear() - 1).toString(),
      (new Date().getFullYear() - 2).toString(),
    ];
    dashboard.assets.forEach((asset) => {
      asset.history = asset.history?.filter((h) =>
        last3.includes(h.date.toString().split('-')[0])
      );
    });
    if (dashboard.statsAssetsDays)
      dashboard.statsAssetsDays = dashboard.statsAssetsDays.filter((s) =>
        last3.includes(s.toString().split('-')[0])
      );
    setTimeout(() => {
      if (this.screenService?.screenWidth! <= 780)
        this.chart3Y = this.charts.renderCryptoAsset(dashboard, 200);
      else this.chart3Y = this.charts.renderCryptoAsset(dashboard);
    }, 200);
  }

  zeroBalanceSwitch(){
    return this.showZeroBalance ? this.showZeroBalance = false : this.showZeroBalance = true;
  }
}
