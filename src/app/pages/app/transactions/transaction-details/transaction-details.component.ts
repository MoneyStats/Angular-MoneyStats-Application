import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { slideUp } from 'src/app/shared/animations/route-animations';
import { Stats, Wallet } from 'src/assets/core/data/class/dashboard.class';
import { DashboardService } from 'src/assets/core/services/api/dashboard.service';
import { ScreenService } from 'src/assets/core/utils/screen.service';

@Component({
  selector: 'app-transaction-details',
  templateUrl: './transaction-details.component.html',
  styleUrls: ['./transaction-details.component.scss'],
})
export class TransactionDetailsComponent implements OnInit {
  @Input('wallet') wallet?: Wallet;
  @Input('class') class?: string;
  coinSymbol: string = '';
  constructor(
    public screenService: ScreenService,
    public dashboardService: DashboardService
  ) {}

  screenWidth() {
    return ScreenService.screenWidth;
  }

  ngOnInit(): void {
    ScreenService.setupHeader();
    ScreenService.hideFooter();
    this.wallet = this.dashboardService.wallet;

    if (this.wallet?.history.find((w) => w.id == undefined)) {
      let index = this.wallet.history.indexOf(
        this.wallet?.history.find((w) => w.id == undefined)!
      );
      this.wallet.history.splice(index, 1);
    }

    this.class =
      this.wallet?.differenceLastStats === 0
        ? 'text-warning'
        : this.wallet!.differenceLastStats > 0
        ? 'text-success'
        : 'text-danger';
    this.coinSymbol = this.dashboardService.coinSymbol!;
  }
}
