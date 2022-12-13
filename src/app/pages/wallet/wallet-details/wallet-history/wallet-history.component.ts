import { Component, OnInit } from '@angular/core';
import { Wallet } from 'src/assets/core/data/class/dashboard.class';
import { WalletService } from 'src/assets/core/services/wallet.service';
import { ScreenService } from 'src/assets/core/utils/screen.service';

@Component({
  selector: 'app-wallet-history',
  templateUrl: './wallet-history.component.html',
  styleUrls: ['./wallet-history.component.scss'],
})
export class WalletHistoryComponent implements OnInit {
  wallet?: Wallet;
  constructor(
    public screenService: ScreenService,
    private walletService: WalletService
  ) {}

  ngOnInit(): void {
    this.wallet = this.walletService.walletHistory;
  }
}
