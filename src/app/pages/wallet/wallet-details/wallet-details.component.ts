import { Component, OnInit } from '@angular/core';
import { ScreenService } from 'src/assets/core/utils/screen.service';
import { ActivatedRoute } from '@angular/router';
import { Wallet } from 'src/assets/core/data/class/dashboard.class';
import { ChartOptions } from 'src/assets/core/data/constant/apex.chart';
import { ChartService } from 'src/assets/core/utils/chart.service';

@Component({
  selector: 'app-wallet-details',
  templateUrl: './wallet-details.component.html',
  styleUrls: ['./wallet-details.component.scss'],
})
export class WalletDetailsComponent implements OnInit {
  public chartOptions?: Partial<ChartOptions>;
  wallet?: Wallet;
  constructor(
    public screenService: ScreenService,
    private route: ActivatedRoute,
    private charts: ChartService
  ) {}

  ngOnInit(): void {
    this.screenService.setupHeader();
    this.route.params.subscribe((w: any) => {
      this.wallet = w;
    });
    this.renderGraph();
    if (this.screenService!.screenWidth! <= 780) {
      const image = document.getElementById('gradientSection');
      image!.style.backgroundImage = 'url(' + this.wallet!.img + ')';
      console.log(this.wallet?.img);
    }
  }

  renderGraph() {
    setTimeout(() => {
      this.chartOptions = this.charts.renderChartWallet();
    }, 100);
  }
}
