import { Component, OnDestroy, OnInit } from '@angular/core';
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
import {
  ApexChartsOptions,
  ModalConstant,
  StorageConstant,
} from 'src/assets/core/data/constant/constant';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-crypto-asset',
  templateUrl: './crypto-asset.component.html',
  styleUrls: ['./crypto-asset.component.scss'],
})
export class CryptoAssetComponent implements OnInit, OnDestroy {
  cryptoAssetSubscribe: Subscription = new Subscription();

  amount: string = '******';
  hidden: boolean = false;
  public chartOptions?: Partial<ApexOptions>;
  public chart1Y?: Partial<ApexOptions>;
  public chart3Y?: Partial<ApexOptions>;
  cryptoDashboard: CryptoDashboard = new CryptoDashboard();
  assets: Asset[] = [];

  showZeroBalance: boolean = false;
  thisYear: number = new Date().getFullYear();

  constructor(
    private cryptoService: CryptoService,
    private charts: ChartService,
    private screenService: ScreenService,
    private logger: LoggerService
  ) {}

  public get modalConstant(): typeof ModalConstant {
    return ModalConstant;
  }

  ngOnDestroy(): void {
    this.cryptoAssetSubscribe.unsubscribe();
  }

  ngOnInit(): void {
    this.screenService.hideFooter();
    this.getAssets();
  }

  getAssets() {
    this.cryptoDashboard = deepCopy(this.cryptoService.cryptoDashboard);
    this.cryptoAssetSubscribe = this.cryptoService
      .getCryptoAssetsData()
      .subscribe((data) => {
        this.cryptoService.cache.cacheAssetsData(data);
        this.logger.LOG(data.message!, 'CryptoAssetComponent');
        this.assets = data.data;
        this.cryptoService.assets = data.data;
        this.cryptoDashboard.assets = data.data;
      });
    this.graph1Y();
    this.isWalletBalanceHidden();
  }

  graphAll() {
    if (!this.chartOptions) {
      let dashboard = deepCopy(this.cryptoDashboard);
      // Get All Date serve a prendere tutte le date per i grafici
      dashboard.statsAssetsDays = this.getAllDate();
      setTimeout(() => {
        if (this.cryptoDashboard.wallets) {
          if (this.screenService?.screenWidth! <= 780) {
            this.chartOptions = this.charts.renderCryptoDatas(dashboard, [
              ApexChartsOptions.MOBILE_MODE,
              ApexChartsOptions.LIVE_PRICE_AS_LAST_DATA,
            ]);
          } else
            this.chartOptions = this.charts.renderCryptoDatas(dashboard, [
              ApexChartsOptions.ULTRA_WIDE,
              ApexChartsOptions.LIVE_PRICE_AS_LAST_DATA,
            ]);
        }
      }, 500);
    }
  }

  graph1Y() {
    if (!this.chart1Y) {
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
      if (dashboard.statsAssetsDays)
        dashboard.statsAssetsDays = dashboard.statsAssetsDays.filter(
          (s) =>
            s.toString().split('-')[0] === new Date().getFullYear().toString()
        );
      setTimeout(() => {
        if (this.screenService?.screenWidth! <= 780)
          this.chart1Y = this.charts.renderCryptoDatas(dashboard, [
            ApexChartsOptions.MOBILE_MODE,
            ApexChartsOptions.LIVE_PRICE_AS_LAST_DATA,
          ]);
        else
          this.chart1Y = this.charts.renderCryptoDatas(dashboard, [
            ApexChartsOptions.ULTRA_WIDE,
            ApexChartsOptions.LIVE_PRICE_AS_LAST_DATA,
          ]);
      }, 500);
    }
  }

  graph3Y() {
    if (!this.chart3Y) {
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
          this.chart3Y = this.charts.renderCryptoDatas(dashboard, [
            ApexChartsOptions.MOBILE_MODE,
            ApexChartsOptions.LIVE_PRICE_AS_LAST_DATA,
          ]);
        else
          this.chart3Y = this.charts.renderCryptoDatas(dashboard, [
            ApexChartsOptions.ULTRA_WIDE,
            ApexChartsOptions.LIVE_PRICE_AS_LAST_DATA,
          ]);
      }, 500);
    }
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

  isWalletBalanceHidden() {
    let isHidden = JSON.parse(
      localStorage.getItem(StorageConstant.HIDDENAMOUNT)!
    );
    if (isHidden != null) {
      this.hidden = isHidden;
    }
  }
}
