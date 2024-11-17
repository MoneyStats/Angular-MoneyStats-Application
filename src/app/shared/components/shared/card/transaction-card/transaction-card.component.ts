import { Component, Input, OnInit } from '@angular/core';
import { Asset } from 'src/assets/core/data/class/crypto.class';
import { Wallet } from 'src/assets/core/data/class/dashboard.class';
import { StorageConstant } from 'src/assets/core/data/constant/constant';
import { DashboardService } from 'src/assets/core/services/api/dashboard.service';
import { SharedService } from 'src/assets/core/services/config/shared.service';

@Component({
  selector: 'app-transaction-card',
  templateUrl: './transaction-card.component.html',
  styleUrls: ['./transaction-card.component.scss'],
})
export class TransactionCardComponent implements OnInit {
  amount: string = '******';
  @Input('hiddenAmount') hiddenAmount: boolean = false;
  @Input('assets') asset?: Asset;
  @Input('currency') currency?: string;
  @Input('wallet') wallet?: Wallet;
  @Input('differenceLastStats') differenceLastStats?: string;
  @Input('class') class?: string;

  constructor(private shared: SharedService) {}

  ngOnInit(): void {}

  parsingWallet() {
    this.shared.setWallet(this.wallet!);
  }
}
