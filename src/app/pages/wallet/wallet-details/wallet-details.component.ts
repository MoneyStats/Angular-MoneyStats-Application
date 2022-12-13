import { Component, Input, OnInit } from '@angular/core';
import { ScreenService } from 'src/assets/core/utils/screen.service';
import { ActivatedRoute } from '@angular/router';
import { Stats, Wallet } from 'src/assets/core/data/class/dashboard.class';
import { ChartOptions } from 'src/assets/core/data/constant/apex.chart';
import { ChartService } from 'src/assets/core/utils/chart.service';
import { CoinSymbol } from 'src/assets/core/data/class/coin';
import { DashboardService } from 'src/assets/core/services/dashboard.service';
import { WalletService } from 'src/assets/core/services/wallet.service';

@Component({
  selector: 'app-wallet-details',
  templateUrl: './wallet-details.component.html',
  styleUrls: ['./wallet-details.component.scss'],
})
export class WalletDetailsComponent implements OnInit {
  public chartAll?: Partial<ChartOptions>;
  public chart1Y?: Partial<ChartOptions>;
  public chart3Y?: Partial<ChartOptions>;

  coinSymbol?: string;
  wallet?: Wallet;
  walletName?: string;
  @Input('percentageLastStats') percentageLastStats?: string;
  constructor(
    public screenService: ScreenService,
    private route: ActivatedRoute,
    private charts: ChartService,
    public walletService: WalletService
  ) {}

  ngOnInit(): void {
    this.screenService.setupHeader();
    this.route.params.subscribe((w: any) => {
      this.walletName = w.wallet;
    });
    this.wallet = this.walletService.walletDetails?.find(
      (w) => w.name === this.walletName
    );
    this.percentageLastStats =
      (this.wallet?.history[this.wallet?.history.length - 1].percentage! > 0
        ? '+'
        : '') +
      this.wallet?.history[this.wallet?.history.length - 1].percentage! +
      '%';
    this.renderGraph();
    if (this.screenService!.screenWidth! <= 780) {
      const image = document.getElementById('gradientSection');
      image!.style.backgroundImage = 'url(' + this.wallet!.img + ')';
    }
    this.coinSymbol = this.walletService.coinSymbol;
  }

  renderGraph() {
    setTimeout(() => {
      this.chartAll = this.charts.renderChartWallet(
        this.wallet?.name!,
        this.wallet?.history!
      );
    }, 100);
  }

  graph1Y() {
    let lastYear = this.wallet?.history.filter(
      (h) => h.date.split('-')[2] === new Date().getFullYear().toString()
    );
    setTimeout(() => {
      this.chart1Y = this.charts.renderChartWallet(
        this.wallet?.name!,
        lastYear!
      );
    }, 200);
  }

  graph3Y() {
    let last3 = [
      new Date().getFullYear().toString(),
      (new Date().getFullYear() - 1).toString(),
      (new Date().getFullYear() - 2).toString(),
    ];
    let last3Year = this.wallet?.history.filter((h) =>
      last3.includes(h.date.split('-')[2])
    );
    setTimeout(() => {
      this.chart3Y = this.charts.renderChartWallet(
        this.wallet?.name!,
        last3Year!
      );
    }, 200);
  }

  percentageWalletInTotal(): number {
    return (this.wallet!.balance * 100) / this.walletService?.totalBalance!;
  }
}
