import { Component, OnInit } from '@angular/core';
import { Wallet } from 'src/assets/core/data/class/dashboard.class';
import { WalletService } from 'src/assets/core/services/wallet.service';
import { ScreenService } from 'src/assets/core/utils/screen.service';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss'],
})
export class WalletComponent implements OnInit {
  wallets: Wallet[] = [];

  constructor(
    private walletService: WalletService,
    public screenService: ScreenService
  ) {}

  ngOnInit(): void {
    this.screenService.setupHeader();
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
