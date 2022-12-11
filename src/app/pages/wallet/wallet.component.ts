import { Component, OnInit } from '@angular/core';
import { Wallet } from 'src/assets/core/data/class/dashboard.class';
import { DashboardService } from 'src/assets/core/services/dashboard.service';
import { WalletService } from 'src/assets/core/services/wallet.service';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss'],
})
export class WalletComponent implements OnInit {
  wallets: Wallet[] = [];

  constructor(private walletService: WalletService) {}

  ngOnInit(): void {
    this.walletService.getWallet().subscribe((res) => {
      this.wallets = res;
      this.walletService.walletActive = this.walletActive(res);
      this.walletService.walletDeleted = this.walletDeleted(res);
    });
  }

  walletActive(wallets: Wallet[]): Array<Wallet> {
    return wallets.filter((w) => !w.deleted);
  }

  walletDeleted(wallets: Wallet[]): Array<Wallet> {
    return wallets.filter((w) => w.deleted);
  }
}
