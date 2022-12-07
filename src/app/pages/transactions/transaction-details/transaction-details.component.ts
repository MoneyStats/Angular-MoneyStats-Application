import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Wallet } from 'src/assets/core/data/class/dashboard.class';
import { DashboardService } from 'src/assets/core/services/dashboard.service';
import { ScreenService } from 'src/assets/core/utils/screen.service';

@Component({
  selector: 'app-transaction-details',
  templateUrl: './transaction-details.component.html',
  styleUrls: ['./transaction-details.component.scss'],
})
export class TransactionDetailsComponent implements OnInit {
  @Input('wallet') wallet?: Wallet;
  @Input('class') class?: string;
  constructor(
    public screenService: ScreenService,
    public dashboardService: DashboardService
  ) {}

  ngOnInit(): void {
    this.screenService.setupHeader();
    this.wallet = this.dashboardService.wallet;
    this.class =
      this.wallet?.differenceLastStats === 0
        ? 'text-warning'
        : this.wallet!.differenceLastStats > 0
        ? 'text-success'
        : 'text-danger';
  }
}
