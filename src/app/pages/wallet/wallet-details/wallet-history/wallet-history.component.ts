import { Component, OnInit } from '@angular/core';
import { Stats, Wallet } from 'src/assets/core/data/class/dashboard.class';
import { WalletService } from 'src/assets/core/services/wallet.service';
import { ScreenService } from 'src/assets/core/utils/screen.service';

@Component({
  selector: 'app-wallet-history',
  templateUrl: './wallet-history.component.html',
  styleUrls: ['./wallet-history.component.scss'],
})
export class WalletHistoryComponent implements OnInit {
  wallet?: Wallet;
  walletMap?: Map<string, Stats[]> = new Map<string, Stats[]>();
  uniqueYears: any;
  constructor(
    public screenService: ScreenService,
    private walletService: WalletService
  ) {}

  ngOnInit(): void {
    this.wallet = this.walletService.walletHistory;

    let years: Array<string> = [];
    this.wallet?.history.forEach((histor) => {
      years.push(histor.date.split('-')[0]);
    });
    this.uniqueYears = [...new Set(years)];
    this.uniqueYears.forEach((year: string) => {
      this.walletMap?.set(
        year,
        this.wallet!.history.filter((h) => h.date.includes(year))
      );
    });
  }
}
