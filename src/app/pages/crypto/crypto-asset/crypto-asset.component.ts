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
    let dashboard = deepCopy(this.cryptoDashboard);
    // Get All Date serve a prendere tutte le date per i grafici
    dashboard.statsAssetsDays = this.getAllDate();
    setTimeout(() => {
      if (this.cryptoDashboard.wallets) {
        if (this.screenService?.screenWidth! <= 780) {
          this.chartOptions = this.charts.renderCryptoAsset(dashboard, 200);
        } else this.chartOptions = this.charts.renderCryptoAsset(dashboard);
      }
    }, 100);
  }

  graph1Y() {
    let dashboard = deepCopy(this.cryptoDashboard);
    // Get All Date serve a prendere tutte le date per i grafici
    dashboard.statsAssetsDays = this.getAllDate();

    let assets: Asset[] = [];
    dashboard.assets.forEach((asset) => {
      let last1Year = asset.history?.filter(
        (h) =>
          h.date.toString().split('-')[0] ===
          new Date().getFullYear().toString()
      );
      asset.history = last1Year;
      if (asset.balance != 0) assets.push(asset);
    });
    dashboard.assets = assets;
    console.log(assets);
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
    // Get All Date serve a prendere tutte le date per i grafici
    dashboard.statsAssetsDays = this.getAllDate();
    let last3 = [
      new Date().getFullYear().toString(),
      (new Date().getFullYear() - 1).toString(),
      (new Date().getFullYear() - 2).toString(),
    ];
    let assets: Asset[] = [];
    dashboard.assets.forEach((asset, index) => {
      let last3Hist = asset.history?.filter((h) =>
        last3.includes(h.date.toString().split('-')[0])
      );
      asset.history = last3Hist;

      if (last3Hist?.length != 0) assets.push(asset);
    });
    dashboard.assets = assets;
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

  zeroBalanceSwitch() {
    return this.showZeroBalance
      ? (this.showZeroBalance = false)
      : (this.showZeroBalance = true);
  }

  getAllDate(): string[] {
    let date: string[] = [];
    this.cryptoDashboard.assets.forEach((a) =>
      a.history?.forEach((h) => {
        if (!date.find((d) => d == h.date.toString()))
          date.push(h.date.toString());
      })
    );
    date.sort();
    return date;
  }
}
