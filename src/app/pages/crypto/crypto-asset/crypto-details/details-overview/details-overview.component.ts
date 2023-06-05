import { Component, Input, OnInit, Renderer2 } from '@angular/core';
import {
  Asset,
  CryptoDashboard,
} from 'src/assets/core/data/class/crypto.class';
import { Wallet } from 'src/assets/core/data/class/dashboard.class';
import { ApexOptions } from 'src/assets/core/data/constant/apex.chart';
import { CryptoService } from 'src/assets/core/services/crypto.service';
import { ChartService } from 'src/assets/core/utils/chart.service';
import { ScreenService } from 'src/assets/core/utils/screen.service';

@Component({
  selector: 'app-details-overview',
  templateUrl: './details-overview.component.html',
  styleUrls: ['./details-overview.component.scss'],
})
export class DetailsOverviewComponent implements OnInit {
  public chartOptions?: Partial<ApexOptions>;
  public chart1Y?: Partial<ApexOptions>;
  public chart3Y?: Partial<ApexOptions>;
  @Input('asset') asset: Asset = new Asset();
  @Input('cryptoDashboard') cryptoDashboard: CryptoDashboard =
    new CryptoDashboard();

  walletsAsset: Wallet[] = [];

  constructor(
    public cryptoService: CryptoService,
    private screenService: ScreenService,
    private charts: ChartService,
    private _renderer2: Renderer2
  ) {}

  ngOnInit(): void {
    let dashboard: CryptoDashboard = new CryptoDashboard();
    dashboard.statsAssetsDays = this.cryptoDashboard.statsAssetsDays;
    dashboard.assets = [
      this.asset.name == undefined ? this.cryptoService.asset! : this.asset,
    ];
    setTimeout(() => {
      if (this.cryptoDashboard.wallets) {
        if (this.screenService?.screenWidth! <= 780) {
          this.chartOptions = this.charts.renderCryptoAsset(dashboard, 200);
        } else this.chartOptions = this.charts.renderCryptoAsset(dashboard);
      }
    }, 100);
    this.walletsAsset = this.filterWallets();
  }

  graph1Y() {
    this.asset.history?.filter(
      (h) =>
        h.date.toString().split('-')[0] === new Date().getFullYear().toString()
    );
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
    this.asset.history?.filter((h) =>
      last3.includes(h.date.toString().split('-')[0])
    );
    setTimeout(() => {
      this.chart3Y = this.charts.renderCryptoAsset(this.cryptoDashboard);
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
    let wallAsset = this.cryptoDashboard.wallets.filter((w) =>
      w.assets.find((a) => a.name == name)
    );
    wallAsset.forEach((w) => {
      w.assets = w.assets.filter((a) => a.name == name);
    });
    return wallAsset;
  }
}
