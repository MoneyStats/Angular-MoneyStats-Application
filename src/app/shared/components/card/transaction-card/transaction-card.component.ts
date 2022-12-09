import { Component, Input, OnInit } from '@angular/core';
import { Wallet } from 'src/assets/core/data/class/dashboard.class';
import { DashboardService } from 'src/assets/core/services/dashboard.service';

@Component({
  selector: 'app-transaction-card',
  templateUrl: './transaction-card.component.html',
  styleUrls: ['./transaction-card.component.scss'],
})
export class TransactionCardComponent implements OnInit {
  @Input('wallet') wallet?: Wallet;
  @Input('differenceLastStats') differenceLastStats?: string;
  @Input('class') class?: string;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {}

  parsingWallet() {
    this.dashboardService.wallet = this.wallet;
  }
}
