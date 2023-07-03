import {
  Component,
  Input,
  OnChanges,
  OnInit,
  Renderer2,
  SimpleChanges,
} from '@angular/core';
import { Router } from '@angular/router';
import {
  Asset,
  CryptoDashboard,
} from 'src/assets/core/data/class/crypto.class';
import { Wallet } from 'src/assets/core/data/class/dashboard.class';
import { ApexOptions } from 'src/assets/core/data/constant/apex.chart';
import { CryptoService } from 'src/assets/core/services/crypto.service';
import { ChartService } from 'src/assets/core/utils/chart.service';
import { deepCopy } from '@angular-devkit/core/src/utils/object';
import { ScreenService } from 'src/assets/core/utils/screen.service';
import { ImageColorPickerService } from 'src/assets/core/utils/image.color.picker.service';

@Component({
  selector: 'app-details-overview',
  templateUrl: './details-overview.component.html',
  styleUrls: ['./details-overview.component.scss'],
})
export class DetailsOverviewComponent implements OnInit, OnChanges {
  public chartOptions?: Partial<ApexOptions>;
  public chart1Y?: Partial<ApexOptions>;
  public chart3Y?: Partial<ApexOptions>;
  @Input('asset') asset: Asset = new Asset();
  @Input('assetName') assetName: string = '';
  @Input('cryptoDashboard') cryptoDashboard: CryptoDashboard =
    new CryptoDashboard();

  walletsAsset: Wallet[] = [];

  constructor(
    public cryptoService: CryptoService,
    private screenService: ScreenService,
    private charts: ChartService,
    public imageColorPicker: ImageColorPickerService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.getAsset();
  }

  ngOnInit(): void {
    //this.cryptoDashboard = deepCopy(this.cryptoService.cryptoDashboard);

    /*let dashboard: CryptoDashboard = new CryptoDashboard();
    dashboard.statsAssetsDays = this.cryptoDashboard.statsAssetsDays;
    dashboard.assets = [
      this.asset.name == undefined ? this.cryptoService.asset! : this.asset,
    ];*/
    this.getAsset();
  }

  setColor() {
    this.resetColor();
    const activeElem = document.querySelectorAll('.active');
    activeElem.forEach((e, index) => {
      if (e.getAttribute('class')?.includes('graph-tab')) {
        let color = this.imageColorPicker.getColor(this.asset.icon!, 0);
        e.setAttribute(
          'style',
          'color: ' + color + '; border-bottom-color: ' + color + ' !important'
        );
      }
    });
  }

  resetColor() {
    const activeElem = document.querySelectorAll('.graph-tab');
    activeElem.forEach((e) => {
      if (!e.getAttribute('class')?.includes('active')) {
        e.removeAttribute('style');
      }
    });
  }

  getAsset() {
    //if (this.asset.history?.find((h) => h.id == undefined)) {
    //  let indexOf = this.asset.history?.indexOf(
    //    this.asset.history?.find((h) => h.id == undefined)!
    //  );
    //  this.asset.history.splice(indexOf, 1);
    //}
    this.graph1Y();
    this.walletsAsset = this.filterWallets();
    this.setColor();
  }

  graphAll() {
    this.setColor();
    let dashboard: CryptoDashboard = deepCopy(this.cryptoDashboard);
    dashboard.assets = [
      this.asset.name == undefined
        ? deepCopy(this.cryptoService.asset!)
        : deepCopy(this.asset),
    ];
    console.log(dashboard);
    setTimeout(() => {
      if (this.cryptoDashboard.wallets) {
        if (this.screenService?.screenWidth! <= 780) {
          this.chartOptions = this.charts.renderCryptoAsset(dashboard, 200);
        } else this.chartOptions = this.charts.renderCryptoAsset(dashboard);
      }
    }, 100);
  }

  graph1Y() {
    this.setColor();
    let dashboard: CryptoDashboard = deepCopy(this.cryptoDashboard);
    dashboard.assets = [
      this.asset.name == undefined
        ? deepCopy(this.cryptoService.asset!)
        : deepCopy(this.asset),
    ];
    if (dashboard.assets[0]) {
      dashboard.assets[0].history = dashboard.assets[0].history?.filter(
        (h) =>
          h.date.toString().split('-')[0] ===
          new Date().getFullYear().toString()
      );
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
  }

  graph3Y() {
    this.setColor();
    let dashboard: CryptoDashboard = deepCopy(this.cryptoDashboard);
    dashboard.assets = [
      this.asset.name == undefined
        ? deepCopy(this.cryptoService.asset!)
        : deepCopy(this.asset),
    ];
    let last3 = [
      new Date().getFullYear().toString(),
      (new Date().getFullYear() - 1).toString(),
      (new Date().getFullYear() - 2).toString(),
    ];
    dashboard.assets[0].history = dashboard.assets[0].history?.filter((h) =>
      last3.includes(h.date.toString().split('-')[0])
    );
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

  percentageAssetInTotal(): number {
    return (this.asset.value! * 100) / this.cryptoDashboard.balance;
  }

  filterWallets(): Wallet[] {
    let name =
      this.asset.name == undefined
        ? this.cryptoService.asset?.name
        : this.asset.name;
    const dashboard = deepCopy(this.cryptoDashboard);
    let wallAsset = dashboard.wallets.filter((w) => {
      if (w.assets != undefined && w.assets.length != 0)
        return w.assets.slice().find((a) => a.name == name);
      return null;
    });
    wallAsset.forEach((w) => {
      w.assets = w.assets.slice().filter((a) => a.name == name);
      if (w.assets[0].history == undefined) {
        w.assets[0].history = [];
      }
    });
    return wallAsset;
  }
}
