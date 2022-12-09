import { Component, OnInit } from '@angular/core';
import { Wallet } from 'src/assets/core/data/class/dashboard.class';
import { DashboardService } from 'src/assets/core/services/dashboard.service';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss'],
})
export class WalletComponent implements OnInit {
  wallets?: Wallet[];

  constructor(private dashService: DashboardService) {}

  ngOnInit(): void {
    this.wallets = this.dashService.dashboard.wallets;
  }

  walletActive(wallets: Wallet[]): Array<Wallet> {
    return wallets.filter((w) => !w.deleted);
  }

  walletDeleted(wallets: Wallet[]): Array<Wallet> {
    return wallets.filter((w) => w.deleted);
  }
}
